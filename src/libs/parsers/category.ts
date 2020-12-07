import { AlgoliaCategory } from 'libs/algolia'
import { Category } from 'ui/svg/icons/categories'
import { ColorsEnum } from 'ui/theme'

// Map the facetFilter (in algolia) to the label displayed in the front
const MAP_CATEGORY_TO_LABEL: { [k in AlgoliaCategory]: string } = {
  CINEMA: 'Cinéma',
  VISITE: 'Visite, exposition',
  MUSIQUE: 'Musique',
  SPECTACLE: 'Spectacle',
  LECON: 'Cours, atelier',
  LIVRE: 'Livre',
  FILM: 'Film, série, podcast',
  PRESSE: 'Presse',
  JEUX_VIDEO: 'Jeu vidéo',
  CONFERENCE: 'Conférence, rencontre',
  INSTRUMENT: 'Instrument',
}

export const parseCategory = (category: AlgoliaCategory | null, label?: string): string => {
  if (category && category in MAP_CATEGORY_TO_LABEL) return MAP_CATEGORY_TO_LABEL[category]
  return label || ''
}

// Map the facetFilter (in algolia) to the category Icon
export const MAP_CATEGORY_TO_ICON: {
  [k in AlgoliaCategory]: React.ElementType<{ size: number; color: ColorsEnum }>
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
): React.ElementType<{ size: number; color: ColorsEnum }> => {
  if (category && category in MAP_CATEGORY_TO_ICON) return MAP_CATEGORY_TO_ICON[category]
  return Category.Artwork
}
