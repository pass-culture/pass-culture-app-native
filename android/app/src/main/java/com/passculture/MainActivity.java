package com.passculture;

import android.os.Bundle; // react-native-splash-screen
import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen; // react-native-lottie-splash-screen
import com.facebook.react.ReactActivityDelegate; //@react-navigation
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;
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
        super.onCreate(null); // known fix for react-native-screens: https://github.com/software-mansion/react-native-screens#android
    }

    // @batch.com/react-native-plugin (https://doc.batch.com/react-native/sdk-integration#configure-onnewintent)
    @Override
    public void onNewIntent(Intent intent) {
        Batch.onNewIntent(this, intent);
        super.onNewIntent(intent);
    }

    /**
     * Returns the instance of the {@link ReactActivityDelegate}. Here we use a util class {@link
     * DefaultReactActivityDelegate} which allows you to easily enable Fabric and Concurrent React
     * (aka React 18) with two boolean flags.
     */
    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new DefaultReactActivityDelegate(
            this,
            getMainComponentName(),
            // If you opted-in for the New Architecture, we enable the Fabric Renderer.
            DefaultNewArchitectureEntryPoint.getFabricEnabled(), // fabricEnabled
            // If you opted-in for the New Architecture, we enable Concurrent React (i.e. React 18).
            DefaultNewArchitectureEntryPoint.getConcurrentReactEnabled() // concurrentRootEnabled
            );
    }
}
