package com.passculture;

import android.os.Bundle; // react-native-splash-screen
import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen; // react-native-lottie-splash-screen
import com.facebook.react.ReactActivityDelegate; //@react-navigation
import com.facebook.react.ReactRootView; //@react-navigation
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView; //@react-navigation
import android.content.Intent;
import com.batch.android.Batch;

public class MainActivity extends ReactActivity {
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "PassCulture";
    }

    // react-native-lottie-splash-screen
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this, R.id.lottie);
        SplashScreen.setAnimationFinished(true); // We want the animation dialog to be forced to close when hide is called, so we use this
        super.onCreate(savedInstanceState);
    }

    // @batch.com/react-native-plugin (https://doc.batch.com/react-native/sdk-integration#configure-onnewintent)
    @Override
    public void onNewIntent(Intent intent) {
        Batch.onNewIntent(this, intent);
        super.onNewIntent(intent);
    }

    // @react-navigation (https://reactnavigation.org/docs/en/next/getting-started.html)
    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName()) {
            @Override
            protected ReactRootView createRootView() {
                return new RNGestureHandlerEnabledRootView(MainActivity.this);
            }
        };
    }
}
