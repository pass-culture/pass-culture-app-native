import React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

const WorldPositionSvg: React.FunctionComponent<AccessibleIcon> = ({
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
      accessibilityLabel={accessibilityLabel ?? `position dans le monde`}
      testID={testID}>
      <Path
        fill={color}
        d="M33.52 15.84c-.42.76-.92 1.5-1.51 2.21-1.27 1.52-2.52 3.06-3.78 4.6l-.91 1.12-.91 1.12c-.57.7-1.42 1.1-2.32 1.1-.9 0-1.75-.4-2.32-1.1l-1.75-2.14-.44.42c-.15.15-.24.34-.24.55v2.29c0 .1-.03.21-.1.3-.58.77-3.58 4.85-4.09 7.72-.01.02-.02.03-.03.05 3.33-.66 8.94 1.35 6.92 4.28-.68 1-.98 2.21-1.1 3.3-1.18-.28-2.3-.72-3.34-1.29-.5-1.77-2.09-2.64-2.75-2.93-.18-.07-.29-.26-.29-.46v-2.39c0-.05 0-.1.02-.16a.566.566 0 0 1-.25-.08 13.79 13.79 0 0 1-3.06-2.83c-.11-.66-.19-1.34-.19-2.04 0-4.38 2.34-8.23 5.86-10.47-.82-1-1.64-2.07-2.32-3.28C10.03 18.69 7 23.74 7 29.48c0 9.1 7.63 16.5 17 16.5s17-7.4 17-16.5c0-5.68-2.97-10.7-7.48-13.67Zm2.82 17.23a.78.78 0 0 0-.58-.07l-1.49.36c-.28.06-.42.36-.29.61l1.05 2.02a12.8 12.8 0 0 1-5.51 4.83c.24-1.73.21-3.64-2.2-4.23-2.92-.71-3.34-2.87-3.32-4.17.01-.59.4-1.1.97-1.29l2.04-.66c.2-.06.43-.1.65-.1h3.93c0-2.07-3.77-1.16-4.46-1.47-1.14-.52 1.58-1.58 2.65-1.58s-1.16-1.39-.1-3.46c1.07-2.07 4.43-1.91 4.43-1.91h.17c1.64 2.1 2.62 4.71 2.62 7.54 0 1.25-.19 2.45-.55 3.59 0 0-.02-.01-.03-.02Z"
      />
      <Path
        fill={color}
        d="M19.64 17.6c-1.8-2.19-3.51-4.27-3.51-7.33 0-4.56 3.56-8.27 7.93-8.27s7.93 3.71 7.93 8.27c0 2.05-.77 4.02-2.3 5.86-1.27 1.53-2.54 3.07-3.8 4.62-.61.74-1.22 1.49-1.83 2.23l-4.42-5.39Zm4.42-9.47c-1.14 0-2.06.96-2.06 2.15s.93 2.15 2.06 2.15 2.06-.96 2.06-2.15-.93-2.15-2.06-2.15Z"
      />
    </AccessibleSvg>
  )
}

export const WorldPosition = styled(WorldPositionSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.designSystem.color.icon.default,
  size: size ?? theme.icons.sizes.standard,
}))``
