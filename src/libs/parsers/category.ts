import { CategoryIdEnum } from 'api/gen'
import { Category } from 'ui/svg/icons/categories'
import { IconInterface } from 'ui/svg/icons/types'

export const MAP_CATEGORY_ID_TO_ICON: {
  [k in CategoryIdEnum]: React.FC<IconInterface>
} = {
  [CategoryIdEnum.CINEMA]: Category.Cinema,
  [CategoryIdEnum.MUSEE]: Category.Exposition,
  [CategoryIdEnum.MUSIQUELIVE]: Category.Musique,
  [CategoryIdEnum.MUSIQUEENREGISTREE]: Category.Musique,
  [CategoryIdEnum.SPECTACLE]: Category.Spectacles,
  [CategoryIdEnum.PRATIQUEART]: Category.Atelier,
  [CategoryIdEnum.LIVRE]: Category.Book,
  [CategoryIdEnum.FILM]: Category.Streaming,
  [CategoryIdEnum.MEDIA]: Category.Presse,
  [CategoryIdEnum.JEU]: Category.VideoGames,
  [CategoryIdEnum.CONFERENCE]: Category.Conference,
  [CategoryIdEnum.INSTRUMENT]: Category.Instrument,
  [CategoryIdEnum.BEAUXARTS]: Category.ArtsMaterial,
  [CategoryIdEnum.TECHNIQUE]: Category.Artwork,
}

export const mapCategoryToIcon = (id: CategoryIdEnum | null): React.FC<IconInterface> => {
  if (id && id in MAP_CATEGORY_ID_TO_ICON) return MAP_CATEGORY_ID_TO_ICON[id]
  return Category.Artwork
}
