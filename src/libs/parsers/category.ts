import { CategoryIdEnum } from 'api/gen'
import CategoryIcon from 'ui/svg/icons/categories'
import { IconInterface } from 'ui/svg/icons/types'

export const MAP_CATEGORY_ID_TO_ICON: {
  [k in CategoryIdEnum]: React.FC<IconInterface>
} = {
  [CategoryIdEnum.CARTE_JEUNES]: CategoryIcon.CarteJeunes,
  [CategoryIdEnum.CINEMA]: CategoryIcon.Cinema,
  [CategoryIdEnum.MUSEE]: CategoryIcon.Museum,
  [CategoryIdEnum.MUSIQUE_LIVE]: CategoryIcon.Music,
  [CategoryIdEnum.MUSIQUE_ENREGISTREE]: CategoryIcon.Music,
  [CategoryIdEnum.SPECTACLE]: CategoryIcon.Show,
  [CategoryIdEnum.PRATIQUE_ART]: CategoryIcon.Brush,
  [CategoryIdEnum.LIVRE]: CategoryIcon.Book,
  [CategoryIdEnum.FILM]: CategoryIcon.Streaming,
  [CategoryIdEnum.MEDIA]: CategoryIcon.Press,
  [CategoryIdEnum.JEU]: CategoryIcon.VideoGame,
  [CategoryIdEnum.CONFERENCE]: CategoryIcon.Conference,
  [CategoryIdEnum.INSTRUMENT]: CategoryIcon.Piano,
  [CategoryIdEnum.BEAUX_ARTS]: CategoryIcon.ArtsMaterial,
  [CategoryIdEnum.TECHNIQUE]: CategoryIcon.ArtsMaterial,
}

export const mapCategoryToIcon = (id: CategoryIdEnum | null): React.FC<IconInterface> => {
  if (id && id in MAP_CATEGORY_ID_TO_ICON) return MAP_CATEGORY_ID_TO_ICON[id]
  return CategoryIcon.ArtsMaterial
}
