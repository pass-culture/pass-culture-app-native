#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>

#import "RNSplashScreen.h" // react-native-lottie-splash-screen
#import <CodePush/CodePush.h> // @codepush
#import <RNBatchPush/RNBatch.h>
#import <Firebase.h>
#import <React/RCTLinkingManager.h>
#import "BatchFirebaseDispatcher.h"
#import "ReactNativeConfig.h"

#import <PassCulture-Swift.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"PassCulture";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

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
  BOOL success = [super application:application didFinishLaunchingWithOptions:launchOptions];
 
  if (success) {
    //This is where we will put the logic to get access to rootview
    UIView *rootView = self.window.rootViewController.view;
    
    rootView.backgroundColor = [UIColor whiteColor]; // change with your desired backgroundColor
 
    Dynamic *t = [Dynamic new];
    UIView *animationUIView = (UIView *)[t createAnimationViewWithRootView:rootView lottieName:@"logo_animated"]; // change lottieName to your lottie files name
 
    // register LottieSplashScreen to RNSplashScreen
    [RNSplashScreen showLottieSplash:animationUIView inRootView:rootView];
    // casting UIView type to AnimationView type
    AnimationView *animationView = (AnimationView *) animationUIView;
    // play
    [t playWithAnimationView:animationView];
    // If you want the animation layout to be forced to remove when hide is called, use this code
    [RNSplashScreen setAnimationFinished:true];
  }
 
  return success;
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

/// This method controls whether the `concurrentRoot`feature of React18 is turned on or off.
///
/// @see: https://reactjs.org/blog/2022/03/29/react-v18.html
/// @note: This requires to be rendering on Fabric (i.e. on the New Architecture).
/// @return: `true` if the `concurrentRoot` feature is enabled. Otherwise, it returns `false`.
- (BOOL)concurrentRootEnabled
{
  return true;
}

@end
