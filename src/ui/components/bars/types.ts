import { Close } from 'ui/svg/icons/Close'
import { ColorsEnum } from 'ui/theme'

export const CreditCeilingMapV1 = {
  all: {
    label: 'en offres numériques (streaming...)',
    color: ColorsEnum.GREY_DARK,
    icon: Close,
  },
  physical: {
    label: 'en offres physiques (livres...)',
    color: ColorsEnum.SECONDARY,
    icon: Close,
  },
  digital: {
    label: 'en sorties (concerts...)',
    color: ColorsEnum.ACCENT,
    icon: Close,
  },
}

export const CreditCeilingMapV2 = {
  all: {
    label: 'en offres numériques (streaming...)',
    color: ColorsEnum.SECONDARY,
    icon: Close,
  },
  digital: {
    label: 'en sorties & biens physiques (concerts, livres...)',
    color: ColorsEnum.PRIMARY,
    icon: Close,
  },
}
