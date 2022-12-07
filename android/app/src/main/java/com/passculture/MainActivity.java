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
        super.onCreate(null); // known fix for react-native-screens: https://github.com/software-mansion/react-native-screens#android
    }

    // @batch.com/react-native-plugin (https://doc.batch.com/react-native/sdk-integration#configure-onnewintent)
    @Override
    public void onNewIntent(Intent intent) {
        Batch.onNewIntent(this, intent);
        super.onNewIntent(intent);
    }


    /**
     * Returns the instance of the {@link ReactActivityDelegate}. There the RootView is created and
     * you can specify the renderer you wish to use - the new renderer (Fabric) or the old renderer
     * (Paper).
     */
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

    public static class MainActivityDelegate extends ReactActivityDelegate {
        public MainActivityDelegate(ReactActivity activity, String mainComponentName) {
            super(activity, mainComponentName);
        }

        @Override
        protected ReactRootView createRootView() {
            ReactRootView reactRootView = new ReactRootView(getContext());
            // If you opted-in for the New Architecture, we enable the Fabric Renderer.
//            reactRootView.setIsFabric(BuildConfig.IS_NEW_ARCHITECTURE_ENABLED); // Disabled since we didn't add class for new architecture, read more https://stackoverflow.com/a/72057089/2127277
            reactRootView.setIsFabric(false);
            return reactRootView;
        }

        @Override
        protected boolean isConcurrentRootEnabled() {
            // If you opted-in for the New Architecture, we enable Concurrent Root (i.e. React 18).
            // More on this on https://reactjs.org/blog/2022/03/29/react-v18.html
//            return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED; // Disabled since we didn't add class for new architecture, read more https://stackoverflow.com/a/72057089/2127277
            return false;
        }
    }
}
