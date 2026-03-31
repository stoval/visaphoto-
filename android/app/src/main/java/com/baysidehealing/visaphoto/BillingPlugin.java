package com.baysidehealing.visaphoto;

import android.app.Activity;
import androidx.annotation.NonNull;
import com.android.billingclient.api.AcknowledgePurchaseParams;
import com.android.billingclient.api.AcknowledgePurchaseResponseListener;
import com.android.billingclient.api.BillingClient;
import com.android.billingclient.api.BillingClientStateListener;
import com.android.billingclient.api.BillingFlowParams;
import com.android.billingclient.api.BillingResult;
import com.android.billingclient.api.PendingPurchasesParams;
import com.android.billingclient.api.ProductDetails;
import com.android.billingclient.api.Purchase;
import com.android.billingclient.api.PurchasesResponseListener;
import com.android.billingclient.api.QueryProductDetailsParams;
import com.android.billingclient.api.QueryPurchasesParams;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@CapacitorPlugin(name = "Billing")
public class BillingPlugin extends Plugin implements com.android.billingclient.api.PurchasesUpdatedListener {
    private BillingClient billingClient;
    private PluginCall activePurchaseCall;
    private String activeProductId;

    @Override
    public void load() {
        super.load();
        ensureClient();
    }

    @Override
    protected void handleOnDestroy() {
        if (billingClient != null) {
            billingClient.endConnection();
            billingClient = null;
        }
        super.handleOnDestroy();
    }

    @PluginMethod
    public void getStatus(PluginCall call) {
        String productId = getProductId(call);
        ensureReady(call, () -> queryStatus(productId, call));
    }

    @PluginMethod
    public void purchase(PluginCall call) {
        String productId = getProductId(call);
        Activity activity = getActivity();
        if (activity == null) {
            call.reject("Activity unavailable");
            return;
        }
        if (activePurchaseCall != null) {
            call.reject("A purchase is already in progress");
            return;
        }
        ensureReady(call, () -> launchPurchase(productId, call, activity));
    }

    private void ensureClient() {
        if (billingClient != null) return;
        billingClient = BillingClient.newBuilder(getContext())
            .setListener(this)
            .enablePendingPurchases(
                PendingPurchasesParams.newBuilder().enableOneTimeProducts().build()
            )
            .build();
    }

