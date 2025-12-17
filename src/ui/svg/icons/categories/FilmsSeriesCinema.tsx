import React from 'react'
import { Path, G, Defs, LinearGradient, Stop, ClipPath, Rect, Mask } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { svgIdentifier } from 'ui/svg/utils'

import { AccessibleRectangleIcon } from '../types'

export const FilmsSeriesCinema: React.FunctionComponent<AccessibleRectangleIcon> = ({
  accessibilityLabel,
  testID,
  width = 156,
  height = 92,
}) => {
  const { id: clipPathId, fill: clipPath } = svgIdentifier()
  const { id: gradientId, fill: gradientFill } = svgIdentifier()
  const { id: maskId0, fill: mask0 } = svgIdentifier()
  const { id: maskId1, fill: mask1 } = svgIdentifier()

  return (
    <AccessibleSvg
      width={width}
      height={height}
      viewBox="0 0 156 92"
      fill="none"
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      <G clipPath={clipPath}>
        <G>
          <Path
            d="M-7.53312 54.9265C-7.96464 52.9532 -6.71476 51.0037 -4.74143 50.5722L51.8281 38.2017C53.8015 37.7702 55.751 39.0201 56.1825 40.9934L62.8531 71.4975C63.2846 73.4708 62.0347 75.4203 60.0614 75.8519L3.4918 88.2223C1.51847 88.6538 -0.431042 87.404 -0.862563 85.4306L-7.53312 54.9265Z"
            fill={gradientFill}
          />
        </G>

        <StyledMask id={maskId0} maskUnits="userSpaceOnUse" x={-2} y={35} width={72} height={24}>
          <Path
            d="M68.8584 37.1943C68.579 35.8082 67.2323 34.9272 65.8503 35.2264L0.261971 49.4295C-1.11997 49.7288 -2.01377 51.095 -1.7344 52.4811L-0.946689 56.3893C-0.667313 57.7754 0.679449 58.6564 2.06139 58.3572L67.6497 44.1541C69.0317 43.8548 69.9255 42.4885 69.6461 41.1025L68.8584 37.1943Z"
            fill="#B91528"
          />
        </StyledMask>

        <G mask={mask0}>
          <Path
            d="M19.1664 36.8571C18.1048 35.9231 16.487 36.0266 15.5531 37.0883L13.1048 39.8712C12.1709 40.9329 12.2744 42.5506 13.336 43.4845L38.2317 65.3861C39.2934 66.32 40.9111 66.2165 41.845 65.1549L44.2933 62.3719C45.2272 61.3103 45.1237 59.6926 44.0621 58.7586L19.1664 36.8571Z"
            fill="#FF966B"
          />
          <Path
            d="M-0.212891 41.877L-6.04327 48.5044L22.6969 73.7881L28.5273 67.1606L-0.212891 41.877Z"
            fill="#FF966B"
          />
          <Path
            d="M38.7979 31.7754L32.9675 38.4028L68.7093 69.8461L74.5397 63.2186L38.7979 31.7754Z"
            fill="#FF966B"
          />
        </G>

        <G>
          <Path
            d="M-20.104 58.2619C-21.2153 57.0887 -21.1435 55.2602 -19.9437 54.1777L32.7104 6.67488C33.9102 5.59243 35.7838 5.66595 36.8951 6.83912L41.4608 11.6589C42.5722 12.832 42.5004 14.6606 41.3005 15.743L-11.3536 63.2459C-12.5534 64.3284 -14.427 64.2548 -15.5383 63.0817L-20.104 58.2619Z"
            fill="white"
          />
        </G>

        <StyledMask id={maskId1} maskUnits="userSpaceOnUse" x={-22} y={5} width={65} height={60}>
          <Path
            d="M-20.4087 57.9403C-21.3523 56.9442 -21.2661 55.3689 -20.2162 54.4217L32.981 6.42892C34.0308 5.48177 35.6468 5.52143 36.5904 6.51751L41.7922 12.0087C42.7357 13.0048 42.6496 14.5801 41.5997 15.5272L-11.5975 63.5201C-12.6474 64.4672 -14.2634 64.4276 -15.2069 63.4315L-20.4087 57.9403Z"
            fill="#94F0D6"
          />
        </StyledMask>

        <G mask={mask1}>
          <Path
            d="M9.8591 7.21461C9.71902 5.8076 10.7452 4.54522 12.1512 4.39501L17.2279 3.85263C18.6338 3.70242 19.8872 4.72126 20.0272 6.12827L23.8586 44.613C23.9986 46.02 22.9724 47.2824 21.5665 47.4326L16.4898 47.9749C15.0838 48.1252 13.8305 47.1063 13.6904 45.6993L9.8591 7.21461Z"
            fill="#FF966B"
          />
          <Path
            d="M27.6572 -6.81641L37.8254 -7.90275L42.1639 35.6772L31.9958 36.7635L27.6572 -6.81641Z"
            fill="#FF966B"
          />
          <Path
            d="M-8.2002 23.041L1.96794 21.9547L7.36347 76.1515L-2.80466 77.2378L-8.2002 23.041Z"
            fill="#FF966B"
          />
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M43.2391 14.0889L2.20113 51.0699L1.4209 50.2041L42.4589 13.2231L43.2391 14.0889Z"
            fill="#FF966B"
          />
        </G>

        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M57.4479 46.7461L2.04849 58.7355L1.81641 57.6631L57.2158 45.6737L57.4479 46.7461Z"
          fill="#FF966B"
        />
      </G>

      <Defs>
        <LinearGradient
          id={gradientId}
          x1={31.0763}
          y1={46.0567}
          x2={15.2632}
          y2={84.0082}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="white" />
          <Stop offset={1} stopColor="#FFD3C2" />
        </LinearGradient>
        <ClipPath id={clipPathId}>
          <Rect width={156} height={92} fill="white" />
        </ClipPath>
      </Defs>
    </AccessibleSvg>
  )
}

const StyledMask = styled(Mask)({
  maskType: 'alpha',
})
