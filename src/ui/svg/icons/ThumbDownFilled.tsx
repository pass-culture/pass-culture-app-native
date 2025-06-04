import React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

const ThumbDownFilledSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  accessibilityLabel,
  testID,
}) => (
  <AccessibleSvg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    accessibilityLabel={accessibilityLabel}
    testID={testID}>
    <Path
      d="M38.6 28.5L40.4 28.5C42.3882 28.5 44 26.8882 44 24.9L44 7.93C44 5.94177 42.3882 4.33 40.4 4.33L38.6 4.33C36.6118 4.33 35 5.94177 35 7.93L35 24.9C35 26.8882 36.6118 28.5 38.6 28.5Z"
      fill={color}
    />
    <Path
      d="M5.40212 27.0513C6.55203 28.4214 8.22189 29.2114 10.0018 29.2114L17.9911 29.2114C17.0112 30.9115 15.8113 33.9417 15.7613 38.512C15.7313 41.2721 17.7811 43.7523 20.5209 43.9823C23.5807 44.2323 26.1605 41.8022 26.1605 38.772C26.1605 34.2617 27.9003 30.0415 31.0701 26.8513L31.3601 26.5613C31.77 26.1413 32 25.5812 32 24.9912L32 8.03023C32 7.35019 31.59 6.74016 30.9601 6.49014C29.2902 5.8101 27.5104 5.23007 27.2104 5.14006L27.2104 5.16006C24.9106 4.41002 22.5308 4 20.1009 4L12.3816 4C9.49179 4 7.01199 6.07012 6.49203 8.94028L4.10222 22.131C3.77225 23.8911 4.25221 25.6912 5.38212 27.0613L5.40212 27.0513Z"
      fill={color}
    />
  </AccessibleSvg>
)

export const ThumbDownFilled = styled(ThumbDownFilledSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.designSystem.color.icon.default,
  size: size ?? theme.icons.sizes.standard,
}))``