    private void ensureReady(PluginCall call, Runnable onReady) {
        ensureClient();
        if (billingClient.isReady()) {
            onReady.run();
            return;
        }
        billingClient.startConnection(new BillingClientStateListener() {
            @Override
            public void onBillingSetupFinished(@NonNull BillingResult billingResult) {
                if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                    onReady.run();
                } else {
                    call.reject(getBillingMessage("Billing setup failed", billingResult));
                }
            }

            @Override
            public void onBillingServiceDisconnected() {
                // Reconnect lazily on next request.
            }
        });
    }

    private void queryStatus(String productId, PluginCall call) {
        queryProductDetails(productId, new ProductDetailsCallback() {
            @Override
            public void onSuccess(ProductDetails details) {
                queryOwnedPurchases(productId, new PurchaseStatusCallback() {
                    @Override
                    public void onResult(boolean owned, Purchase purchase) {
                        JSObject result = buildStatusResult(productId, details, owned, purchase);
                        call.resolve(result);
                    }
                }, call);
            }
        }, call);
    }

    private void launchPurchase(String productId, PluginCall call, Activity activity) {
        queryProductDetails(productId, new ProductDetailsCallback() {
            @Override
            public void onSuccess(ProductDetails details) {
                BillingFlowParams.ProductDetailsParams.Builder productParams =
                    BillingFlowParams.ProductDetailsParams.newBuilder()
                        .setProductDetails(details);

                ProductDetails.OneTimePurchaseOfferDetails oneTime =
                    details.getOneTimePurchaseOfferDetails();
                if (oneTime != null && oneTime.getOfferToken() != null && !oneTime.getOfferToken().isEmpty()) {
                    productParams.setOfferToken(oneTime.getOfferToken());
                }

                BillingFlowParams flowParams = BillingFlowParams.newBuilder()
                    .setProductDetailsParamsList(Collections.singletonList(productParams.build()))
                    .build();

                activePurchaseCall = call;
                activeProductId = productId;
                BillingResult result = billingClient.launchBillingFlow(activity, flowParams);
                if (result.getResponseCode() != BillingClient.BillingResponseCode.OK) {
                    activePurchaseCall = null;
                    activeProductId = null;
                    call.reject(getBillingMessage("Unable to launch purchase flow", result));
                }
            }
        }, call);
    }

    private void queryProductDetails(String productId, ProductDetailsCallback callback, PluginCall call) {
        QueryProductDetailsParams.Product product = QueryProductDetailsParams.Product.newBuilder()
            .setProductId(productId)
            .setProductType(BillingClient.ProductType.INAPP)
            .build();

        QueryProductDetailsParams params = QueryProductDetailsParams.newBuilder()
            .setProductList(Collections.singletonList(product))
            .build();

        billingClient.queryProductDetailsAsync(params, (billingResult, productDetailsResult) -> {
            if (billingResult.getResponseCode() != BillingClient.BillingResponseCode.OK) {
                call.reject(getBillingMessage("Unable to load product details", billingResult));
                return;
            }

            List<ProductDetails> list = productDetailsResult.getProductDetailsList();
            if (list == null || list.isEmpty()) {
                call.reject("Product not found in Google Play: " + productId);
                return;
            }

            callback.onSuccess(list.get(0));
        });
    }

    private void queryOwnedPurchases(String productId, PurchaseStatusCallback callback, PluginCall call) {
        QueryPurchasesParams params = QueryPurchasesParams.newBuilder()
            .setProductType(BillingClient.ProductType.INAPP)
            .build();

        billingClient.queryPurchasesAsync(params, new PurchasesResponseListener() {
            @Override
            public void onQueryPurchasesResponse(@NonNull BillingResult billingResult, @NonNull List<Purchase> purchases) {
                if (billingResult.getResponseCode() != BillingClient.BillingResponseCode.OK) {
                    call.reject(getBillingMessage("Unable to query purchases", billingResult));
                    return;
                }

                Purchase ownedPurchase = findOwnedPurchase(productId, purchases);
                callback.onResult(ownedPurchase != null, ownedPurchase);
            }
        });
    }

    private Purchase findOwnedPurchase(String productId, List<Purchase> purchases) {
        if (purchases == null) return null;
        for (Purchase purchase : purchases) {
            if (purchase.getPurchaseState() != Purchase.PurchaseState.PURCHASED) continue;
            List<String> products = purchase.getProducts();
            if (products != null && products.contains(productId)) {
                return purchase;
            }
        }
        return null;
    }

    private JSObject buildStatusResult(String productId, ProductDetails details, boolean owned, Purchase purchase) {
        JSObject result = new JSObject();
        result.put("productId", productId);
        result.put("ready", billingClient != null && billingClient.isReady());
        result.put("available", details != null);
        result.put("owned", owned);
        result.put("acknowledged", purchase != null && purchase.isAcknowledged());
        if (details != null) {
            result.put("title", details.getTitle());
            result.put("description", details.getDescription());
            ProductDetails.OneTimePurchaseOfferDetails oneTime = details.getOneTimePurchaseOfferDetails();
            if (oneTime != null) {
                result.put("price", oneTime.getFormattedPrice());
                result.put("priceAmountMicros", oneTime.getPriceAmountMicros());
                result.put("priceCurrencyCode", oneTime.getPriceCurrencyCode());
            }
        }
        return result;
    }

    @Override
    public void onPurchasesUpdated(@NonNull BillingResult billingResult, List<Purchase> purchases) {
        if (activePurchaseCall == null) return;

        int code = billingResult.getResponseCode();
        if (code == BillingClient.BillingResponseCode.USER_CANCELED) {
            activePurchaseCall.reject("Purchase canceled");
            activePurchaseCall = null;
            activeProductId = null;
            return;
        }

        if (code != BillingClient.BillingResponseCode.OK || purchases == null || purchases.isEmpty()) {
            activePurchaseCall.reject(getBillingMessage("Purchase failed", billingResult));
            activePurchaseCall = null;
            activeProductId = null;
            return;
        }

        Purchase ownedPurchase = findOwnedPurchase(activeProductId, purchases);
        if (ownedPurchase == null) {
            activePurchaseCall.reject("Purchase completed but entitlement was not found");
            activePurchaseCall = null;
            activeProductId = null;
            return;
        }

        finalizePurchase(ownedPurchase);
    }

    private void finalizePurchase(Purchase purchase) {
        if (purchase.isAcknowledged()) {
            resolvePurchaseSuccess(purchase);
            return;
        }

        AcknowledgePurchaseParams params = AcknowledgePurchaseParams.newBuilder()
            .setPurchaseToken(purchase.getPurchaseToken())
            .build();

        billingClient.acknowledgePurchase(params, new AcknowledgePurchaseResponseListener() {
            @Override
            public void onAcknowledgePurchaseResponse(@NonNull BillingResult billingResult) {
                if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                    resolvePurchaseSuccess(purchase);
                } else {
                    if (activePurchaseCall != null) {
                        activePurchaseCall.reject(getBillingMessage("Purchase acknowledged failed", billingResult));
                    }
                    activePurchaseCall = null;
                    activeProductId = null;
                }
            }
        });
    }

    private void resolvePurchaseSuccess(Purchase purchase) {
        if (activePurchaseCall == null) return;
        JSObject result = new JSObject();
        result.put("productId", activeProductId);
        result.put("owned", true);
        result.put("purchaseToken", purchase.getPurchaseToken());
        List<String> products = purchase.getProducts();
        result.put("products", products == null ? new ArrayList<>() : new ArrayList<>(products));
        activePurchaseCall.resolve(result);
        activePurchaseCall = null;
        activeProductId = null;
    }

    private String getProductId(PluginCall call) {
        String productId = call.getString("productId");
        if (productId == null || productId.trim().isEmpty()) {
            return "visaphoto_premium_unlock";
        }
        return productId.trim();
    }

    private String getBillingMessage(String prefix, BillingResult result) {
        String message = result == null ? "" : result.getDebugMessage();
        if (message == null || message.trim().isEmpty()) {
            return prefix;
        }
        return prefix + ": " + message;
    }

    private interface ProductDetailsCallback {
        void onSuccess(ProductDetails details);
    }

    private interface PurchaseStatusCallback {
        void onResult(boolean owned, Purchase purchase);
    }
}
