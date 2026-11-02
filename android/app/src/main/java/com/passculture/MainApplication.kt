package com.passculture

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.internal.featureflags.ReactNativeFeatureFlags
import com.facebook.react.internal.featureflags.ReactNativeNewArchitectureFeatureFlagsDefaults
import com.hotupdater.HotUpdater

class MainApplication : Application(), ReactApplication {

  override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
            context = applicationContext,
            packageList =
                    PackageList(this).packages.toMutableList().apply {
                      // This module has been added to be able to open app links in browser,
                      // even if user has chosen to open them inside the app (in Android settings).
                      add(DefaultBrowserPackage())
                    },
            jsBundleFilePath = HotUpdater.getJSBundleFile(applicationContext),
    )
  }

  override fun onCreate() {
    super.onCreate()
    loadReactNative(this)
    // loadReactNative() already set the Stable flags, and override() can only be called once.
    // Remove once IntersectionObserver ships in Stable.
    ReactNativeFeatureFlags.dangerouslyForceOverride(
        object : ReactNativeNewArchitectureFeatureFlagsDefaults() {
          override fun enableIntersectionObserverByDefault(): Boolean = true
        }
    )
  }
}
