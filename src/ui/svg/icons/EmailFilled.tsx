import { t } from '@lingui/macro'
import * as React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'
const EmailFilledSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  testID,
  accessibilityLabel,
}) => (
  <AccessibleSvg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    testID={testID}
    accessibilityLabel={accessibilityLabel ?? t`Ouvrir la boîte e-mail`}>
    <Path
      fill={color}
      d="M6.14976 8C4.61755 8 3.26268 9.1575 3.03373 10.7664C3.11895 10.8098 3.20111 10.8614 3.27898 10.9215L3.28143 10.9234L21.6616 25.2793C23.0167 26.3296 24.9725 26.3299 26.3274 25.2793L26.3307 25.2767L44.9825 10.9047C44.8137 9.22422 43.4255 8 41.8498 8H36.0492H6.14976ZM32.7784 24.1435L44.9998 14.7264V36.4726L36.4985 27.8926C36.4699 27.8637 36.4403 27.8361 36.41 27.8099L32.7784 24.1435ZM35.404 31.1228L43.633 39.428C43.1189 39.7913 42.5003 40 41.8498 40H6.14976C5.49908 40 4.88038 39.7913 4.36631 39.4278L17.6638 26.0122L19.7215 27.6194L19.7231 27.6206L19.7241 27.6214C22.2116 29.5494 25.7781 29.5489 28.2655 27.6209L28.2666 27.62L30.3428 26.0202L35.3128 31.0378C35.3422 31.0676 35.3727 31.0959 35.404 31.1228ZM2.99976 14.5588V36.4725L15.2424 24.121L2.99976 14.5588Z"
    />
  </AccessibleSvg>
)

export const EmailFilled = styled(EmailFilledSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.smaller,
}))``
