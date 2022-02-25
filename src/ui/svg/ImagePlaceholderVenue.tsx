import * as React from 'react'
import Svg, { Defs, LinearGradient, Stop, Rect, Path } from 'react-native-svg'
import { useTheme } from 'styled-components/native'
import { v1 as uuidv1 } from 'uuid'

interface Props {
  height?: number
  width?: number
  testID?: string
}

const NotMemoizedImagePlaceholderVenue: React.FC<Props> = ({
  width = 50,
  height = 50,
  testID = 'ImagePlaceholderVenue',
}) => {
  const {
    colors: { primary, secondary },
  } = useTheme()
  const LINEAR_GRADIENT_ID = uuidv1()
  const LINEAR_GRADIENT_ID_2 = uuidv1()

  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 220 220"
      fill="none"
      testID={testID}
      style={{ backgroundColor: primary }}>
      <Rect width={width} height={height} fill={`url(#${LINEAR_GRADIENT_ID})`} />
      <Path
        d="M28.7393 0C27.9823 19.7724 32.6419 38.3953 41.9438 51.9591C56.0481 72.5253 82.4299 81.1903 106.814 89.1991C122.764 94.4378 137.859 99.3958 148.103 107.22C167.592 122.106 174.192 145.594 180.671 168.658C186.043 187.778 191.333 206.606 203.816 220H220V0H28.7393Z"
        fill={`url(#${LINEAR_GRADIENT_ID_2})`}
      />
      <Defs>
        <LinearGradient
          id={LINEAR_GRADIENT_ID}
          x1="110.293"
          y1="1.20479e-07"
          x2="145.524"
          y2="229.885"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor={primary} />
          <Stop offset="1" stopColor={secondary} />
        </LinearGradient>
        <LinearGradient
          id={LINEAR_GRADIENT_ID_2}
          x1="39.3888"
          y1="-25.2626"
          x2="340.596"
          y2="210.852"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor={primary} />
          <Stop offset="0.971769" stopColor={secondary} />
        </LinearGradient>
      </Defs>
    </Svg>
  )
}

export const ImagePlaceholderVenue = React.memo(NotMemoizedImagePlaceholderVenue)
