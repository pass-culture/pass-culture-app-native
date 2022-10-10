import React from 'react'

import { NoResultsView } from 'ui/components/NoResultsView'
import { EmptyFavorites } from 'ui/svg/icons/EmptyFavorites'
import { LINE_BREAK } from 'ui/theme/constants'

export const NoFavoritesResult = () => {
  const explanations =
    'Tu n’as pas encore de favori\u00a0?' +
    LINE_BREAK +
    'Explore le catalogue pass Culture et ajoute les offres en favoris pour les retrouver facilement\u00a0!'

  return (
    <NoResultsView
      title="Retrouve toutes tes offres en un clin d’oeil"
      explanations={explanations}
      icon={EmptyFavorites}
      trackingExplorerOffersFrom="favorites"
    />
  )
}
