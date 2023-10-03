import * as React from 'react'
import { Defs, LinearGradient, Path, Stop } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { svgIdentifier } from 'ui/svg/utils'

const StoreSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  color2,
  accessibilityLabel,
  testID,
}) => {
  const { id: gradientId, fill: gradientFill } = svgIdentifier()

  return (
    <AccessibleSvg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      <Defs>
        <LinearGradient id={gradientId} x1="28.841%" x2="71.159%" y1="0%" y2="100%">
          <Stop offset="0%" stopColor={color} />
          <Stop offset="100%" stopColor={color2 ?? color} />
        </LinearGradient>
      </Defs>

      <Path
        fill={gradientFill}
        d="M46.21 17.87a1.09 1.09 0 0 0-.11-.44.355.355 0 0 0-.04-.09l-6.2-10.05c.59-.52.97-1.26.97-2.11v-.24c0-1.55-1.26-2.81-2.81-2.81H9.97c-1.55 0-2.81 1.26-2.81 2.81v.24c0 .84.38 1.59.97 2.11L1.94 17.35s-.03.06-.04.09c-.01.03-.03.06-.04.09-.04.11-.07.23-.07.35 0 2.53 1.17 4.79 3 6.27v4.86c0 .55.45 1 1 1s1-.45 1-1v-3.66c.08.03.17.06.26.09.15.06.3.12.46.16.13.04.26.07.38.1.13.03.25.07.38.1.16.03.32.05.49.07.1.01.2.03.3.04a8.072 8.072 0 0 0 7.88-4.14c1.38 2.49 4.03 4.18 7.07 4.18s5.7-1.69 7.07-4.18c1.38 2.49 4.03 4.18 7.07 4.18.27 0 .54-.01.81-.04.1-.01.2-.03.3-.04.16-.02.33-.04.49-.07.13-.03.25-.06.38-.1.13-.03.26-.06.38-.1.15-.05.3-.11.45-.16.09-.03.18-.06.26-.09v17.44c0 .6-.49 1.08-1.08 1.08H21.79v-14.2c0-.55-.45-1-1-1h-9.4c-.55 0-1 .45-1 1v14.2H7.88c-.6 0-1.08-.49-1.08-1.08v-4.3c0-.55-.45-1-1-1s-1 .45-1 1v4.3c0 1.7 1.38 3.08 3.08 3.08h32.27c1.7 0 3.08-1.38 3.08-3.08V24.15c1.83-1.48 3-3.74 3-6.27l-.02-.01ZM12.38 43.86v-13.2h7.4v13.2h-7.4ZM9.16 4.95c0-.44.36-.81.81-.81h28.07c.44 0 .81.36.81.81v.24c0 .44-.36.81-.81.81H9.97c-.44 0-.81-.36-.81-.81v-.24Zm6.95 11.92H4.58l5.47-8.88h7.89l-1.82 8.88h-.01Zm3.87-8.88h8.04l1.82 8.88H18.15l1.82-8.88h.01ZM9.86 23.94c-.28 0-.56-.03-.83-.06-.06 0-.12-.02-.18-.03a7.16 7.16 0 0 1-.8-.19c-.02 0-.05-.02-.07-.03-.26-.09-.51-.19-.76-.31-.02-.01-.05-.02-.07-.03a6.103 6.103 0 0 1-3.27-4.43h11.97c-.48 2.87-2.98 5.07-5.98 5.07l-.01.01Zm14.14 0c-3.01 0-5.5-2.2-5.98-5.07h11.96C29.5 21.74 27 23.94 24 23.94Zm8.16-5.07h1.86c.55 0 1-.45 1-1s-.45-1-1-1h-2.14l-1.82-8.88h7.89l5.47 8.88h-4.75c-.55 0-1 .45-1 1s.45 1 1 1h5.45a6.09 6.09 0 0 1-2.52 3.98c-.24.17-.49.32-.75.45a.3.3 0 0 0-.08.04c-.25.12-.5.22-.75.31-.02 0-.05.02-.07.03-.26.08-.53.14-.8.19l-.18.03c-.28.04-.55.06-.83.06-3.01 0-5.5-2.2-5.98-5.07v-.02Z"
      />
      <Path
        fill={gradientFill}
        d="M36.48 38.26c.55 0 1-.45 1-1v-7.6c0-.55-.45-1-1-1h-9.4c-.55 0-1 .45-1 1v7.6c0 .55.45 1 1 1h9.4Zm-8.4-7.6h7.4v5.6h-7.4v-5.6Z"
      />
    </AccessibleSvg>
  )
}

export const Store = styled(StoreSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.standard,
}))``
