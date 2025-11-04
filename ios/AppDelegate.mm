#import "Orientation.h"

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <ReactAppDependencyProvider/RCTAppDependencyProvider.h>

#import <HotUpdater/HotUpdater.h> // @hot-updater
#import <RNBatchPush/RNBatch.h>
#import <Firebase.h>
#import <React/RCTLinkingManager.h>
#import "BatchFirebaseDispatcher.h"
#import "ReactNativeConfig.h"


@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"PassCulture";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.dependencyProvider = [RCTAppDependencyProvider new];
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
  [BatchSDK setAssociatedDomains:@[AssociatedDomain]];
  [BatchEventDispatcher addDispatcher:[BatchFirebaseDispatcher instance]];
  [RNBatch start];
  [BatchUNUserNotificationCenterDelegate registerAsDelegate];
  [BatchUNUserNotificationCenterDelegate sharedInstance].showForegroundNotifications = true;

  // DEBUG: Add delay to see splash screen (remove this later)
  [NSThread sleepForTimeInterval:3.0];

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
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

- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window {
  return [Orientation getOrientation];
}

@end
