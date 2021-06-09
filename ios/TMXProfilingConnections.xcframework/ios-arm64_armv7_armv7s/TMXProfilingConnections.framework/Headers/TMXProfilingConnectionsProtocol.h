/*!

 @header TMXProfilingConnectionsProtocol

 @author Samin Pour
 @copyright 2020 ThreatMetrix. All rights reserved.

 ThreatMetrix Profiling Connections Protocol for iOS. This protocol should be followed if a customers want to implement customised module for networking.
*/

#ifndef __TMXPROFILINGCONNECTIONSPROTOCOL__
#define __TMXPROFILINGCONNECTIONSPROTOCOL__

#define TMX_NAME_PASTE2( a, b) a##b
#define TMX_NAME_PASTE( a, b) TMX_NAME_PASTE2( a, b)

#ifndef TMX_PREFIX_NAME
#define NO_COMPAT_CLASS_NAME
#define TMX_PREFIX_NAME
#endif

#define TMXProfilingConnectionsProtocol   TMX_NAME_PASTE(TMX_PREFIX_NAME, TMXProfilingConnectionsProtocol)
#define TMXProfilingConnectionMethod      TMX_NAME_PASTE(TMX_PREFIX_NAME, TMXProfilingConnectionMethod)
#define TMXProfilingConnectionMethodPost  TMX_NAME_PASTE(TMX_PREFIX_NAME, TMXProfilingConnectionMethodPost)
#define TMXProfilingConnectionMethodGet   TMX_NAME_PASTE(TMX_PREFIX_NAME, TMXProfilingConnectionMethodGet)

/*!
 * @abstract Enum defining HTTP request method
 */
typedef NS_ENUM(NSInteger, TMXProfilingConnectionMethod)
{
    TMXProfilingConnectionMethodPost = 0,
    TMXProfilingConnectionMethodGet  = 1
};

/*!
 * @protocol TMXProfilingConnectionProtocol
 * @abstract A protocol defining methods that TMXProfiling instances call during profiling process to send
 * and receive information to / from fingerprint server
 * @discussion Customised networking modules should comply with this protocol, otherwise profiling process behaviour is undefined.
 */
@protocol TMXProfilingConnectionsProtocol <NSObject>



@required
/*!
 * @abstract Sends HTTP request to given URL and receives the response.
 * @discussion This method is essential for a successful profiling. TMXProfiling module calls this method in different
 * stages of profiling and relies on each response.
 *
 * @remark TMXProfiling uses the error code  completionHandler to map connection errors to profiling status.
 * @code
 * kCFURLErrorCannotFindHost:              TMXStatusCodeHostNotFoundError
 * kCFURLErrorDNSLookupFailed:             TMXStatusCodeHostNotFoundError
 * kCFURLErrorTimedOut:                    TMXStatusCodeNetworkTimeoutError
 * kCFURLErrorNetworkConnectionLost:       TMXStatusCodeNetworkTimeoutError
 * kCFURLErrorServerCertificateUntrusted:  TMXStatusCodeHostVerificationError
 * kCFURLErrorSecureConnectionFailed:      TMXStatusCodeHostVerificationError
 * kCFURLErrorCancelled:                   TMXStatusCodeInterruptedError
 * kCFURLErrorUserCancelledAuthentication: TMXStatusCodeCertificateMismatch
 * any other error code:                   TMXStatusCodeConnectionError
 * @endcode
 *
 * @param url Fingerprint server
 * @param method HTTP request method, changing request method may result to incomplete/partial profiling.
 * @param headers List of HTTP request headers, removing items from the header list may result to incomplete/partial profiling.
 * @param postData Request body. Any changes to request body may result to incomplete/partial profiling.
 * @param completionHandler A handler that should be called when an HTTP response is received. Handler must be called (if it is not nil) otherwise profiling will fail.
 * This handler takes 2 following parameters:
 * 1. result - Raw HTTP response
 * 2. error - An instance of NSError to indicate any connection errors. TMXProfiling uses error.code to map connection errors to TMXStatusCode in profiling.
 */
- (void)httpProfilingRequestWithUrl:(NSURL * _Nonnull)url method:(TMXProfilingConnectionMethod)method headers:(NSDictionary * _Nullable)headers postBody:(NSData * _Nullable)postData completionHandler:(void (^_Nullable)(NSData * _Nullable result, NSError * _Nullable error))completionHandler NS_SWIFT_NAME(httpProfilingRequest(url:method:headers:postData:completionHandler:));

@required
/*!
 * @abstract This method uses a simple TCP request to detect a proxy server is being used
 * @discussion ThreatMetrix SDK calls this method during profiling, however profiling won't fail if this method has an empty body.
 * @param host Fingerprint server used for proxy ip detection.
 * @param port TCP port
 * @param data request body
 * @remark Result of proxy ip detection will be undefined if any of parameters are changed.
 */
- (void)socketProfilingRequestWithHost:(NSString * _Nonnull)host port:(int)port data:(NSData * _Nonnull)data NS_SWIFT_NAME(socketProfilingRequest(host:port:data:));

@required
/*!
 * @abstract Resolves profiling host name to detect DNS IP
 * @discussion ThreatMetrix SDK calls this method during profiling, however profiling won't fail if this method has an empty body.
 * @param host Unique host name. Any changes to this parameter may fail DNS ip detection.
 */
- (void)resolveProfilingHostName:(NSString * _Nonnull)host NS_SWIFT_NAME(resolveProfilingHostName(host:));

@required
/*!
 * @abstract Cancels profiling network requests.
 * @discusstion ThreatMetrix SDK calls this method when profiling process is cancelled to abort any in progress or queued network connections.
 */
- (void)cancelProfiling;

@end

#endif /* __PROFILINGCONNECTIONSPROTOCOL__ */
