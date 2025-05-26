import { Color } from 'features/home/types'
import { BackgroundColorKey, BorderColorKey, TextColorKey } from 'theme/types'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

export const colorMapping: Record<
  keyof typeof Color,
  {
    border: ColorsEnum | BorderColorKey
    text: ColorsEnum | TextColorKey
    fill: ColorsEnum | BackgroundColorKey
  }
> = {
  SkyBlue: {
    border: ColorsEnum.SKY_BLUE_DARK,
    text: ColorsEnum.DEEP_PINK_DARK,
    fill: ColorsEnum.SKY_BLUE_LIGHT,
  },
  Gold: {
    border: ColorsEnum.GOLD_DARK,
    text: ColorsEnum.LILAC_DARK,
    fill: ColorsEnum.GOLD_LIGHT_200,
  },
  Coral: {
    border: ColorsEnum.CORAL_DARK,
    text: ColorsEnum.SKY_BLUE_DARK,
    fill: ColorsEnum.CORAL_LIGHT,
  },
  DeepPink: {
    border: ColorsEnum.DEEP_PINK_DARK,
    text: ColorsEnum.AQUAMARINE_DARK,
    fill: ColorsEnum.DEEP_PINK_LIGHT,
  },
  Lilac: {
    border: ColorsEnum.LILAC_DARK,
    text: ColorsEnum.DEEP_PINK_DARK,
    fill: ColorsEnum.LILAC_LIGHT,
  },
  Aquamarine: {
    border: ColorsEnum.AQUAMARINE_DARK,
    text: ColorsEnum.LILAC_DARK,
    fill: ColorsEnum.AQUAMARINE_LIGHT,
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
}
