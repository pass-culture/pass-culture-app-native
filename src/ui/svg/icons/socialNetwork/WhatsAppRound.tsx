import * as React from 'react'
import { Path, Defs, Rect, LinearGradient, Stop } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { svgIdentifier } from 'ui/svg/utils'

const WhatsAppRoundSvg = ({ color: _color, size, accessibilityLabel, testID }: AccessibleIcon) => {
  const { id: gradientId, fill: gradientFill } = svgIdentifier()

  return (
    <AccessibleSvg
      width={size}
      height={size}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      viewBox="0 0 48 48">
      <Rect width={48} height={48} rx={24} fill={gradientFill} />
      <Path
        d="M10.117 23.874a13.8 13.8 0 0 0 1.86 6.937L10 38l7.39-1.93a13.982 13.982 0 0 0 6.663 1.69h.006c7.683 0 13.938-6.225 13.941-13.875a13.76 13.76 0 0 0-4.08-9.816A13.887 13.887 0 0 0 24.06 10c-7.685 0-13.939 6.224-13.942 13.874Zm4.4 6.574-.275-.436a11.466 11.466 0 0 1-1.772-6.137c.003-6.358 5.201-11.532 11.593-11.532a11.538 11.538 0 0 1 8.192 3.382 11.436 11.436 0 0 1 3.39 8.159c-.002 6.359-5.2 11.532-11.587 11.532h-.004a11.611 11.611 0 0 1-5.898-1.608l-.423-.25-4.386 1.145 1.17-4.255Z"
        fill={'#fff'}
      />
      <Path
        d="M20.574 18.073c-.26-.577-.536-.589-.784-.599-.203-.009-.435-.008-.667-.008-.233 0-.61.087-.929.434-.32.347-1.22 1.186-1.22 2.892s1.25 3.355 1.423 3.587c.174.23 2.41 3.844 5.95 5.234 2.943 1.155 3.542.926 4.18.868.64-.058 2.061-.839 2.352-1.649.29-.81.29-1.504.203-1.648-.087-.145-.32-.232-.668-.405-.348-.174-2.06-1.012-2.38-1.128-.32-.116-.552-.174-.784.174-.232.347-.9 1.127-1.103 1.359-.203.231-.406.26-.754.087-.349-.174-1.47-.54-2.802-1.721-1.035-.92-1.734-2.055-1.938-2.402-.203-.347-.021-.534.153-.707.157-.155.349-.405.523-.608.174-.202.232-.347.348-.578.116-.231.058-.434-.03-.607-.086-.174-.763-1.889-1.073-2.575Z"
        fill="#fff"
      />
      <Defs>
        <LinearGradient
          id={gradientId}
          x1={24}
          y1={-2.5}
          x2={24}
          y2={48}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#5FFB7B" />
          <Stop offset={0.78} stopColor="#28D146" />
        </LinearGradient>
      </Defs>
    </AccessibleSvg>
  )
}

export const WhatsAppRound = styled(WhatsAppRoundSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.greyDark,
  size: size ?? theme.icons.sizes.standard,
}))``
