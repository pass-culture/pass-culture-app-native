#import "HotUpdaterBridge.h"

#import <HotUpdater/HotUpdater.h>

@implementation HotUpdaterBridge

+ (NSURL *)bundleURL {
  return [HotUpdater bundleURL];
}

@end
