import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import CodePush
import HotUpdater
import RNBatchPush
import Firebase
import Batch
import Lottie


@main
class AppDelegate: RCTAppDelegate {
  override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    self.moduleName = "PassCulture"
    self.dependencyProvider = RCTAppDependencyProvider()
    
    // You can add your custom initial props in the dictionary below.
    // They will be passed down to the ViewController used by React Native.
    self.initialProps = [:]
    
    // Get environment
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
    
    // Setup Batch
    let associatedDomain = ReactNativeConfig.env(for: "WEBAPP_V2_DOMAIN")
    BatchSDK.associatedDomains = associatedDomain.map { [$0] } ?? []
    BatchEventDispatcher.add(BatchFirebaseDispatcher.instance())
    RNBatch.start()
    BatchUNUserNotificationCenterDelegate.registerAsDelegate()
    BatchUNUserNotificationCenterDelegate.sharedInstance.showForegroundNotifications = true
    
    // react-native-lottie-splash-screen
    let success = super.application(application, didFinishLaunchingWithOptions: launchOptions)
    
    if success {
      // We add this logic to get access to rootview
      guard let rootView = self.window.rootViewController?.view else {
        return success
      }
      
      let t = Dynamic()
      let animationView = t.createAnimationView(rootView: rootView, lottieName: "splashscreen")
      
      // register LottieSplashScreen to RNSplashScreen
      RNSplashScreen.showLottieSplash(animationView, inRootView: rootView)
      // play lottie animation
      t.play(animationView: animationView)
      // We want the animation layout to be forced to remove when hide is called, so we use this
      RNSplashScreen.setAnimationFinished(true)
    }
    
    return success
  }
  
  // Deeplink configuration
  override func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
    return RCTLinkingManager.application(app, open: url, options: options)
  }
  
  // Handle Universal Links
  override func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
    return RCTLinkingManager.application(application, continue: userActivity, restorationHandler: restorationHandler)
  }
  
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    return self.bundleURL()
  }
  
  override func bundleURL() -> URL? {
#if DEBUG
    return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    return HotUpdater.bundleURL()
#endif
  }
  
  override func application(_ application: UIApplication, supportedInterfaceOrientationsFor window: UIWindow?) -> UIInterfaceOrientationMask {
    return Orientation.getOrientation()
  }
} 
