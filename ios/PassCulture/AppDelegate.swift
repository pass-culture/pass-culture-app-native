import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import Firebase
import HotUpdater // @hot-updater/react-native
import Batch
import BatchFirebaseDispatcher
import RNBatchPush // @batch.com/react-native-plugin
import react_native_config // react-native-config
import react_native_lottie_splash_screen // react-native-lottie-splash-screen
import react_native_orientation_locker // react-native-orientation-locker

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    // Get environment (Info.plist → Env, set per build configuration / scheme)
    guard let plistPath = Bundle.main.path(forResource: "Info", ofType: "plist"),
          let plistConfig = NSDictionary(contentsOfFile: plistPath),
          let env = plistConfig["Env"] as? String else {
      print("Could not load environment configuration")
      return false
    }

    // Enable Firebase debug view on testing environment
    if env == "testing" {
      UserDefaults.standard.set(true, forKey: "FIRAnalyticsDebugEnabled")
      UserDefaults.standard.set(true, forKey: "FIRDebugEnabled")
    }

    if FirebaseApp.app() == nil {
      FirebaseApp.configure()
    }

    // Setup Batch (push, universal links domain, Firebase dispatcher)
    configureBatch()

    // Start React Native
    factory.startReactNative(
      withModuleName: "PassCulture",
      in: window,
      launchOptions: launchOptions
    )

    if let window {
      // We add this logic to get access to rootView
      guard let rootView = window.rootViewController?.view else {
        return true
      }

      let t = Dynamic()
      let animationView = t.createAnimationView(rootView: rootView, lottieName: "splashscreen")

      // Register LottieSplashScreen to RNSplashScreen
      RNSplashScreen.showLottieSplash(animationView, inRootView: rootView)
      // Play Lottie animation
      t.play(animationView: animationView)
      // Force the animation layout to be removed when hide is called
      RNSplashScreen.setAnimationFinished(true)
    }

    return true
  }

  // Deeplink configuration
  func application(
    _ app: UIApplication,
    open url: URL,
    options: [UIApplication.OpenURLOptionsKey: Any] = [:]
  ) -> Bool {
    RCTLinkingManager.application(app, open: url, options: options)
  }

  // Handle Universal Links
  func application(
    _ application: UIApplication,
    continue userActivity: NSUserActivity,
    restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void
  ) -> Bool {
    RCTLinkingManager.application(application, continue: userActivity, restorationHandler: restorationHandler)
  }

  func application(
    _ application: UIApplication,
    supportedInterfaceOrientationsFor window: UIWindow?
  ) -> UIInterfaceOrientationMask {
    // react-native-orientation-locker
    Orientation.getOrientation()
  }

  private func configureBatch() {
    if let associatedDomain = RNCConfig.env(for: "WEBAPP_V2_DOMAIN") {
      BatchSDK.setAssociatedDomains([associatedDomain])
    }
    BatchEventDispatcher.addDispatcher(BatchFirebaseDispatcher.instance())
    RNBatch.start()
    BatchUNUserNotificationCenterDelegate.registerAsDelegate()
    BatchUNUserNotificationCenterDelegate.sharedInstance().showForegroundNotifications = true
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    HotUpdater.bundleURL() // @hot-updater/react-native
#endif
  }
}
