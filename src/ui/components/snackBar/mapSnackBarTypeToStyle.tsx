import { Check } from 'ui/svg/icons/Check'
import { Warning } from 'ui/svg/icons/Warning'
import { ColorsEnum } from 'ui/theme'

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
        icon: Warning,
        backgroundColor: ColorsEnum.ERROR,
        progressBarColor: ColorsEnum.PRIMARY_DISABLED,
        color: ColorsEnum.WHITE,
      }
    case SnackBarType.INFO:
      return {
        icon: Warning,
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
