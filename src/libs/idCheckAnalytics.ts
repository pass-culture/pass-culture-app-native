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
}
