import React from 'react'

import { NoResults } from 'ui/components/NoResults'
import { EmptyFavorites } from 'ui/svg/icons/EmptyFavorites'

export const NoFavoritesResult = () => {
  return (
    <NoResults
      explanations="Retrouve toutes tes offres en un clin d’oeil en les ajoutant à tes favoris&nbsp;!"
      icon={EmptyFavorites}
    />
  )
}
