import { Tab } from 'features/favorites/types'
import { plural } from 'libs/plural'

export function getFavoritesNumberByType(nbFavorites: number, tab: Tab) {
  switch (tab) {
    case Tab.OFFERS:
      return plural(nbFavorites, {
        singular: '# offre en favori',
        plural: '# offres en favoris',
      })
    case Tab.VENUES:
      return plural(nbFavorites, {
        singular: '# lieu en favori',
        plural: '# lieux en favoris',
      })
    case Tab.ARTISTS:
      return plural(nbFavorites, {
        singular: '# artiste en favori',
        plural: '# artistes en favoris',
      })
    default:
      return undefined
  }
}
