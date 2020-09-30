package com.passculture;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate; //@react-navigation
import com.facebook.react.ReactRootView; //@react-navigation
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView; //@react-navigation

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "PassCulture";
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
