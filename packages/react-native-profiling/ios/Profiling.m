// Profiling.m

#import "Profiling.h"

#import "TMXProfiling.h"
#import "TMXProfilingConnections.h"

@implementation Profiling

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(profileDevice:(NSString *)orgId fpServer:(NSString *)fpServer callback:(RCTResponseSenderBlock)mycallback)
{
    TMXProfilingConnections *tcn = [[TMXProfilingConnections alloc] init];
    tcn.connectionTimeout = 30;  // Default value is 10 seconds
    tcn.connectionRetryCount = 2;  // Default value is 0 (no retry)

    [[TMXProfiling sharedInstance] configure:@{
        TMXOrgID:orgId,
        TMXFingerprintServer:fpServer,
        TMXProfilingConnectionsInstance:tcn
    }];

    NSArray *customAttributes = @[@"attribute 1", @"attribute 2"];

    TMXProfileHandle *profileHandle = [[TMXProfiling sharedInstance] profileDeviceUsing:@{TMXCustomAttributes : customAttributes}                                                                           callbackBlock:^(NSDictionary * _Nullable result) {
        TMXStatusCode statusCode = [[result valueForKey:TMXProfileStatus] integerValue];

        NSLog(@"Profile completed with: %s and session ID: %@", statusCode == TMXStatusCodeOk ? "OK"
              : statusCode == TMXStatusCodeNetworkTimeoutError ? "Timed out"
              : statusCode == TMXStatusCodeConnectionError     ? "Connection Error"
              : statusCode == TMXStatusCodeHostNotFoundError   ? "Host not found error"
              : statusCode == TMXStatusCodeInternalError       ? "Internal Error"
              : statusCode == TMXStatusCodeInterruptedError    ? "Interrupted"
              : "other",
              [result valueForKey:TMXSessionID]
        );
    }];

    // Session id can be collected here (to use in API call (AKA session query))
    NSLog(@"Session id is %@", profileHandle.sessionID);
    mycallback(@[profileHandle.sessionID]);
}

@end
