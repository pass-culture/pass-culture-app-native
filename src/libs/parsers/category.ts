import { CategoryIdEnum } from 'api/gen'
import { categoriesIcons } from 'ui/svg/icons/bicolor/exports/categoriesIcons'
import { IconInterface } from 'ui/svg/icons/types'

export const MAP_CATEGORY_ID_TO_ICON: {
  [k in CategoryIdEnum]: React.FC<IconInterface>
} = {
  [CategoryIdEnum.CARTE_JEUNES]: categoriesIcons.Card,
  [CategoryIdEnum.CINEMA]: categoriesIcons.Cinema,
  [CategoryIdEnum.MUSEE]: categoriesIcons.Museum,
  [CategoryIdEnum.MUSIQUE_LIVE]: categoriesIcons.Music,
  [CategoryIdEnum.MUSIQUE_ENREGISTREE]: categoriesIcons.Music,
  [CategoryIdEnum.SPECTACLE]: categoriesIcons.Show,
  [CategoryIdEnum.PRATIQUE_ART]: categoriesIcons.Workshop,
  [CategoryIdEnum.LIVRE]: categoriesIcons.Book,
  [CategoryIdEnum.FILM]: categoriesIcons.Streaming,
  [CategoryIdEnum.MEDIA]: categoriesIcons.Press,
  [CategoryIdEnum.JEU]: categoriesIcons.VideoGame,
  [CategoryIdEnum.CONFERENCE]: categoriesIcons.Conference,
  [CategoryIdEnum.INSTRUMENT]: categoriesIcons.Instrument,
  [CategoryIdEnum.BEAUX_ARTS]: categoriesIcons.FineArts,
  [CategoryIdEnum.TECHNIQUE]: categoriesIcons.FineArts,
}

export const mapCategoryToIcon = (id: CategoryIdEnum | null): React.FC<IconInterface> => {
  if (id && id in MAP_CATEGORY_ID_TO_ICON) return MAP_CATEGORY_ID_TO_ICON[id]
  return categoriesIcons.FineArts
}
