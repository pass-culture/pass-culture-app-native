import UIKit
internal import Expo
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import Firebase


@main
class AppDelegate: ExpoAppDelegate {
  var window: UIWindow?
 
  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    let delegate = ReactNativeDelegate()
    let factory = ExpoReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()
 
    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)
    
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
    
    PassCultureConfigureBatch()

    factory.startReactNative(
      withModuleName: "PassCulture",
      in: window,
      launchOptions: launchOptions
    )
    
    if let window {
      // We add this logic to get access to rootview
      guard let rootView = window.rootViewController?.view else {
        return super.application(application, didFinishLaunchingWithOptions: launchOptions)
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
    
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
  
  // Deeplink configuration
  override func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
    return RCTLinkingManager.application(app, open: url, options: options)
  }
  
  // Handle Universal Links
  override func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
    return RCTLinkingManager.application(application, continue: userActivity, restorationHandler: restorationHandler)
  }

  override func application(_ application: UIApplication, supportedInterfaceOrientationsFor window: UIWindow?) -> UIInterfaceOrientationMask {
    return Orientation.getOrientation()
  }
}  

class ReactNativeDelegate: ExpoReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    // needed to return the correct URL for expo-dev-client.
    bridge.bundleURL ?? bundleURL()
  }
  
  override func bundleURL() -> URL? {
#if DEBUG
    return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    return HotUpdaterBridge.bundleURL()
#endif
  } 
} 
