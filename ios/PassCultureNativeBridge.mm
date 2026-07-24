#import "PassCultureNativeBridge.h"

#import "BatchFirebaseDispatcher.h"
#import "RNCConfig.h"
#import <Batch/Batch.h>
#import <RNBatchPush/RNBatch.h>

void PassCultureConfigureBatch(void) {
  NSString *associatedDomain = [RNCConfig envFor:@"WEBAPP_V2_DOMAIN"];
  if (associatedDomain != nil) {
    [BatchSDK setAssociatedDomains:@[associatedDomain]];
  }
  [BatchEventDispatcher addDispatcher:[BatchFirebaseDispatcher instance]];
  [RNBatch start];
  [BatchUNUserNotificationCenterDelegate registerAsDelegate];
  [BatchUNUserNotificationCenterDelegate sharedInstance].showForegroundNotifications = YES;
}
