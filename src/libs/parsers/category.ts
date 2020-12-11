import { AlgoliaCategory } from 'libs/algolia'
import { Category } from 'ui/svg/icons/categories'
import { IconInterface } from 'ui/svg/icons/types'

// All offers without category are the 'Art' ones
const DEFAULT_CATEGORY = 'Art'

// Map the facetFilter (in algolia) to the label displayed in the front
const MAP_CATEGORY_TO_LABEL: { [k in AlgoliaCategory]: string } = {
  CINEMA: 'Cinéma',
  VISITE: 'Visite',
  MUSIQUE: 'Musique',
  SPECTACLE: 'Spectacle',
  LECON: 'Cours',
  LIVRE: 'Livre',
  FILM: 'Films',
  PRESSE: 'Presse',
  JEUX_VIDEO: 'Jeux',
  CONFERENCE: 'Rencontre',
  INSTRUMENT: 'Musique',
}

export const parseCategory = (category: AlgoliaCategory | null): string => {
  if (category && category in MAP_CATEGORY_TO_LABEL) return MAP_CATEGORY_TO_LABEL[category]
  return DEFAULT_CATEGORY || ''
}

// Map the facetFilter (in algolia) to the category Icon
export const MAP_CATEGORY_TO_ICON: {
  [k in AlgoliaCategory]: React.ElementType<IconInterface>
} = {
  CINEMA: Category.Cinema,
  VISITE: Category.Exposition,
  MUSIQUE: Category.Musique,
  SPECTACLE: Category.Spectacles,
  LECON: Category.Atelier,
  LIVRE: Category.Book,
  FILM: Category.Streaming,
  PRESSE: Category.Presse,
  JEUX_VIDEO: Category.VideoGames,
  CONFERENCE: Category.Conference,
  INSTRUMENT: Category.Instrument,
}

export const mapCategoryToIcon = (
  category: AlgoliaCategory | null
): React.ElementType<IconInterface> => {
  if (category && category in MAP_CATEGORY_TO_ICON) return MAP_CATEGORY_TO_ICON[category]
  return Category.Artwork
}
