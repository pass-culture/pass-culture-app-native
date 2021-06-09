/*!
 @header TMXProfiling.h

 @author Nick Blievers
 @copyright 2020 ThreatMetrix. All rights reserved.

 ThreatMetrix SDK for iOS. This header is the main framework header, and is required to make use of the mobile SDK.
 */
#ifndef _TMXPROFILING_H_
#define _TMXPROFILING_H_

#if defined(__has_feature) && __has_feature(modules)
@import Foundation;
@import CoreLocation;
#else
#import <Foundation/Foundation.h>
#import <CoreLocation/CoreLocation.h>
#endif

#import "TMXStatusCode.h"
#import "TMXProfileHandle.h"

#ifdef __cplusplus
#define EXTERN		extern "C" __attribute__((visibility ("default")))
#else
#define EXTERN	    extern __attribute__((visibility ("default")))
#endif

#define TMX_NAME_PASTE2( a, b) a##b
#define TMX_NAME_PASTE( a, b) TMX_NAME_PASTE2( a, b)

#ifndef TMX_PREFIX_NAME
#define NO_COMPAT_CLASS_NAME
#define TMX_PREFIX_NAME
#endif

#define TMXProfiling  TMX_NAME_PASTE(TMX_PREFIX_NAME, TMXProfiling)

/*
 * For this to work, all exported symbols must be included here
 */
#ifdef TMX_PREFIX_NAME
#define TMXOrgID                        TMX_NAME_PASTE(TMX_PREFIX_NAME, TMXOrgID)
#define TMXApiKey                       TMX_NAME_PASTE(TMX_PREFIX_NAME, TMXApiKey)
#define TMXLocationServices             TMX_NAME_PASTE(TMX_PREFIX_NAME, TMXLocationServices)
#define TMXLocationServicesOnMainThread TMX_NAME_PASTE(TMX_PREFIX_NAME, TMXLocationServicesOnMainThread)
#define TMXDesiredLocationAccuracy      TMX_NAME_PASTE(TMX_PREFIX_NAME, TMXDesiredLocationAccuracy)
#define TMXKeychainAccessGroup          TMX_NAME_PASTE(TMX_PREFIX_NAME, TMXKeychainAccessGroup)
#define TMXEnableOptions                TMX_NAME_PASTE(TMX_PREFIX_NAME, TMXEnableOptions)
#define TMXDisableOptions               TMX_NAME_PASTE(TMX_PREFIX_NAME, TMXDisableOptions)
#define TMXFingerprintServer            TMX_NAME_PASTE(TMX_PREFIX_NAME, TMXFingerprintServer)
#define TMXDisableNonFatalLog           TMX_NAME_PASTE(TMX_PREFIX_NAME, TMXDisableNonFatalLog)
#if (!TARGET_OS_IPHONE && !TARGET_OS_SIMULATOR) //macOS Only
#define TMXDisableKeychainAccess        TMX_NAME_PASTE(TMX_PREFIX_NAME, TMXDisableKeychainAccess)
#endif
#define TMXProfileTimeout               TMX_NAME_PASTE(TMX_PREFIX_NAME, TMXProfileTimeout)
#define TMXProfilingConnectionsInstance TMX_NAME_PASTE(TMX_PREFIX_NAME, TMXProfilingConnectionsInstance)

#if (TARGET_OS_IPHONE || TARGET_OS_SIMULATOR) //iOS only
#define TMXDisableAuthenticationModule  TMX_NAME_PASTE(TMX_PREFIX_NAME, TMXDisableAuthenticationModule)
#define TMXPushTokenSwizzling           TMX_NAME_PASTE(TMX_PREFIX_NAME, TMXPushTokenSwizzling)
#endif

//Profiling attributes
#define TMXSessionID                    TMX_NAME_PASTE(TMX_PREFIX_NAME, TMXSessionID)
#define TMXCustomAttributes             TMX_NAME_PASTE(TMX_PREFIX_NAME, TMXCustomAttributes)
#define TMXLocation                     TMX_NAME_PASTE(TMX_PREFIX_NAME, TMXLocation)
#define TMXProfileStatus                TMX_NAME_PASTE(TMX_PREFIX_NAME, TMXProfileStatus)

#endif

