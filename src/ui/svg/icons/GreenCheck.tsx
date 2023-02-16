import * as React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { theme } from 'theme'
import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

const GreenCheckSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  accessibilityLabel,
  testID,
}) => (
  <AccessibleSvg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    accessibilityLabel={accessibilityLabel}
    testID={testID}>
    <Path
      fill={theme.colors.white}
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.23391 10.6448C7.10676 10.6741 6.97481 10.6742 6.84766 10.6449C6.68415 10.6073 6.52857 10.5212 6.4013 10.3868L4.49812 8.37623C4.28011 8.14593 4.27841 7.77072 4.49432 7.53819C4.71023 7.30565 5.06198 7.30384 5.27999 7.53414L7.04064 9.39411L10.7202 5.50514C10.9382 5.27478 11.29 5.27651 11.5059 5.50899C11.7219 5.74148 11.7203 6.11668 11.5023 6.34704L7.68004 10.3868C7.55283 10.5212 7.39733 10.6072 7.23391 10.6448ZM15.6668 8.00016C15.6668 12.2343 12.2343 15.6668 8.00016 15.6668C3.76598 15.6668 0.333496 12.2343 0.333496 8.00016C0.333496 3.76598 3.76598 0.333496 8.00016 0.333496C12.2343 0.333496 15.6668 3.76598 15.6668 8.00016ZM14.6668 8.00016C14.6668 11.6821 11.6821 14.6668 8.00016 14.6668C4.31826 14.6668 1.3335 11.6821 1.3335 8.00016C1.3335 4.31826 4.31826 1.3335 8.00016 1.3335C11.6821 1.3335 14.6668 4.31826 14.6668 8.00016Z"
    />
    <Path
      fill={color}
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.00016 14.6668C11.6821 14.6668 14.6668 11.6821 14.6668 8.00016C14.6668 4.31826 11.6821 1.3335 8.00016 1.3335C4.31826 1.3335 1.3335 4.31826 1.3335 8.00016C1.3335 11.6821 4.31826 14.6668 8.00016 14.6668ZM11.5023 6.34704C11.7203 6.11668 11.7219 5.74148 11.5059 5.50899C11.29 5.27651 10.9382 5.27478 10.7202 5.50514L7.04064 9.39411L5.27999 7.53414C5.06198 7.30384 4.71023 7.30565 4.49432 7.53819C4.27841 7.77072 4.28011 8.14593 4.49812 8.37623L6.4013 10.3868C6.75476 10.7602 7.32658 10.7602 7.68004 10.3868L11.5023 6.34704Z"
    />
  </AccessibleSvg>
)

export const GreenCheck = styled(GreenCheckSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.greenValid,
  size: size ?? theme.icons.sizes.standard,
}))``
