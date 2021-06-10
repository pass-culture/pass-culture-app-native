import { IdCheckAnalyticsInterface } from '@pass-culture/id-check'

import { firebaseAnalytics } from 'libs/analytics'

export const LOG_EVENT_VALUE_MAX_LENGTH = 100

export const idCheckAnalytics: IdCheckAnalyticsInterface = {
  cancelSignUp({ pageName }: { pageName: string }) {
    firebaseAnalytics.logEvent('IdCheck_CancelSignUp', {
      pageName,
    })
  },
  identityError() {
    firebaseAnalytics.logEvent('IdCheck_IdentityError')
  },
  idValid() {
    firebaseAnalytics.logEvent('IdCheck_IDValid')
  },
  invalidAge() {
    firebaseAnalytics.logEvent('IdCheck_InvalidAge')
  },
  invalidDate() {
    firebaseAnalytics.logEvent('IdCheck_InvalidDate')
  },
  invalidDocument() {
    firebaseAnalytics.logEvent('IdCheck_InvalidDocument')
  },
  invalidTwice() {
    firebaseAnalytics.logEvent('IdCheck_InvalidTwice')
  },
  processCompleted() {
    firebaseAnalytics.logEvent('IdCheck_ProcessCompleted')
  },
  wrongSideDocument() {
    firebaseAnalytics.logEvent('IdCheck_WrongSideDocument')
  },
  missingDocument() {
    firebaseAnalytics.logEvent('IdCheck_MissingDocument')
  },
  externalLink({ href, canOpen }: { href: string; canOpen?: boolean }) {
    firebaseAnalytics.logEvent(`IdCheck_ExternalLink`, {
      href: href.slice(0, LOG_EVENT_VALUE_MAX_LENGTH),
      canOpen: canOpen ? 'true' : 'false',
    })
  },
  hasValidSession({
    valid,
    accessToken,
    accessTokenExpiresAt,
  }: {
    valid: boolean
    accessToken: string | undefined
    accessTokenExpiresAt: string | undefined
  }) {
    firebaseAnalytics.logEvent('IdCheck_HasValidSession', {
      valid,
      accessToken,
      accessTokenExpiresAt,
    })
  },
  startCheckTokens() {
    firebaseAnalytics.logEvent('IdCheck_StartCheckTokens')
  },
  endCheckTokens() {
    firebaseAnalytics.logEvent('IdCheck_EndCheckTokens')
  },
  fileSizeExceeded() {
    firebaseAnalytics.logEvent('IdCheck_FileSizeExceeded')
  },
  permissionsBlocked() {
    firebaseAnalytics.logEvent('IdCheck_PermissionsBlocked')
  },
  cameraUnavailable() {
    firebaseAnalytics.logEvent('IdCheck_CameraUnavailable')
  },
  getJouveToken({
    appIsAllowedToRenewLicenceToken,
    isLocalLicenceToken,
    licenceToken,
    licenceTokenExpirationTimestamp,
    success,
    accessToken,
    accessTokenExpiresAt,
  }: {
    appIsAllowedToRenewLicenceToken: boolean
    isLocalLicenceToken: boolean
    licenceToken: string
    licenceTokenExpirationTimestamp: string | null | undefined
    success: boolean
    accessToken: string | undefined
    accessTokenExpiresAt: string | undefined
  }) {
    firebaseAnalytics.logEvent('IdCheck_GetJouveToken', {
      appIsAllowedToRenewLicenceToken,
      isLocalLicenceToken,
      licenceToken,
      licenceTokenExpirationTimestamp,
      success,
      accessToken,
      accessTokenExpiresAt,
    })
  },
  getLicenceToken({
    isError,
    errorCode,
    licenceToken,
    licenceTokenExpirationTimestamp,
  }: {
    isError: boolean
    errorCode: string | undefined
    licenceToken: string | null | undefined
    licenceTokenExpirationTimestamp: string | null | undefined
  }) {
    firebaseAnalytics.logEvent('IdCheck_GetLicenceToken', {
      isError,
      errorCode,
      licenceToken,
      licenceTokenExpirationTimestamp,
    })
  },
}
