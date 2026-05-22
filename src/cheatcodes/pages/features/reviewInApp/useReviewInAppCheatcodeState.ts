import { useCallback, useEffect, useState } from 'react'
import InAppReview from 'react-native-in-app-review'

import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import {
  CREDIT_REVIEW_ELIGIBLE_KEY,
  PROFILE_STARTED_AT_KEY,
} from 'libs/reviewInApp/creditReviewTrigger'
import { readOffersViewedCount } from 'libs/reviewInApp/offersViewedCounter'
import { canRequestReview, readHistory } from 'libs/reviewInApp/reviewHistory'
import {
  OFFERS_VIEWED_REVIEW_THRESHOLD,
  REVIEW_LOCK_DURATION_MS,
  REVIEW_QUOTA_LIMIT,
} from 'libs/reviewInApp/types'
import { storage } from 'libs/storage'

export type ReviewInAppCheatcodeState = {
  isNativeAvailable: boolean
  isKillSwitchOn: boolean
  history: number[]
  promptCount: number
  quotaRemaining: number
  canRequest: boolean
  lastPromptAt: number | null
  lockUntil: number | null
  offersViewedCount: number
  offersViewedThreshold: number
  profileStartedAt: number | null
  isCreditReviewEligible: boolean
}

const computeState = (
  history: number[],
  offersViewedCount: number,
  profileStartedAt: number | null,
  isCreditReviewEligible: boolean,
  isNativeAvailable: boolean,
  isKillSwitchOn: boolean,
  now: number
): ReviewInAppCheatcodeState => {
  const lastPromptAt = history.length > 0 ? Math.max(...history) : null
  return {
    isNativeAvailable,
    isKillSwitchOn,
    history,
    promptCount: history.length,
    quotaRemaining: Math.max(0, REVIEW_QUOTA_LIMIT - history.length),
    canRequest: !isKillSwitchOn && isNativeAvailable && canRequestReview(history, now),
    lastPromptAt,
    lockUntil: lastPromptAt === null ? null : lastPromptAt + REVIEW_LOCK_DURATION_MS,
    offersViewedCount,
    offersViewedThreshold: OFFERS_VIEWED_REVIEW_THRESHOLD,
    profileStartedAt,
    isCreditReviewEligible,
  }
}

export const useReviewInAppCheatcodeState = (): {
  state: ReviewInAppCheatcodeState | null
  refresh: () => Promise<void>
} => {
  const isKillSwitchOn = useFeatureFlag(RemoteStoreFeatureFlags.WIP_DISABLE_STORE_REVIEW)
  const [state, setState] = useState<ReviewInAppCheatcodeState | null>(null)

  const refresh = useCallback(async () => {
    const now = Date.now()
    const [history, offersViewedCount, profileStartedAt, creditReviewEligible] = await Promise.all([
      readHistory(now),
      readOffersViewedCount(),
      storage.readObject<number>(PROFILE_STARTED_AT_KEY),
      storage.readObject<boolean>(CREDIT_REVIEW_ELIGIBLE_KEY),
    ])
    setState(
      computeState(
        history,
        offersViewedCount,
        typeof profileStartedAt === 'number' ? profileStartedAt : null,
        creditReviewEligible === true,
        InAppReview.isAvailable(),
        isKillSwitchOn,
        now
      )
    )
  }, [isKillSwitchOn])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return { state, refresh }
}
