import React from 'react'
import { Defs, LinearGradient, Path, Stop } from 'react-native-svg'
import styled, { useTheme } from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { svgIdentifier } from 'ui/svg/utils'

const VideoSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  color2,
  accessibilityLabel,
  testID,
}) => {
  const { id: gradientId, fill: gradientFill } = svgIdentifier()
  const {
    colors: { primary, secondary },
  } = useTheme()
  return (
    <AccessibleSvg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      <Defs>
        <LinearGradient id={gradientId} x1="28.841%" x2="71.159%" y1="0%" y2="100%">
          <Stop offset="0%" stopColor={color ?? primary} />
          <Stop offset="100%" stopColor={color2 ?? color ?? secondary} />
        </LinearGradient>
      </Defs>
      <Path
        fill={gradientFill}
        clipRule="evenodd"
        fillRule="evenodd"
        d="M4.00001 5.33333C3.26153 5.33333 2.66668 5.92819 2.66668 6.66667V7.33333H7.33334V5.33333H6.66668H4.00001ZM8.66668 5.33333V7.33333H15.3333V5.33333H8.66668ZM2.66668 8.66667H8.00001H16H24H29.3333V23.3333L24 23.3333L22.6667 23.3333L22.6624 23.3333H16.004L16 23.3333L15.9961 23.3333H8.00396L8.00001 23.3333L7.99606 23.3333H2.66668V15.18L2.66668 15.1796V14.0333C2.66668 13.6651 2.3682 13.3667 2.00001 13.3667C1.63182 13.3667 1.33334 13.6651 1.33334 14.0333V15.18V24.6667V25.3333C1.33334 26.8082 2.52515 28 4.00001 28H8.00001H16H18C18.3682 28 18.6667 27.7015 18.6667 27.3333C18.6667 26.9651 18.3682 26.6667 18 26.6667H16.6667V24.6667H22.6667L22.6709 24.6667H23.3333V26.6667H22C21.6318 26.6667 21.3333 26.9651 21.3333 27.3333C21.3333 27.7015 21.6318 28 22 28H24H28C29.4749 28 30.6667 26.8082 30.6667 25.3333L30.6667 24.6667V7.33333L30.6667 6.66667C30.6667 5.19181 29.4749 4 28 4H24H16H8.00001H6.66668H4.00001C2.52515 4 1.33334 5.19181 1.33334 6.66667V7.33333V10.1533C1.33334 10.5215 1.63182 10.82 2.00001 10.82C2.3682 10.82 2.66668 10.5215 2.66668 10.1533L2.66668 8.66667ZM23.3333 5.33333H16.6667V7.33333H23.3333V5.33333ZM24.6667 7.33333V5.33333H28C28.7385 5.33333 29.3333 5.92819 29.3333 6.66667V7.33333H24.6667ZM28 26.6667H24.6667V24.6667H29.3333V25.3333C29.3333 26.0718 28.7385 26.6667 28 26.6667ZM7.33334 24.6667H2.66668V25.3333C2.66668 26.0718 3.26153 26.6667 4.00001 26.6667H7.33334V24.6667ZM8.66668 26.6667V24.6667H15.3333V26.6667H8.66668ZM19.3515 14.9637L15.0274 12.7917C14.2514 12.3977 13.3467 12.97 13.3467 13.8267V18.18C13.3467 19.0367 14.2513 19.6089 15.0274 19.215L19.3526 17.0424L19.3526 17.0425L19.3602 17.0385C20.1909 16.6078 20.2117 15.3944 19.3521 14.9641L19.3515 14.9637ZM18.4507 16.0033L14.68 14.1093V17.8974L18.4507 16.0033Z"
      />
    </AccessibleSvg>
  )
}

export const Video = styled(VideoSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.standard,
}))``