/*!
 * @abstract Return value for Strong Auth prompt
 * @see StrongAuthPromptCallback
 */
typedef enum
{
    STRONG_AUTH_OK = 0, /*!< Stepup was performed successfully. */
    STRONG_AUTH_FAILED = 1, /*!< System has rejected a stepup attempt. */
    STRONG_AUTH_CANCELLED = 2 /*!< User has chosen to abandon or reject stepup attempt. */
} StrongAuthPromptResult;


NS_ASSUME_NONNULL_BEGIN
// Configure specific options - valid for application lifecycle
/*!
 * @const TMXOrgID
 * @abstract NSDictionary key for specifying the org id.
 * @discussion Valid at init time to set the org id.
 * This is mandatory.
 */
EXTERN NSString *const TMXOrgID;

/*!
 * @const TMXFingerprintServer
 * @abstract NSDictionary key for setting a fingerprint server
 * @discussion Valid at [configure:] time setting an alternative fingerprint server
 */
EXTERN NSString *const TMXFingerprintServer;

/*!
 * @const TMXApiKey
 * @abstract NSDictionary key for specifying the API key, if one is required.
 * @discussion Valid at [configure:] time to set a key for profiling (different than session query API key)
 * @remark This key is NOT the same as the API key used for session query. Please do not
 * set unless directed by ThreatMetrix services or support, as an incorrectly configured
 * key can result in blocked profiling requests
 *
 */
EXTERN NSString *const TMXApiKey;

/*!
 * @const TMXLocationServices
 * @abstract NSDictionary key for enabling the location services.
 * @discussion Valid at [configure:] time to enable location services. Note that this will never cause UI
 * interaction -- if the application does not have permissions, no prompt will be made, and no location will be acquired.
 * Default value is \@NO (note use of NSNumber to store BOOL)
 */
EXTERN NSString *const TMXLocationServices;

/*!
 * @const TMXLocationServicesOnMainThread
 * @abstract NSDictionary key to specify if location services should be enabled on the main thread.
 * @discussion Valid at [configure:] time to enable location services on the main thread. Note that this should
 * be used in combination with TMXLocationServices.
 * @remark Using this causes location updates to happen on the main thread therefore it can block / be blocked by
 * other activities on the main thread.
 * Default value is \@NO (note use of NSNumber to store BOOL)
 */
EXTERN NSString *const TMXLocationServicesOnMainThread;

/*!
 * @const TMXDesiredLocationAccuracy
 * @abstract NSDictionary key for enabling the location services.
 * @discussion Valid at [configure:] time and configures the desired location accuracy.
 * Default value is \@1000.0 (note use of NSNumber to store float) which is equivalent to kCLLocationAccuracyKilometer
 */
EXTERN NSString *const TMXDesiredLocationAccuracy;

/*!
 * @const TMXKeychainAccessGroup
 * @abstract NSDictionary key for making use of the keychain access group.
 * @discussion Valid at [configure:] time to enable the sharing of data across applications with the same keychain access group.
 * This allows matching device ID across applications from the same vendor.
 */
EXTERN NSString *const TMXKeychainAccessGroup;

/*!
 * @const TMXEnableOption
 * @abstract NSDictionary key for setting specific options
 * @discussion Valid at [configure:] time for fine grained control over profiling.
 * @remark Please do NOT set unless directed by ThreatMetrix support or
 * services as it has direct impact on profiling behaviour.
 */
EXTERN NSString *const TMXEnableOptions;

/*!
 * @const TMXDisableOptions
 * @abstract NSDictionary key for setting specific options
 * @discussion Valid at [configure:] time for fine grained control over profiling.
 * @remark Please do NOT set unless directed by ThreatMetrix support or
 * services as it has direct impact on profiling behaviour.
 */
EXTERN NSString *const TMXDisableOptions;

/*!
 * @const TMXDisableNonFatalLog
 * @abstract NSDictionary key for disabling non-fatal SDK logs.
 * @discussion Valid at [configure:] time for fine grained control over printing non-fatal logs.
 */
EXTERN NSString *const TMXDisableNonFatalLog;


#if (TARGET_OS_IPHONE || TARGET_OS_SIMULATOR)
/*!
 * @const TMXDisableAuthenticationModule
 * @abstract NSDictionary key to allow SDK to grab an Apple Push Notification token
 * @discussion Valid at init time to disable TMXAuthentication module
 */
