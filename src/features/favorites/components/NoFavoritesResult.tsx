import React, { FunctionComponent } from 'react'

import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { remoteIllustrationUrls } from 'shared/illustrations/remoteIllustrations'
import { NoResultsView } from 'ui/components/NoResultsView'
import { RemoteIllustration } from 'ui/components/RemoteIllustration'
import { EmptyFavorites } from 'ui/svg/icons/EmptyFavorites'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { LINE_BREAK } from 'ui/theme/constants'

const EmptyFavoritesIcon: FunctionComponent<AccessibleIcon> = (props) => (
  <EmptyFavorites testID="empty-favorites-icon" {...props} />
)

export const NoFavoritesResult = () => {
  const enableNewVisionUi = useFeatureFlag(RemoteStoreFeatureFlags.WIP_NEW_VISION_UI)

  const explanations =
    'Tu n’as pas encore de favori\u00a0?' +
    LINE_BREAK +
    'Explore le catalogue pass Culture et ajoute les offres en favori pour les retrouver facilement\u00a0!'

  return (
    <NoResultsView
      title="Retrouve toutes tes offres en un clin d’oeil"
      explanations={explanations}
      icon={enableNewVisionUi ? undefined : EmptyFavoritesIcon}
      trackingExplorerOffersFrom="favorites"
      remoteIllustration={
        enableNewVisionUi ? (
          <RemoteIllustration
            url={remoteIllustrationUrls.emptyHeartBoxLarge}
            backgroundColor="pending01"
            testID="remote-illustration"
          />
        ) : undefined
      }
    />
  )
}
