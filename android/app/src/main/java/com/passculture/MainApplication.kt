package com.passculture;

import android.app.Application;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.soloader.SoLoader;
import com.microsoft.codepush.react.CodePush; // @codepush
import com.passculture.DefaultBrowserPackage;

class MainApplication : Application(), ReactApplication {

    override val mReactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {

        override fun getPackages(): List<ReactPackage> =
          val packages = PackageList(this).packages.apply {
            // Packages that cannot be autolinked yet can be added manually here, for example:
            // packages.add(MyReactNativePackage())

            // This module has been added to be able to open app links in browser, even if user has chosen to open them inside the app (in Android settings).
            packages.add(DefaultBrowserPackage())
          }


          /*
          * Override the getJSBundleFile method in order to let
          * the CodePush runtime determine where to get the JS
          * bundle location from on each app start
          */
          override fun getJSBundleFile(): String = CodePush.getJSBundleFile() // @codepush
        
          override fun getJSMainModuleName(): String = "index"

          override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

          override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
          override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
        }

        override val reactHost: ReactHost
        get() = getDefaultReactHost(this.applicationContext, reactNativeHost)

        override fun onCreate() {
          super.onCreate()
          SoLoader.init(this, false)
          if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            // If you opted-in for the New Architecture, we load the native entry point for this app.
            load()
          }
          ReactNativeFlipper.initializeFlipper(this, reactNativeHost.reactInstanceManager)
        }
}
