import { useAuthContext } from 'features/auth/context/AuthContext'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { isCurrentOrFormerBeneficiary } from 'shared/user/checkStatusType'

// Temporary hackathon override forcing the feature flag on in local dev (never under jest): remove it once the remote flag is set
const FORCE_GENERAL_PUBLIC_HOME_IN_DEV = __DEV__ && process.env.NODE_ENV !== 'test'

export const useShouldDisplayGeneralPublicHome = (): boolean => {
  const isGeneralPublicHomeEnabled = useFeatureFlag(RemoteStoreFeatureFlags.WIP_GENERAL_PUBLIC_HOME)
  const { isLoggedIn, user } = useAuthContext()

  if (!isGeneralPublicHomeEnabled && !FORCE_GENERAL_PUBLIC_HOME_IN_DEV) return false

  return !isLoggedIn || !isCurrentOrFormerBeneficiary(user)
}
