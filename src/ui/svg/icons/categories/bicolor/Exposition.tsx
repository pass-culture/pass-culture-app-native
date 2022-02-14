import * as React from 'react'
import { Defs, LinearGradient, Path, Stop } from 'react-native-svg'
import styled, { useTheme } from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { svgIdentifier } from 'ui/svg/utils'

const ExpositionSvg: React.FunctionComponent<AccessibleIcon> = ({
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
      accessibilityLabel={accessibilityLabel}
      aria-hidden={!accessibilityLabel}>
      <Defs>
        <LinearGradient id={gradientId} x1="28.841%" x2="71.159%" y1="0%" y2="100%">
          <Stop offset="0%" stopColor={color ?? primary} />
          <Stop offset="100%" stopColor={color2 ?? color ?? secondary} />
        </LinearGradient>
      </Defs>
      <Path
        fill={gradientFill}
        clipRule={'evenodd'}
        fillRule={'evenodd'}
        d="M25.5304 4.41427C24.5808 3.86525 23.4191 3.86525 22.4694 4.41427L22.4652 4.41672L5.51607 14.3262C2.83826 15.8883 3.93472 20 7.04994 20H9.06295C9.02225 20.1089 9 20.2269 9 20.35V37H8C6.34772 37 5 38.3477 5 40V41C5 42.6523 6.34772 44 8 44H40C41.6523 44 43 42.6523 43 41V40C43 38.3477 41.6523 37 40 37H39V20H40.9499C44.0479 20 45.1679 15.8919 42.4838 14.3262L25.5347 4.41671L25.5304 4.41427ZM37 37V19.35C37 19.2299 37.0212 19.1147 37.06 19.0081L37.0599 19C37.0599 18.4477 37.5077 18 38.0599 18H40.9499C42.012 18 42.392 16.5881 41.4761 16.0538L24.5294 6.14574L24.5277 6.14471C24.1983 5.9551 23.8016 5.9551 23.4722 6.14471L23.4704 6.14574L6.52467 16.0533C5.60248 16.5912 5.98517 18 7.04994 18H33.9999C34.5522 18 34.9999 18.4477 34.9999 19C34.9999 19.5523 34.5522 20 33.9999 20H10.937C10.9777 20.1089 11 20.2269 11 20.35V38C11 38.5523 10.5523 39 10 39L8 39C7.45228 39 7 39.4523 7 40V41C7 41.5477 7.45228 42 8 42H40C40.5477 42 41 41.5477 41 41V40C41 39.4523 40.5477 39 40 39H31H14.55C13.9977 39 13.55 38.5523 13.55 38C13.55 37.4477 13.9977 37 14.55 37H16V23.35C16 22.7977 16.4477 22.35 17 22.35C17.5523 22.35 18 22.7977 18 23.35V37H23V22.35C23 21.7977 23.4477 21.35 24 21.35C24.5523 21.35 25 21.7977 25 22.35V37H30V24C30 23.4477 30.4477 23 31 23C31.5523 23 32 23.4477 32 24V37H37ZM24 13.5C24.8284 13.5 25.5 12.8284 25.5 12C25.5 11.1716 24.8284 10.5 24 10.5C23.1716 10.5 22.5 11.1716 22.5 12C22.5 12.8284 23.1716 13.5 24 13.5Z"
      />
    </AccessibleSvg>
  )
}

export const Exposition = styled(ExpositionSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.primary,
  size: size ?? theme.icons.sizes.standard,
}))``