EXTERN NSString *const TMXDisableAuthenticationModule;

/*!
 * @const TMXPushTokenSwizzling
 * @abstract NSDictionary key to allow method swizzling in Strong Authentication.
 * @discussion Valid at init time for allowing method swizzling to get push token
 * automatically. Should be @NO in case integrity protection tools are used in the
 * final application.
 * @remark When method swizzling is enabled, configure method MUST be called
 * on the main thread and host application should NOT block the main thread. By
 * default the host application is responsible for passing push token to the
 * push token to SDK
 * Default value is \@NO (note use of NSNumber to store BOOL)
 */
EXTERN NSString *const TMXPushTokenSwizzling;
#endif

#if (!TARGET_OS_IPHONE && !TARGET_OS_SIMULATOR)
/*!
 * @const TMXKeychainAccessPrompt
 * @abstract NSDictionary key for disabling keychain access
 * @discussion By default TMX SDK accesses the keychain which will cause a user prompt, setting this option to YES will disable accessing keychain.
 * @remark This option is only valid for TMX SDK for macOS
 * Default value is \@NO (note use of NSNumber to store BOOL)
 */
EXTERN NSString *const TMXDisableKeychainAccess;
#endif

/*!
 * @const TMXProfileTimeout
 * @abstract NSDictionary key for specifying the entire profiling timeout.
 * @discussion Valid at init time to set the entire profiling timeout, defaults to 0s.
 * Default is 0, no time limit on profiling (note use of NSNumber to store int)
 */
EXTERN NSString *const TMXProfileTimeout;

/*!
 * @const TMXProfilingConnectionsInstance
 * @abstract NSDictionary key for specifying an instance implementing TMXProfilingConnectionsProtocol.
 * @discussion Valid at [configure:] time to set the an instance complying with TMXProfilingConnectionsProtocol.
 * @remark When this key is not included in configure dictionary, ThreatMetrix SDK will try to use the default TMXProfilingConnections module. In this case TMXProfilingConnections framework must be linked to the application.
 */
EXTERN NSString *const  TMXProfilingConnectionsInstance;

// Profile specific options - valid during profiling process
/*!
 * @const TMXSessionID
 * @abstract NSDictionary key for Session ID.
 * @discussion Valid at profile time, and result time for setting/retrieving the session ID.
 */
EXTERN NSString *const TMXSessionID;

/*!
 * @const TMXCustomAttributes
 * @abstract NSDictionary key for Custom Attributes. Value should be kind of NSArray class
 * @discussion Valid at profile time for setting the any custom attributes to be included in the profiling data.
 * @remark Only first 5 entries in NSArray will be passed to fingerprint server
 */
EXTERN NSString *const TMXCustomAttributes;

/*!
 * @const TMXLocation
 * @abstract NSDictionary key for setting location.
 * @discussion Valid at profile time for setting the location to be included in the profiling data.
 * @remark This should only be used if location services are not enabled.
 */
EXTERN NSString *const TMXLocation;

// Profile result options (TMXSessionID is shared)

/*!
 * @const TMXProfileStatus
 * @abstract NSDictionary key for retrieving the profiling status
 * @discussion Valid at results time for getting the status of the current profiling request.
 */
EXTERN NSString *const TMXProfileStatus;

NS_ASSUME_NONNULL_END

// NOTE: headerdoc2html gets confused if this __attribute__ is after the comment
__attribute__((visibility("default")))
/*!
 * @interface TMXProfiling
 */
@interface TMXProfiling : NSObject

- (instancetype _Null_unspecified)init NS_UNAVAILABLE;
+ (instancetype _Null_unspecified)allocWithZone:(struct _NSZone * _Nullable)zone NS_UNAVAILABLE;
+ (instancetype _Null_unspecified)new NS_UNAVAILABLE;

/*!
 * @abstract Initialise a shared instance of TMXProfiling object.
 * @discussion Only 1 instance of TMXProfiling is created per application lifecycle.
 * @code
 * TMXProfiling *TMX = [TMXProfiling sharedInstance];
 * @endcode
 *
 * @return instance of TMXProfiling
 */
+ (instancetype _Nullable)sharedInstance NS_SWIFT_NAME(sharedInstance());

