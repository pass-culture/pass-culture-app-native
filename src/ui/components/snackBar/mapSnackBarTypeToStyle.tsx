import styled, { DefaultTheme } from 'styled-components/native'

import { Check } from 'ui/svg/icons/Check'
import { Error } from 'ui/svg/icons/Error'
import { Info } from 'ui/svg/icons/Info'

import { SnackBarSettings, SnackBarType } from './types'

export const mapSnackBarTypeToStyle = (
  theme: DefaultTheme,
  type: SnackBarType
): Pick<SnackBarSettings, 'icon' | 'color' | 'backgroundColor' | 'progressBarColor'> => {
  switch (type) {
    case SnackBarType.SUCCESS:
      return {
        icon: AccessibleCheck,
        backgroundColor: theme.designSystem.color.background.success,
        progressBarColor: theme.designSystem.color.background.success,
        color: 'default',
      }
    case SnackBarType.ERROR:
      return {
        icon: AccessibleError,
        backgroundColor: theme.designSystem.color.background.error,
        progressBarColor: theme.designSystem.color.background.error,
        color: 'default',
      }
    case SnackBarType.INFO:
      return {
        icon: AccessibleInfo,
        backgroundColor: theme.designSystem.color.background.info,
        progressBarColor: theme.designSystem.color.background.info,
        color: 'default',
      }
    default:
      return {
        icon: undefined,
        backgroundColor: theme.designSystem.color.background.default,
        progressBarColor: theme.designSystem.color.background.default,
        color: 'default',
      }
  }
}

const AccessibleCheck = styled(Check).attrs({ accessibilityLabel: 'Succès' })``
const AccessibleError = styled(Error).attrs({ accessibilityLabel: 'Erreur' })``
const AccessibleInfo = styled(Info).attrs({ accessibilityLabel: 'Information' })``
