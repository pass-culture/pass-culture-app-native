#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "RNSplashScreen.h" // react-native-splash-screen
#import <CodePush/CodePush.h> // @codepush
#import "RNBatch.h"
#import <Firebase.h>
#import <React/RCTLinkingManager.h>
#import "BatchFirebaseDispatcher.h"

#ifdef FB_SONARKIT_ENABLED
#import <FlipperKit/FlipperClient.h>
#import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
#import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
#import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
#import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
#import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>
static void InitializeFlipper(UIApplication *application) {
  FlipperClient *client = [FlipperClient sharedClient];
  SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
  [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
  [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
  [client addPlugin:[FlipperKitReactPlugin new]];
  [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
  [client start];
}
#endif

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
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

  #ifdef FB_SONARKIT_ENABLED
    InitializeFlipper(application);
  #endif

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"PassCulture"
                                            initialProperties:nil];

  [RNBatch start];
  [BatchUNUserNotificationCenterDelegate registerAsDelegate];
  [BatchUNUserNotificationCenterDelegate sharedInstance].showForegroundNotifications = true;
  [BatchEventDispatcher addDispatcher:[BatchFirebaseDispatcher instance]];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

  NSString* BatchKey = [plistConfig valueForKey:@"BATCH_API_KEY_IOS"];
  [Batch startWithAPIKey:BatchKey];

  [RNSplashScreen show]; // react-native-splash-screen
  return YES;
}

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
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [CodePush bundleURL]; // @codepush
#endif
}

@end
