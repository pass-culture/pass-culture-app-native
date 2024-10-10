package com.passculture;

import android.app.Application;
import android.util.Log;
import com.facebook.react.PackageList;
import com.facebook.hermes.reactexecutor.HermesExecutorFactory;
import com.facebook.react.bridge.JavaScriptExecutorFactory;
import com.facebook.react.ReactApplication;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.soloader.SoLoader;
import com.microsoft.codepush.react.CodePush; // @codepush
import com.passculture.DefaultBrowserPackage;

class MainApplication : Application(), ReactApplication {

    private val reactNativeHost: ReactNativeHost = object : DefaultReactNativeHost(this) {
        /*
        * Override the getJSBundleFile method in order to let
        * the CodePush runtime determine where to get the JS
        * bundle location from on each app start
        */
        override fun getJSBundleFile(): String {
            return CodePush.getJSBundleFile() // @codepush
        }

        override fun getPackages(): List<ReactPackage> =
        PackageList(this).packages.apply {
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // add(MyReactNativePackage())
          add(DefaultBrowserPackage())

        }


        override fun getJSMainModuleName(): String = "index"

        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG
        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED

    }

  override val reactHost: ReactHost
    get() = getDefaultReactHost(this.applicationContext, reactNativeHost)

    override fun onCreate() {
        super.onCreate()
        SoLoader.init(this, /* native exopackage */ false)
        if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            // If you opted-in for the New Architecture, we load the native entry point for this app.
            DefaultNewArchitectureEntryPoint.load()
        }
        ReactNativeFlipper.initializeFlipper(this, reactNativeHost.reactInstanceManager)
    }
}
