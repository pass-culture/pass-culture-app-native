#import "Orientation.h"

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <ReactAppDependencyProvider/RCTAppDependencyProvider.h>
#import <React_RCTAppDelegate/RCTDefaultReactNativeFactoryDelegate.h>
#import <React_RCTAppDelegate/RCTReactNativeFactory.h>

#import "RNSplashScreen.h" // react-native-lottie-splash-screen
#import <HotUpdater/HotUpdater.h> // @hot-updater
#import <RNBatchPush/RNBatch.h>
#import <Firebase.h>
#import <React/RCTLinkingManager.h>
#import "BatchFirebaseDispatcher.h"
#import "ReactNativeConfig.h"

#import <PassCulture-Swift.h>

@interface ReactNativeDelegate : RCTDefaultReactNativeFactoryDelegate
@end


@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  ReactNativeDelegate *delegate = [[ReactNativeDelegate alloc] init];
  RCTReactNativeFactory *factory = [[RCTReactNativeFactory alloc] initWithDelegate:delegate];
  delegate.dependencyProvider = [[RCTAppDependencyProvider alloc] init];

  self.reactNativeDelegate = delegate;
  self.reactNativeFactory = factory;

  self.window = [[UIWindow alloc] initWithFrame:UIScreen.mainScreen.bounds];

  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  NSDictionary *initialProps = @{};

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
  [BatchSDK setAssociatedDomains:@[AssociatedDomain]];
  [BatchEventDispatcher addDispatcher:[BatchFirebaseDispatcher instance]];
  [RNBatch start];
  [BatchUNUserNotificationCenterDelegate registerAsDelegate];
  [BatchUNUserNotificationCenterDelegate sharedInstance].showForegroundNotifications = true;

  // Start React Native
  [factory startReactNativeWithModuleName:@"PassCulture"
                                 inWindow:self.window
                        initialProperties:initialProps
                            launchOptions:launchOptions];

  // react-native-lottie-splash-screen
  if (self.window) {
    //We add this logic to get access to rootview
    UIView *rootView = self.window.rootViewController.view;

    Dynamic *t = [Dynamic new];
    UIView *animationUIView = (UIView *)[t createAnimationViewWithRootView:rootView lottieName:@"splashscreen"];

    // register LottieSplashScreen to RNSplashScreen
    [RNSplashScreen showLottieSplash:animationUIView inRootView:rootView];
    // play lottie animation
    [t playWithAnimationView:animationUIView];
    // We want the animation layout to be forced to remove when hide is called, so we use this
    [RNSplashScreen setAnimationFinished:true];
  }

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


- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window {
  return [Orientation getOrientation];
}

@end

@implementation ReactNativeDelegate

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [HotUpdater bundleURL]; // @hot-updater
#endif
}

@end
