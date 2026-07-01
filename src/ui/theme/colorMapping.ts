import { Color } from 'features/home/types'
import { BackgroundColorKey, BorderColorKey, IllustrationColorKey, TextColorKey } from 'theme/types'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

export const colorMapping: Record<
  keyof typeof Color,
  {
    border: ColorsEnum | BorderColorKey
    text: ColorsEnum | TextColorKey
    fill: ColorsEnum | BackgroundColorKey | IllustrationColorKey
  }
> = {
  Aquamarine: {
    border: ColorsEnum.AQUAMARINE_DARK,
    text: ColorsEnum.LILAC_DARK,
    fill: ColorsEnum.AQUAMARINE_LIGHT,
  },
  Coral: {
    border: ColorsEnum.CORAL_DARK,
    text: ColorsEnum.SKY_BLUE_DARK,
    fill: ColorsEnum.CORAL_LIGHT,
  },
  Decorative01: {
    border: 'decorative01',
    text: 'locked',
    fill: 'decorative01',
  },
  Decorative02: {
    border: 'decorative02',
    text: 'locked',
    fill: 'decorative02',
  },
  Decorative03: {
    border: 'decorative03',
    text: 'locked',
    fill: 'decorative03',
  },
  Decorative04: {
    border: 'decorative04',
    text: 'locked',
    fill: 'decorative04',
  },
  Decorative05: {
    border: 'decorative05',
    text: 'locked',
    fill: 'decorative05',
  },
  DeepPink: {
    border: ColorsEnum.DEEP_PINK_DARK,
    text: ColorsEnum.AQUAMARINE_DARK,
    fill: ColorsEnum.DEEP_PINK_LIGHT,
  },
  Gold: {
    border: ColorsEnum.GOLD_DARK,
    text: ColorsEnum.LILAC_DARK,
    fill: ColorsEnum.GOLD_LIGHT_200,
  },
  Information01: {
    border: 'decorative04',
    text: 'locked',
    fill: 'information01',
  },
  Information03: {
    border: 'brandPrimary',
    text: 'locked',
    fill: 'information03',
  },
  Information04: {
    border: 'decorative02',
    text: 'locked',
    fill: 'information04',
  },
  Lilac: {
    border: ColorsEnum.LILAC_DARK,
    text: ColorsEnum.DEEP_PINK_DARK,
    fill: ColorsEnum.LILAC_LIGHT,
  },
  Negative01: {
    border: 'decorative05',
    text: 'locked',
    fill: 'negative01',
  },
  Pending01: {
    border: 'decorative01',
    text: 'locked',
    fill: 'pending01',
  },
  Positive01: {
    border: 'decorative03',
    text: 'locked',
    fill: 'positive01',
  },
  SkyBlue: {
    border: ColorsEnum.SKY_BLUE_DARK,
    text: ColorsEnum.DEEP_PINK_DARK,
    fill: ColorsEnum.SKY_BLUE_LIGHT,
  },
}
