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
        backgroundColor: theme.colors.greenValid,
        progressBarColor: theme.colors.greenLight,
        color: theme.colors.white,
      }
    case SnackBarType.ERROR:
      return {
        icon: AccessibleError,
        backgroundColor: theme.colors.error,
        progressBarColor: theme.colors.primaryDisabled,
        color: theme.colors.white,
      }
    case SnackBarType.INFO:
      return {
        icon: AccessibleInfo,
        backgroundColor: theme.colors.accent,
        progressBarColor: theme.colors.white,
        color: theme.colors.white,
      }
    default:
      return {
        icon: undefined,
        backgroundColor: theme.colors.transparent,
        progressBarColor: theme.colors.transparent,
        color: theme.colors.white,
      }
  }
}

const AccessibleCheck = styled(Check).attrs({ accessibilityLabel: 'Succès' })``
const AccessibleError = styled(Error).attrs({ accessibilityLabel: 'Erreur' })``
const AccessibleInfo = styled(Info).attrs({ accessibilityLabel: 'Information' })``
