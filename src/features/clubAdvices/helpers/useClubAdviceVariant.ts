import { SubcategoryIdEnum } from 'api/gen'
import { AdviceVariantInfo } from 'features/advices/types'
import { clubAdviceVariant } from 'features/clubAdvices/helpers/clubAdviceVariant'
import { isSceneClubSubcategory } from 'features/clubAdvices/helpers/isSceneClubSubcategory'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

export const useClubAdviceVariant = (
  subcategoryId?: SubcategoryIdEnum
): AdviceVariantInfo | undefined => {
  const enableSceneClub = useFeatureFlag(RemoteStoreFeatureFlags.WIP_SCENE_CLUB)

  if (!subcategoryId) return undefined
  if (!enableSceneClub && isSceneClubSubcategory(subcategoryId)) return undefined

  return clubAdviceVariant[subcategoryId]
}
