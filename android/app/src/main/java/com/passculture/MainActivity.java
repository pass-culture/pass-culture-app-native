package com.passculture;

import android.os.Bundle;
import org.devio.rn.splashscreen.SplashScreen;
import android.os.Bundle; // react-native-splash-screen
import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen; // react-native-splash-screen
import com.facebook.react.ReactActivityDelegate; //@react-navigation
import com.facebook.react.ReactRootView; //@react-navigation
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView; //@react-navigation
import net.zubricky.AndroidKeyboardAdjust.AndroidKeyboardAdjustPackage; // react-native-android-keyboard-adjust

public class MainActivity extends ReactActivity {
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "PassCulture";
    }

    // react-native-splash-screen
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this, R.style.SplashScreenTheme);
        super.onCreate(null);
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
