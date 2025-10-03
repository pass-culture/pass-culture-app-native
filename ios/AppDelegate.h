#import <UIKit/UIKit.h>
#import <React/RCTBridge.h>

@interface AppDelegate : UIResponder <UIApplicationDelegate>

@property (nonatomic, strong) UIWindow *window;
@property (nonatomic, strong) id reactNativeDelegate;
@property (nonatomic, strong) id reactNativeFactory;

@end
