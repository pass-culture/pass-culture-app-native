/*!
 @header TMXStatusCode.h

 @author Nick Blievers
 @copyright 2020 ThreatMetrix. All rights reserved.

 The statuses that are used as indicators of profiling state.
 */

#ifndef __TMXSTATUSCODE__
#define __TMXSTATUSCODE__

#if defined(__has_feature) && __has_feature(modules)
@import Foundation;
#else
#import <Foundation/Foundation.h>
#endif

/*!
 @typedef TMXStatusCode

 Possible return codes
 @constant TMXStatusCodeNotYet                   Another profiling is running.
 @constant TMXStatusCodeOk                       Completed, No errors.
 @constant TMXStatusCodeConnectionError          There was connection issue, profiling incomplete.
 @constant TMXStatusCodeHostNotFoundError        Unable to resolve the host name of the fingerprint server.
 @constant TMXStatusCodeNetworkTimeoutError      Network timed out.
 @constant TMXStatusCodeHostVerificationError    Certificate verification or other SSL failure! Potential Man In The Middle attack.
 @constant TMXStatusCodeInternalError            Internal Error, profiling incomplete or interrupted.
 @constant TMXStatusCodeInterruptedError         Request was cancelled.
 @constant TMXStatusCodePartialProfile           Connection error, only partial profile completed.
 @constant TMXStatusCodeInvalidOrgID             Request contained an invalid org id. (Internal use only)
 @constant TMXStatusCodeNotConfigured            Configure has not been called or failed.
 @constant TMXStatusCodeCertificateMismatch      Certificate hash or public key hash provided to networking module does not match with what server uses.
 @constant TMXStatusCodeInvalidParameter         A parameter was supplied that is not recognised by this version of the SDK.
 @constant TMXStatusCodeProfilingTimeoutError    Profiling process timed out, profiling incomplete
 @constant THMStatusCodeStrongAuthOK             Registration/stepup was performed successfully.
 @constant THMStatusCodeStrongAuthFailed         System has rejected registration/stepup attempt.
 @constant THMStatusCodeStrongAuthCancelled      User has chosen not to proceed with registration/stepup.
 @constant THMStatusCodeStrongAuthUnsupported    Local device is missing functionality required to execute Strong Auth request.
 @constant THMStatusCodeStrongAuthUserNotFound   User context used for Strong Auth not found.
 */
typedef NS_ENUM(NSInteger, TMXStatusCode)
{
    TMXStatusCodeStrongAuthOK=0,
    TMXStatusCodeNotYet = 0,
    TMXStatusCodeOk,
    TMXStatusCodeConnectionError,
    TMXStatusCodeHostNotFoundError,
    TMXStatusCodeNetworkTimeoutError,
    TMXStatusCodeHostVerificationError,
    TMXStatusCodeInternalError,
    TMXStatusCodeInterruptedError,
    TMXStatusCodePartialProfile,
    TMXStatusCodeInvalidOrgID,
    TMXStatusCodeNotConfigured,
    TMXStatusCodeCertificateMismatch,
    TMXStatusCodeInvalidParameter,
    TMXStatusCodeProfilingTimeoutError,
    TMXStatusCodeStrongAuthFailed,
    TMXStatusCodeStrongAuthCancelled,
    TMXStatusCodeStrongAuthUnsupported,
    TMXStatusCodeStrongAuthUserNotFound,
    TMXStatusCodeStrongAuthAlreadyRegistered
};

#endif
