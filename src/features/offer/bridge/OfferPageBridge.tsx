import React from 'react'

import { Offer as OldOffer } from 'features/offer/pages/Offer/Offer'
import { Offer as NewOffer } from 'features/offerRefacto/pages/OfferPage'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

export const OfferPageBridge = () => {
  const isOfferRefactoEnabled = useFeatureFlag(RemoteStoreFeatureFlags.WIP_OFFER_REFACTO)

  return isOfferRefactoEnabled ? <NewOffer /> : <OldOffer />
}
