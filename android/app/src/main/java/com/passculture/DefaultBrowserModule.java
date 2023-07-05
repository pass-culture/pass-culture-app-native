package com.passculture;

import android.content.Intent;
import android.net.Uri;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.JSApplicationIllegalArgumentException;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

// This module has been created to open app links in browser, even if user has chosen to open them inside the app (in Android settings).

public class DefaultBrowserModule extends ReactContextBaseJavaModule {
    private ReactApplicationContext _context;

    DefaultBrowserModule(ReactApplicationContext context) {
        super(context);
        this._context = context;
    }

    @NonNull
    @Override
    public String getName() {
        return "DefaultBrowserModule";
    }

    @ReactMethod
    public void openUrl(String url, Promise promise) {
        try {
            Intent emptyBrowserIntent = new Intent();
            emptyBrowserIntent
                .setAction(Intent.ACTION_VIEW)
                .addCategory(Intent.CATEGORY_BROWSABLE)
                .setData(Uri.fromParts("http", "", null));

            Intent targetIntent = new Intent();
            targetIntent
                .setAction(Intent.ACTION_VIEW)
                .addCategory(Intent.CATEGORY_BROWSABLE)
                .setData(Uri.parse(url))
                .setSelector(emptyBrowserIntent);
            
            // Through ReactApplicationContext's current activty, start a new activity
            this._context.getCurrentActivity().startActivity(targetIntent);
            promise.resolve(true);
        } catch (Exception e) {
            // We land here if the user doesn't have any browsers installed on their phone
            promise.reject(
                new JSApplicationIllegalArgumentException("Could not open URL '" + url + "': " + e.getMessage()));
        } 
    }
}