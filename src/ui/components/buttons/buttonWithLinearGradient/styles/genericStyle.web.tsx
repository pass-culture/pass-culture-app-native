import { buttonWidthStyle } from 'ui/components/buttons/buttonWithLinearGradient/styles/buttonWidthStyle'
import { GenericStyleProps } from 'ui/components/buttons/buttonWithLinearGradient/types'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'
import { getHoverStyle } from 'ui/theme/getHoverStyle/getHoverStyle'

export const genericStyle = ({ theme, fitContentWidth }: GenericStyleProps) => {
  return {
    overflow: 'hidden',
    cursor: 'pointer',
    height: theme.buttons.buttonHeights.tall,
    borderRadius: theme.borderRadius.button,
    backgroundColor: theme.colors.primary,
    backgroundImage: `linear-gradient(0.25turn, ${theme.colors.primary}, ${theme.colors.secondary})`,
    padding: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: 0,
    ['&:disabled']: {
      cursor: 'initial',
      background: 'none',
      color: theme.buttons.disabled.linearGradient.textColor,
      backgroundColor: theme.buttons.disabled.linearGradient.backgroundColor,
    },
    ...customFocusOutline(theme, theme.buttons.outlineColor),
    ...getHoverStyle(theme.buttons.linearGradient.textColor),
    ...buttonWidthStyle({ fitContentWidth }),
  }
}
