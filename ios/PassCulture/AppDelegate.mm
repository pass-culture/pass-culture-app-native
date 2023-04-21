#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

#import <React/RCTAppSetupUtils.h>

#import "RNSplashScreen.h" // react-native-lottie-splash-screen
#import <CodePush/CodePush.h> // @codepush
#import "RNBatch.h"
#import <Firebase.h>
#import <React/RCTLinkingManager.h>
#import "BatchFirebaseDispatcher.h"
#import "ReactNativeConfig.h"

#import <PassCulture-Swift.h>

#if RCT_NEW_ARCH_ENABLED
#import <React/CoreModulesPlugins.h>
#import <React/RCTCxxBridgeDelegate.h>
#import <React/RCTFabricSurfaceHostingProxyRootView.h>
#import <React/RCTSurfacePresenter.h>
#import <React/RCTSurfacePresenterBridgeAdapter.h>
#import <ReactCommon/RCTTurboModuleManager.h>

#import <react/config/ReactNativeConfig.h>

@interface AppDelegate () <RCTCxxBridgeDelegate, RCTTurboModuleManagerDelegate> {
  RCTTurboModuleManager *_turboModuleManager;
  RCTSurfacePresenterBridgeAdapter *_bridgeAdapter;
  std::shared_ptr<const facebook::react::ReactNativeConfig> _reactNativeConfig;
  facebook::react::ContextContainer::Shared _contextContainer;
}
@end
#endif

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  RCTAppSetupPrepareApp(application);

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];

  #if RCT_NEW_ARCH_ENABLED
    _contextContainer = std::make_shared<facebook::react::ContextContainer const>();
    _reactNativeConfig = std::make_shared<facebook::react::EmptyReactNativeConfig const>();
    _contextContainer->insert("ReactNativeConfig", _reactNativeConfig);
    _bridgeAdapter = [[RCTSurfacePresenterBridgeAdapter alloc] initWithBridge:bridge contextContainer:_contextContainer];
    bridge.surfacePresenter = _bridgeAdapter.surfacePresenter;
  #endif
  
  UIView *rootView = RCTAppSetupDefaultRootView(bridge, @"PassCulture", nil);

  if (@available(iOS 13.0, *)) {
    rootView.backgroundColor = [UIColor systemBackgroundColor];
  } else {
    rootView.backgroundColor = [UIColor whiteColor];
  }

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

  // Get environment
  NSString *plistPath = [[NSBundle mainBundle] pathForResource:@"Info" ofType:@"plist"];   
  NSDictionary *plistConfig = [[NSDictionary alloc] initWithContentsOfFile:plistPath];
  NSString* Env = [plistConfig valueForKey:@"Env"];

  // Enable Firebase debug view on testing environment
  if ([Env isEqualToString:@"testing"]) {
    NSMutableArray *newArguments = [NSMutableArray arrayWithArray:[[NSProcessInfo processInfo] arguments]];
    [newArguments addObject:@"-FIRAnalyticsDebugEnabled"];
    [newArguments addObject:@"-FIRDebugEnabled"];
    [[NSProcessInfo processInfo] setValue:[newArguments copy] forKey:@"arguments"]; 
  }
  if ([FIRApp defaultApp] == nil) {
    [FIRApp configure];
  }

  // Setup Batch
  NSString* AssociatedDomain = [ReactNativeConfig envFor:@"WEBAPP_V2_DOMAIN"];
  [Batch setAssociatedDomains:@[AssociatedDomain]];
  [BatchEventDispatcher addDispatcher:[BatchFirebaseDispatcher instance]];
  [RNBatch start];
  [BatchUNUserNotificationCenterDelegate registerAsDelegate];
  [BatchUNUserNotificationCenterDelegate sharedInstance].showForegroundNotifications = true;

  // react-native-lottie-splash-screen
  Dynamic *t = [Dynamic new];
  UIView *animationUIView = (UIView *)[t createAnimationViewWithRootView:rootView lottieName:@"splashscreen"];

  // register LottieSplashScreen to RNSplashScreen
  [RNSplashScreen showLottieSplash:animationUIView inRootView:rootView];
  // casting UIView type to AnimationView type
  AnimationView *animationView = (AnimationView *) animationUIView;
  // play lottie animation
  [t playWithAnimationView:animationView];
  // We want the animation layout to be forced to remove when hide is called, so we use this
  [RNSplashScreen setAnimationFinished:true];

  return YES;
}

// Deeplink configuration
- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}

// Handle Universal Links
- (BOOL)application:(UIApplication *)application
  continueUserActivity:(nonnull NSUserActivity *)userActivity
  restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler
{
  return [RCTLinkingManager application:application
                   continueUserActivity:userActivity
                     restorationHandler:restorationHandler];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [CodePush bundleURL]; // @codepush
#endif
}

#if RCT_NEW_ARCH_ENABLED

#pragma mark - RCTCxxBridgeDelegate

- (std::unique_ptr<facebook::react::JSExecutorFactory>)jsExecutorFactoryForBridge:(RCTBridge *)bridge
{
  _turboModuleManager = [[RCTTurboModuleManager alloc] initWithBridge:bridge
                                                             delegate:self
                                                            jsInvoker:bridge.jsCallInvoker];
  return RCTAppSetupDefaultJsExecutorFactory(bridge, _turboModuleManager);
}

#pragma mark RCTTurboModuleManagerDelegate

- (Class)getModuleClassFromName:(const char *)name
{
  return RCTCoreModulesClassProvider(name);
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const std::string &)name
                                                      jsInvoker:(std::shared_ptr<facebook::react::CallInvoker>)jsInvoker
{
  return nullptr;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const std::string &)name
                                                     initParams:
                                                         (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return nullptr;
}

- (id<RCTTurboModule>)getModuleInstanceFromClass:(Class)moduleClass
{
  return RCTAppSetupDefaultModuleFromClass(moduleClass);
}

#endif

@end
