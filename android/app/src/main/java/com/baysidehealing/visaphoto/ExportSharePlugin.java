package com.baysidehealing.visaphoto;

import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Intent;
import android.media.MediaScannerConnection;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Base64;
import androidx.core.content.FileProvider;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;

@CapacitorPlugin(name = "ExportShare")
public class ExportSharePlugin extends Plugin {

    @PluginMethod
    public void saveToGallery(PluginCall call) {
        String filename = call.getString("filename");
        String mimeType = call.getString("mimeType", "image/jpeg");
        String dataUrl = call.getString("dataUrl");
        String albumName = call.getString("albumName", "Visa Photo");

        if (filename == null || filename.trim().isEmpty()) {
            call.reject("Missing filename");
            return;
        }
        if (dataUrl == null || dataUrl.trim().isEmpty()) {
            call.reject("Missing dataUrl");
            return;
        }

        try {
            byte[] bytes = decodeDataUrl(dataUrl);
            String safeFilename = sanitizeFilename(filename);
            String safeAlbumName = sanitizeAlbumName(albumName);
            String relativePath = Environment.DIRECTORY_PICTURES + "/" + safeAlbumName;
            ContentResolver resolver = getContext().getContentResolver();

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                ContentValues values = new ContentValues();
                values.put(MediaStore.Images.Media.DISPLAY_NAME, safeFilename);
                values.put(MediaStore.Images.Media.MIME_TYPE, mimeType);
                values.put(MediaStore.Images.Media.RELATIVE_PATH, relativePath);
                values.put(MediaStore.Images.Media.IS_PENDING, 1);

                Uri uri = resolver.insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values);
                if (uri == null) {
                    call.reject("Unable to create gallery item");
                    return;
                }

                try (OutputStream out = resolver.openOutputStream(uri)) {
                    if (out == null) {
                        call.reject("Unable to open gallery output stream");
                        return;
                    }
                    out.write(bytes);
                }

                ContentValues publishValues = new ContentValues();
                publishValues.put(MediaStore.Images.Media.IS_PENDING, 0);
                resolver.update(uri, publishValues, null, null);

                JSObject result = new JSObject();
                result.put("uri", uri.toString());
                result.put("relativePath", relativePath);
                call.resolve(result);
                return;
            }

            File picturesDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES);
            File albumDir = new File(picturesDir, safeAlbumName);
            if (!albumDir.exists() && !albumDir.mkdirs()) {
                call.reject("Unable to create gallery directory");
                return;
            }

            File outFile = new File(albumDir, safeFilename);
            try (FileOutputStream output = new FileOutputStream(outFile, false)) {
                output.write(bytes);
            }

            MediaScannerConnection.scanFile(
                getContext(),
                new String[] { outFile.getAbsolutePath() },
                new String[] { mimeType },
                null
            );

            JSObject result = new JSObject();
            result.put("path", outFile.getAbsolutePath());
            result.put("relativePath", relativePath);
            call.resolve(result);
        } catch (IllegalArgumentException | IOException e) {
            call.reject("Unable to save to gallery", e);
        }
    }

    @PluginMethod
    public void shareFile(PluginCall call) {
        String filename = call.getString("filename");
        String mimeType = call.getString("mimeType", "image/png");
        String dataUrl = call.getString("dataUrl");

        if (filename == null || filename.trim().isEmpty()) {
            call.reject("Missing filename");
            return;
        }
        if (dataUrl == null || dataUrl.trim().isEmpty()) {
            call.reject("Missing dataUrl");
            return;
        }

        try {
            byte[] bytes = decodeDataUrl(dataUrl);
            File exportDir = new File(getContext().getCacheDir(), "shared_exports");
            if (!exportDir.exists() && !exportDir.mkdirs()) {
                call.reject("Unable to prepare share cache");
                return;
            }

            File outFile = new File(exportDir, sanitizeFilename(filename));
            try (FileOutputStream output = new FileOutputStream(outFile, false)) {
                output.write(bytes);
            }

            Uri uri = FileProvider.getUriForFile(
                getContext(),
                getContext().getPackageName() + ".fileprovider",
                outFile
            );

            Intent intent = new Intent(Intent.ACTION_SEND);
            intent.setType(mimeType != null && !mimeType.isEmpty() ? mimeType : "application/octet-stream");
            intent.putExtra(Intent.EXTRA_STREAM, uri);
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

            Intent chooser = Intent.createChooser(intent, "Share photo");
            chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getActivity().startActivity(chooser);

            JSObject result = new JSObject();
            result.put("path", outFile.getAbsolutePath());
            call.resolve(result);
        } catch (IllegalArgumentException | IOException e) {
            call.reject("Unable to share file", e);
        }
    }

    private byte[] decodeDataUrl(String dataUrl) {
        int commaIndex = dataUrl.indexOf(',');
        String base64 = commaIndex >= 0 ? dataUrl.substring(commaIndex + 1) : dataUrl;
        return Base64.decode(base64, Base64.DEFAULT);
    }

    private String sanitizeFilename(String filename) {
        String safe = filename.replaceAll("[\\\\/:*?\"<>|]", "_").trim();
        return safe.isEmpty() ? "visa-photo.png" : safe;
    }

    private String sanitizeAlbumName(String albumName) {
        String safe = albumName == null ? "" : albumName.replaceAll("[\\\\/:*?\"<>|]", "_").trim();
        return safe.isEmpty() ? "Visa Photo" : safe;
    }
}
