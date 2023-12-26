import { OfferResponse, SubcategoryIdEnum } from 'api/gen'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

const MULTIVENUE_COMPATIBLE_OFFER = [
  SubcategoryIdEnum.LIVRE_PAPIER,
  SubcategoryIdEnum.LIVRE_AUDIO_PHYSIQUE,
]

const isMultivenueCompatibleOffer = (offer: OfferResponse): boolean =>
  MULTIVENUE_COMPATIBLE_OFFER.includes(offer.subcategoryId)

export const useMultivenueOffer = (offer: OfferResponse) => {
  const enableMultivenueOffer = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_MULTIVENUE_OFFER)
  const shouldFetchSearchVenueOffers = Boolean(
    enableMultivenueOffer && isMultivenueCompatibleOffer(offer) && offer.extraData?.ean
  )

  return { shouldFetchSearchVenueOffers, enableMultivenueOffer }
}
