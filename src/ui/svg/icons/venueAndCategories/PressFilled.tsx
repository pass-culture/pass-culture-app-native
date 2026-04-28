import React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'

const PressFilledSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  accessibilityLabel,
  testID,
}) => {
  return (
    <AccessibleSvg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      testID={testID}
      accessibilityLabel={accessibilityLabel}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M33.99 24.07V42.46C33.99 43.81 34.68 45.14 35.79 45.71C35.94 45.78 35.88 46 35.72 46H15C10.03 46 6 41.97 6 37V30.12V6C6 3.79 7.79 2 10 2H29.99C32.2 2 33.99 3.79 33.99 6V8.86V15V24.07ZM24.5 11H12.5C11.95 11 11.5 11.45 11.5 12C11.5 12.55 11.95 13 12.5 13H24.5C25.05 13 25.5 12.55 25.5 12C25.5 11.45 25.05 11 24.5 11ZM12.5 25H23.5C24.05 25 24.5 24.55 24.5 24C24.5 23.45 24.05 23 23.5 23H12.5C11.95 23 11.5 23.45 11.5 24C11.5 24.55 11.95 25 12.5 25ZM12.5 19H25.5C26.05 19 26.5 18.55 26.5 18C26.5 17.45 26.05 17 25.5 17H12.5C11.95 17 11.5 17.45 11.5 18C11.5 18.55 11.95 19 12.5 19ZM40.3203 46C38.1103 46 36.3203 44.42 36.3203 42.46L36.3303 20.02H40.3203H41.9903C42.7203 20.02 43.3203 20.55 43.3203 21.2V42.46C43.3203 44.41 42.5303 46 40.3203 46Z"
        fill={color}
      />
    </AccessibleSvg>
  )
}

export const PressFilled = styled(PressFilledSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.designSystem.color.icon.default,
  size: size ?? theme.icons.sizes.standard,
}))``
