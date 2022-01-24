import { Check } from 'ui/svg/icons/Check'
import { Error } from 'ui/svg/icons/Error'
import { Info } from 'ui/svg/icons/Info'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

import { SnackBarSettings, SnackBarType } from './types'

export const mapSnackBarTypeToStyle = (
  type: SnackBarType
): Pick<SnackBarSettings, 'icon' | 'color' | 'backgroundColor' | 'progressBarColor'> => {
  switch (type) {
    case SnackBarType.SUCCESS:
      return {
        icon: Check,
        backgroundColor: ColorsEnum.GREEN_VALID,
        progressBarColor: ColorsEnum.GREEN_LIGHT,
        color: ColorsEnum.WHITE,
      }
    case SnackBarType.ERROR:
      return {
        icon: Error,
        backgroundColor: ColorsEnum.ERROR,
        progressBarColor: ColorsEnum.PRIMARY_DISABLED,
        color: ColorsEnum.WHITE,
      }
    case SnackBarType.INFO:
      return {
        icon: Info,
        backgroundColor: ColorsEnum.ACCENT,
        progressBarColor: ColorsEnum.WHITE,
        color: ColorsEnum.WHITE,
      }
    default:
      return {
        icon: undefined,
        backgroundColor: ColorsEnum.TRANSPARENT,
        progressBarColor: ColorsEnum.TRANSPARENT,
        color: ColorsEnum.WHITE,
      }
  }
}
