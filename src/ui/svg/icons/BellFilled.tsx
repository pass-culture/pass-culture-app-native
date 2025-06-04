import React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

const BellFilledSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  accessibilityLabel,
  testID,
}) => (
  <AccessibleSvg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    accessibilityLabel={accessibilityLabel}
    testID={testID}>
    <Path
      fill={color}
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.8579 3.11564C13.8579 3.14576 13.8572 3.17573 13.8559 3.20554C16.6737 3.69819 18.8154 6.1568 18.8154 9.11564V16.1433H19.8705C20.9085 16.1433 21.75 16.9847 21.75 18.0227C21.75 19.0607 20.9085 19.9022 19.8705 19.9022H14.2803C14.331 20.1006 14.3579 20.3085 14.3579 20.5227C14.3579 21.9034 13.2386 23.0227 11.8579 23.0227C10.4772 23.0227 9.35791 21.9034 9.35791 20.5227C9.35791 20.3085 9.38485 20.1006 9.43552 19.9022H3.62948C2.59147 19.9022 1.75 19.0607 1.75 18.0227C1.75 16.9847 2.59147 16.1433 3.62948 16.1433H4.91235V9.11564C4.91235 6.16096 7.04808 3.7051 9.85999 3.20762C9.85861 3.17713 9.85791 3.14647 9.85791 3.11564C9.85791 2.01107 10.7533 1.11564 11.8579 1.11564C12.9625 1.11564 13.8579 2.01107 13.8579 3.11564ZM10.1579 6.49895C10.4465 6.31364 10.5303 5.92945 10.345 5.64082C10.1597 5.3522 9.77548 5.26845 9.48686 5.45376C8.25918 6.24198 7.35677 7.49881 7.0415 8.97005C6.96964 9.30543 7.18325 9.63556 7.51863 9.70743C7.85401 9.7793 8.18414 9.56568 8.25601 9.2303C8.49968 8.09319 9.19954 7.11428 10.1579 6.49895Z"
    />
  </AccessibleSvg>
)

export const BellFilled = styled(BellFilledSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.designSystem.color.icon.default,
  size: size ?? theme.icons.sizes.standard,
}))``
