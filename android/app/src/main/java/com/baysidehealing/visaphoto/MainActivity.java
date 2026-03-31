package com.baysidehealing.visaphoto;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(ExportSharePlugin.class);
        registerPlugin(BillingPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
