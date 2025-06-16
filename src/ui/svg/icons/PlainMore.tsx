import React from 'react'
import { Path, Circle } from 'react-native-svg'
import styled, { useTheme } from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'

const PlainMoreSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  testID,
  accessibilityLabel,
}) => {
  const { designSystem } = useTheme()
  return (
    <AccessibleSvg
      width={size}
      height={size}
      viewBox="0 0 22 22"
      fill="none"
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      <Circle cx="11" cy="11" r="11" fill={color} />
      <Path
        fill={designSystem.color.icon.inverted}
        stroke={designSystem.color.icon.inverted}
        strokeWidth="1"
        d="M10.8645 5.45711C11.1406 5.45738 11.3643 5.68145 11.364 5.95759L11.359 10.6082L15.9932 10.614C16.2693 10.6144 16.4929 10.8385 16.4926 11.1146C16.4923 11.3908 16.2682 11.6144 15.992 11.614L11.3614 11.6082L11.3781 16.2551C11.379 16.5312 11.1559 16.7558 10.8798 16.7567C10.6036 16.7576 10.379 16.5345 10.3781 16.2584L10.3614 11.6122L5.72454 11.6296C5.4484 11.6306 5.22378 11.4075 5.22285 11.1313C5.22191 10.8552 5.44501 10.6306 5.72115 10.6296L10.359 10.6122L10.364 5.95662C10.3643 5.68048 10.5884 5.45684 10.8645 5.45711Z"
      />
    </AccessibleSvg>
  )
}

export const PlainMore = styled(PlainMoreSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.designSystem.color.icon.default,
  size: size ?? theme.icons.sizes.standard,
}))``
