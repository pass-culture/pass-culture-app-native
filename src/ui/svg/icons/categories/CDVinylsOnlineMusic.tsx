import * as React from 'react'
import { Path, G, Defs, Stop, ClipPath, Rect, RadialGradient } from 'react-native-svg'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { svgIdentifier } from 'ui/svg/utils'

import { AccessibleIcon } from '../types'

export const CDVinylsOnlineMusic: React.FunctionComponent<AccessibleIcon> = ({
  accessibilityLabel,
  testID,
}) => {
  const { id: gradientId, fill: gradientFill } = svgIdentifier()
  const { id: clipPathId, fill: clipPath } = svgIdentifier()

  return (
    <AccessibleSvg
      width={156}
      height={92}
      viewBox="0 0 156 92"
      fill="none"
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      <G clipPath={clipPath}>
        <G>
          <Path
            d="M22 55C22 51.6863 24.6863 49 28 49C31.3137 49 34 51.6863 34 55C34 58.3137 31.3137 61 28 61C24.6863 61 22 58.3137 22 55Z"
            fill="#20C5E9"
          />
        </G>
        <G>
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M30 18C10.67 18 -5 33.67 -5 53C-5 72.33 10.67 88 30 88C49.33 88 65 72.33 65 53C65 33.67 49.33 18 30 18ZM29 47C25.6863 47 23 49.6863 23 53C23 56.3137 25.6863 59 29 59C32.3137 59 35 56.3137 35 53C35 49.6863 32.3137 47 29 47Z"
            fill={gradientFill}
          />
        </G>
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M26.2952 60.1241C30.1241 61.6437 34.4599 59.7716 35.9794 55.9427C37.4989 52.1138 35.6268 47.778 31.7979 46.2585C27.9691 44.739 23.6333 46.6111 22.1138 50.44C20.5942 54.2688 22.4663 58.6046 26.2952 60.1241ZM17.7352 48.7023C15.2559 54.9494 18.3104 62.0235 24.5575 64.5027C30.8046 66.982 37.8788 63.9275 40.358 57.6804C42.8372 51.4333 39.7828 44.3591 33.5356 41.8799C27.2885 39.4007 20.2144 42.4551 17.7352 48.7023Z"
          fill="#A1EFFF"
        />
      </G>
      <Defs>
        <RadialGradient
          id={gradientId}
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(30 53) rotate(9.02761) scale(35.439)">
          <Stop offset={0.479167} stopColor="#D6F8FF" />
          <Stop offset={0.859375} stopColor="white" />
        </RadialGradient>
        <ClipPath id={clipPathId}>
          <Rect width={156} height={92} fill="white" />
        </ClipPath>
      </Defs>
    </AccessibleSvg>
  )
}
