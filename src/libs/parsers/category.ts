import { CategoryIdEnum } from 'api/gen'
import CategoryIcon from 'ui/svg/icons/categories/bicolor'
import { IconInterface } from 'ui/svg/icons/types'

export const MAP_CATEGORY_ID_TO_ICON: {
  [k in CategoryIdEnum]: React.FC<IconInterface>
} = {
  [CategoryIdEnum.CINEMA]: CategoryIcon.Cinema,
  [CategoryIdEnum.MUSEE]: CategoryIcon.Exposition,
  [CategoryIdEnum.MUSIQUELIVE]: CategoryIcon.Musique,
  [CategoryIdEnum.MUSIQUEENREGISTREE]: CategoryIcon.Musique,
  [CategoryIdEnum.SPECTACLE]: CategoryIcon.Spectacles,
  [CategoryIdEnum.PRATIQUEART]: CategoryIcon.Atelier,
  [CategoryIdEnum.LIVRE]: CategoryIcon.Livres,
  [CategoryIdEnum.FILM]: CategoryIcon.Streaming,
  [CategoryIdEnum.MEDIA]: CategoryIcon.Presse,
  [CategoryIdEnum.JEU]: CategoryIcon.JeuxVideo,
  [CategoryIdEnum.CONFERENCE]: CategoryIcon.Conference,
  [CategoryIdEnum.INSTRUMENT]: CategoryIcon.Instrument,
  [CategoryIdEnum.BEAUXARTS]: CategoryIcon.ArtsMaterial,
  [CategoryIdEnum.TECHNIQUE]: CategoryIcon.ArtsMaterial,
}

export const mapCategoryToIcon = (id: CategoryIdEnum | null): React.FC<IconInterface> => {
  if (id && id in MAP_CATEGORY_ID_TO_ICON) return MAP_CATEGORY_ID_TO_ICON[id]
  return CategoryIcon.ArtsMaterial
}