/*!
 * @abstract Configures the shared instance of TMXProfiling object with the supplied configuration dictionary.
 * @discussion Only the first call to configure will use configuration dictionary, subsequent calls will be ignored
 * @code
 * [TMXProfiling sharedInstance] configure:@{
 *                                           TMXOrgID: @"my-orgid",
 *                                           TMXFingerprintServer: @"enhanced-profiling-domain"
 *                                          }]];
 * @endcode
 *
 * @remark This method runs only once, any following calls has no effect.
 * @param config NSDictionary including all required information to configure TMXProfiling instance. List of valid keys for this dictionary can be found in this header.
 * @throws An exception of type NSInvalidArgumentException if config dictionary contains invalid keys or malformed values
 *
 */
- (void)configure:(NSDictionary * _Nonnull)config NS_SWIFT_NAME(configure(configData:));

/*!
 * @abstract Performs profiling process.
 * @discussion Passing null to callback block means the caller won't be notified when profiling process is finished
 * @param callbackBlock A block interface which is fired when profiling request is completed.
 * @return TMXProfileHandle which can be used to cancel current profiling and retrieve the session id
 */
- (TMXProfileHandle * _Nonnull)profileDeviceWithCallback:(void (^ _Nullable)(NSDictionary * _Nullable))callbackBlock NS_SWIFT_NAME(profileDevice(callbackBlock:));

/*!
 * @abstract Performs profiling process.
 * @discussion Passing null to callback block means the caller won't be notified when profiling process is finished
 * @param profileOptions NSDictionary including all extra information passed to profiling. List of valid keys for this dictionary can be found in this header.
 * @param callbackBlock A block interface which is fired when profiling request is completed.
 * @return TMXProfileHandle which can be used to cancel current profiling and retrieve the session id
 */
- (TMXProfileHandle * _Nonnull)profileDeviceUsing:(NSDictionary * _Nullable)profileOptions callbackBlock:(void (^ _Nullable)(NSDictionary * _Nullable))callbackBlock NS_SWIFT_NAME(profileDevice(profileOptions:callbackBlock:));

/*!
 * @discussion Perform a registration request.
 * @param userContext the username to register this device to
 * @param prompt a message to display to the user
 * @param completionCallback a callback block to be invoked with the result of the registration request
 * @return the Session ID of registration request or nil if registration request failed to send.
 */
- (NSString * _Nullable)registerUserContext:(NSString * _Nonnull)userContext prompt:(NSString * _Nonnull)prompt completionCallback:(void (^ _Nullable)(NSDictionary * _Nullable))completionCallback NS_SWIFT_NAME(registerUserContext(userContext:prompt:completionCallback:));

/*!
 * @discussion Perform a stepup request.
 * @param prompt APN message dictionary
 * @param completionCallback A block interface which is fired when step up processing is finished
 * @return the Session ID of registration/step up request or nil if failed.
 */
- (NSString * _Nullable)processStrongAuthPrompt:(NSDictionary * _Nullable)prompt completionCallback:(void (^ _Nullable)(NSDictionary * _Nullable))completionCallback NS_SWIFT_NAME(processStrongAuthPrompt(prompt:completionCallback:));

/*!
 * @discussion Perform a stepup request.
 * @param prompt APN message dictionary
 * @return the Session ID of registration/step up request or nil if failed.
 */
-(NSString * _Nullable)processStrongAuthPrompt:(NSDictionary * _Nullable)prompt NS_SWIFT_NAME(processStrongAuthPrompt(prompt:));

/*!
 * @discussion Set a stepup token, if one wishes to use push messaging without swizzling methods.
 * @param token is a NSData object returned by Application:didRegisterForRemoteNotificationsWithDeviceToken.
 */
- (void)setStepupToken:(NSData * _Nullable)token NS_SWIFT_NAME(setStepupToken(token:));

/*!
 * @abstract Pauses or resumes location services
 * @param pause YES to pause, NO to resume
 */
- (void)pauseLocationServices:(BOOL)pause NS_SWIFT_NAME(pauseLocationServices(shouldPause:));

/*!
 * @abstract Query the build number, for debugging purposes only.
 */
- (NSString * _Nonnull)version NS_SWIFT_NAME(version());

@end

#endif /* _TMXPROFILING_H_ */
