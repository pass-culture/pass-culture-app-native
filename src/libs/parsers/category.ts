import { CategoryIdEnum } from 'api/gen'
import { Category } from 'ui/svg/icons/categories'
import { IconInterface } from 'ui/svg/icons/types'

// All offers without category are the 'Art' ones
const DEFAULT_CATEGORY = 'Art'

// Map the facetFilter (in algolia) to the label displayed in the front
const MAP_CATEGORY_TO_LABEL: { [k in CategoryIdEnum]: string } = {
  [CategoryIdEnum.CINEMA]: 'Cinéma',
  [CategoryIdEnum.VISITE]: 'Visite',
  [CategoryIdEnum.MUSIQUE]: 'Musique',
  [CategoryIdEnum.SPECTACLE]: 'Spectacle',
  [CategoryIdEnum.LECON]: 'Cours',
  [CategoryIdEnum.LIVRE]: 'Livre',
  [CategoryIdEnum.FILM]: 'Films',
  [CategoryIdEnum.MEDIA]: 'Presse',
  [CategoryIdEnum.JEU]: 'Jeux',
  [CategoryIdEnum.CONFERENCE]: 'Rencontre',
  [CategoryIdEnum.INSTRUMENT]: 'Musique',
  [CategoryIdEnum.MATERIEL_ART_CREA]: 'Art',
}

export const parseCategory = (category: CategoryIdEnum | null | undefined): string => {
  if (category && category in MAP_CATEGORY_TO_LABEL) return MAP_CATEGORY_TO_LABEL[category]
  return DEFAULT_CATEGORY || ''
}

// Map the facetFilter (in algolia) to the category Icon
export const MAP_CATEGORY_TO_ICON: {
  [k in CategoryIdEnum]: React.FC<IconInterface>
} = {
  [CategoryIdEnum.CINEMA]: Category.Cinema,
  [CategoryIdEnum.VISITE]: Category.Exposition,
  [CategoryIdEnum.MUSIQUE]: Category.Musique,
  [CategoryIdEnum.SPECTACLE]: Category.Spectacles,
  [CategoryIdEnum.LECON]: Category.Atelier,
  [CategoryIdEnum.LIVRE]: Category.Book,
  [CategoryIdEnum.FILM]: Category.Streaming,
  [CategoryIdEnum.MEDIA]: Category.Presse,
  [CategoryIdEnum.JEU]: Category.VideoGames,
  [CategoryIdEnum.CONFERENCE]: Category.Conference,
  [CategoryIdEnum.INSTRUMENT]: Category.Instrument,
  [CategoryIdEnum.MATERIEL_ART_CREA]: Category.ArtsMaterial,
}

export const mapCategoryToIcon = (category: CategoryIdEnum | null): React.FC<IconInterface> => {
  if (category && category in MAP_CATEGORY_TO_ICON) return MAP_CATEGORY_TO_ICON[category]
  return Category.Artwork
}
