package com.passculture;
import android.app.Activity;
import android.app.PictureInPictureParams;
import android.content.Context;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.os.Build;
import android.util.Rational;
import android.util.Log;
import android.view.View;
import android.widget.Toast;
import androidx.annotation.Nullable;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;


public class PIPModule extends ReactContextBaseJavaModule {
    private static final String TAG = "PIPModule";
    private static final String EVENT_PIP_MODE_CHANGE = "onPictureInPictureModeChanged";

    private ReactApplicationContext reactContext;

    public PIPModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "PIPModule";
    }

@ReactMethod
public void enterPictureInPictureMode() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        Activity currentActivity = getCurrentActivity();
        if (currentActivity != null) {
            boolean supportsPIP = currentActivity.getPackageManager().hasSystemFeature(PackageManager.FEATURE_PICTURE_IN_PICTURE);
            if (supportsPIP) {
                currentActivity.enterPictureInPictureMode();
            } else {
                Toast.makeText(reactContext, "Picture-in-Picture is not supported on this device.", Toast.LENGTH_SHORT).show();
            }
        }
    } else {
        Log.w(TAG, "Picture-in-Picture requires Android Oreo (API level 26) or higher.");
    }
}

@ReactMethod
public void isPictureInPictureSupported(Promise promise) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        boolean supportsPIP = reactContext.getCurrentActivity().getPackageManager().hasSystemFeature(PackageManager.FEATURE_PICTURE_IN_PICTURE);
        promise.resolve(supportsPIP);
    } else {
        promise.resolve(false);
    }
}

public void onPictureInPictureModeChanged(boolean isInPictureInPictureMode, Configuration newConfig) {
    WritableMap params = Arguments.createMap();
    params.putBoolean("isInPictureInPictureMode", isInPictureInPictureMode);
    sendEvent(EVENT_PIP_MODE_CHANGE, params);
}

private void sendEvent(String eventName, @Nullable WritableMap params) {
    reactContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
        .emit(eventName, params);
}
    
}



