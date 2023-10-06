import * as React from 'react'
import { Defs, LinearGradient, Path, Stop } from 'react-native-svg'
import styled, { useTheme } from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { svgIdentifier } from 'ui/svg/utils'

const StreamingSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  color2,
  accessibilityLabel,
  testID,
}) => {
  const {
    colors: { primary, secondary },
  } = useTheme()
  const { id: gradientId, fill: gradientFill } = svgIdentifier()

  return (
    <AccessibleSvg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      testID={testID}
      accessibilityLabel={accessibilityLabel}>
      <Defs>
        <LinearGradient id={gradientId} x1="0%" x2="100%" y1="13.494%" y2="86.506%">
          <Stop offset="0%" stopColor={color ?? primary} />
          <Stop offset="100%" stopColor={color2 ?? color ?? secondary} />
        </LinearGradient>
      </Defs>
      <Path
        fill={gradientFill}
        clipRule="evenodd"
        fillRule="evenodd"
        d="M6 8C4.89228 8 4 8.89228 4 10V11H11V8H10H6ZM13 8V11H23V8H13ZM4 13H12H24H36H44V35H36H34L33.9938 35H24.0062L24 35L23.9938 35H12.0062L12 35L11.9938 35H4V22.77V21.05C4 20.4977 3.55228 20.05 3 20.05C2.44772 20.05 2 20.4977 2 21.05V22.77V37V38C2 40.2123 3.78772 42 6 42H12H24H27C27.5523 42 28 41.5523 28 41C28 40.4477 27.5523 40 27 40H25V37L34 37H34.0062H35V40H33C32.4477 40 32 40.4477 32 41C32 41.5523 32.4477 42 33 42H36H42C44.2123 42 46 40.2123 46 38V37V11V10C46 7.78772 44.2123 6 42 6H36H24H12H10H6C3.78772 6 2 7.78772 2 10V11V15.23C2 15.7823 2.44772 16.23 3 16.23C3.55228 16.23 4 15.7823 4 15.23V13ZM35 8H25V11H35V8ZM37 11V8H42C43.1077 8 44 8.89228 44 10V11H37ZM42 40H37V37H44V38C44 39.1077 43.1077 40 42 40ZM11 37L4 37V38C4 39.1077 4.89228 40 6 40H11V37ZM13 40V37L23 37V40H13ZM29.0272 22.4456L22.5411 19.1875C21.3771 18.5966 20.02 19.455 20.02 20.74V27.27C20.02 28.555 21.377 29.4134 22.5411 28.8225L29.0289 25.5636L29.0289 25.5637L29.0403 25.5578C30.2864 24.9117 30.3175 23.0917 29.0282 22.4461L29.0272 22.4456ZM27.6761 24.005L22.02 21.1639V26.8461L27.6761 24.005Z"
      />
    </AccessibleSvg>
  )
}

export const Streaming = styled(StreamingSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.standard,
}))``
