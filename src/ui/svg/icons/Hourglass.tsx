import React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'

const HourglassSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  accessibilityLabel,
  testID,
}) => {
  const height = typeof size === 'string' ? size : ((size as number) * 156) / 200
  return (
    <AccessibleSvg
      width={size}
      height={height}
      viewBox="0 0 48 48"
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      <Path
        fill={color}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 4C8.44772 4 8 4.44772 8 5C8 5.55228 8.44772 6 9 6H11.0228C11.3605 13.3987 15.4291 20.1539 21.8665 23.914L22.0141 24L21.8656 24.0865C15.4283 27.8466 11.3604 34.6013 11.0228 42H9C8.44772 42 8 42.4477 8 43C8 43.5523 8.44772 44 9 44H12H36H39C39.5523 44 40 43.5523 40 43C40 42.4477 39.5523 42 39 42H36.9772C36.6395 34.6013 32.5709 27.8462 26.1335 24.086L25.9859 24L26.1344 23.9135C32.5717 20.1534 36.6396 13.3987 36.9772 6H39C39.5523 6 40 5.55228 40 5C40 4.44772 39.5523 4 39 4H36H32.5C31.9477 4 31.5 4.44772 31.5 5C31.5 5.55228 31.9477 6 32.5 6H34.9749C34.6389 12.6858 30.9498 18.7843 25.1256 22.1865L24 22.8426L22.8739 22.1863C17.0497 18.784 13.361 12.6858 13.0251 6H27C27.5523 6 28 5.55228 28 5C28 4.44772 27.5523 4 27 4H9ZM25.1261 25.8137C30.9503 29.216 34.639 35.3142 34.9749 42H13.0251C13.361 35.3142 17.0502 29.2157 22.8744 25.8135L24 25.1574L25.1261 25.8137Z"
      />
    </AccessibleSvg>
  )
}

export const Hourglass = styled(HourglassSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.designSystem.color.icon.default,
  size: size ?? theme.icons.sizes.standard,
}))``
