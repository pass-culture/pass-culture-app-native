import * as React from 'react'
import { Defs, LinearGradient, Path, Stop } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { svgIdentifier } from 'ui/svg/utils'

import { AccessibleIcon } from './types'

const NotMemoizedBicolorLocationBuilding: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  color2,
  accessibilityLabel,
  testID = 'BicolorLocationBuilding',
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
          <Stop offset="100%" stopColor={color2} />
        </LinearGradient>
      </Defs>
      <Path
        fill={gradientFill}
        clipRule="evenodd"
        fillRule="evenodd"
        d="M24 6.5C22.8923 6.5 22 7.39228 22 8.5V12.16C22 12.7123 21.5523 13.16 21 13.16C20.4477 13.16 20 12.7123 20 12.16V8.5C20 6.28772 21.7877 4.5 24 4.5H40C42.2123 4.5 44 6.28772 44 8.5V12.5V19.45V19.45V40.5C44 42.7122 42.2123 44.5 40 44.5H32C31.4477 44.5 31 44.0522 31 43.5C31 42.9477 31.4477 42.5 32 42.5H40C41.1077 42.5 42 41.6077 42 40.5V19.45V19.45V12.5V8.5C42 7.39228 41.1077 6.5 40 6.5H24ZM6.66931 24.5619C6.24233 24.945 6 25.4826 6 26.0499V40.4999C6 41.6077 6.89228 42.4999 8 42.4999H12V32.4999C12 31.3977 12.8977 30.4999 14 30.4999H19C20.1023 30.4999 21 31.3977 21 32.4999V33.2999C21 33.3483 20.9966 33.3959 20.9899 33.4424V42.5H24.9899C26.0976 42.5 26.9899 41.6077 26.9899 40.5V26.05C26.9899 25.4886 26.7443 24.9395 26.3154 24.5573L17.1561 16.4279L17.1537 16.4258C16.7857 16.097 16.2158 16.0911 15.8312 16.4301C15.4169 16.7953 14.785 16.7556 14.4198 16.3413C14.0546 15.927 14.0944 15.2951 14.5086 14.9299C15.6436 13.9293 17.3528 13.923 18.4848 14.933L18.4861 14.9342L27.645 23.0632C28.4958 23.8209 28.9899 24.9117 28.9899 26.05V40.5C28.9899 42.7123 27.2022 44.5 24.9899 44.5H19.9899C19.4376 44.5 18.9899 44.0523 18.9899 43.5V33.3C18.9899 33.2516 18.9934 33.2041 19 33.1576V32.4999H14V43.4999C14 44.0522 13.5523 44.4999 13 44.4999H8C5.78772 44.4999 4 42.7122 4 40.4999V26.0499C4 24.8998 4.49548 23.8197 5.34491 23.0632L5.35313 23.0559L9.80607 19.1022C10.2191 18.7355 10.8511 18.7731 11.2178 19.186C11.5845 19.599 11.547 20.2311 11.134 20.5978L6.67397 24.5578L6.66931 24.5619ZM33 10.5C33 9.94772 33.4477 9.5 34 9.5H38C38.5523 9.5 39 9.94772 39 10.5V16.5C39 17.0523 38.5523 17.5 38 17.5H34C33.4477 17.5 33 17.0523 33 16.5V10.5ZM35 11.5V15.5H37V11.5H35ZM26 9.5C25.4477 9.5 25 9.94772 25 10.5V16.5C25 17.0523 25.4477 17.5 26 17.5H30C30.5523 17.5 31 17.0523 31 16.5V10.5C31 9.94772 30.5523 9.5 30 9.5H26ZM27 15.5V11.5H29V15.5H27ZM33 20.74C33 20.1877 33.4477 19.74 34 19.74H38C38.5523 19.74 39 20.1877 39 20.74V26.5C39 27.0523 38.5523 27.5 38 27.5H34C33.4477 27.5 33 27.0523 33 26.5V20.74ZM35 21.74V25.5H37V21.74H35ZM34 29.74C33.4477 29.74 33 30.1877 33 30.74V36.5C33 37.0523 33.4477 37.5 34 37.5H38C38.5523 37.5 39 37.0523 39 36.5V30.74C39 30.1877 38.5523 29.74 38 29.74H34ZM35 35.5V31.74H37V35.5H35Z"
      />
    </AccessibleSvg>
  )
}

export const BicolorLocationBuilding = React.memo(
  styled(NotMemoizedBicolorLocationBuilding).attrs(({ color, color2, size, theme }) => ({
    color: color ?? theme.colors.primary,
    color2: color2 ?? theme.colors.secondary,
    size: size ?? theme.icons.sizes.standard,
  }))``
)
