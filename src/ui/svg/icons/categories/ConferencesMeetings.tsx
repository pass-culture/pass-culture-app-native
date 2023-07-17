import * as React from 'react'
import {
  Path,
  G,
  Defs,
  RadialGradient,
  LinearGradient,
  Stop,
  ClipPath,
  Rect,
} from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { svgIdentifier } from 'ui/svg/utils'

import { AccessibleIcon } from '../types'

const ConferencesMeetingsSvg: React.FunctionComponent<AccessibleIcon> = ({
  accessibilityLabel,
  testID,
}) => {
  const { id: gradientId, fill: gradientFill } = svgIdentifier()
  const { id: gradientId1, fill: gradientFill1 } = svgIdentifier()
  const { id: gradientId2, fill: gradientFill2 } = svgIdentifier()
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
            fillRule="evenodd"
            clipRule="evenodd"
            d="M18.793 91.5664V75.8359H23.3348V91.5664H18.793Z"
            fill="#FFF5D8"
          />
        </G>
        <G>
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M-1.87305 47.268C-1.87305 46.0154 -0.856327 45 0.397861 45H5.33481V49.5359H2.66877V54.2986C2.66877 64.7411 10.9501 73.1227 21.0631 73.1227C31.1762 73.1227 39.4575 64.7411 39.4575 54.2986V49.5359H37.1411V45H41.7284C42.9826 45 43.9993 46.0154 43.9993 47.268V54.2986C43.9993 67.1526 33.7773 77.6586 21.0631 77.6586C8.34899 77.6586 -1.87305 67.1526 -1.87305 54.2986V47.268Z"
            fill={gradientFill}
          />
        </G>
        <G>
          <Path
            d="M21.0634 64.4959C13.6648 64.4959 7.66504 58.5039 7.66504 51.1149V32.5177C7.66504 25.1287 13.6648 19.1367 21.0634 19.1367C28.462 19.1367 34.4618 25.1287 34.4618 32.5177V51.1149C34.4618 58.5039 28.462 64.4959 21.0634 64.4959Z"
            fill="#FBDBAC"
          />
        </G>
        <G>
          <Path
            d="M31.2825 21.5353V29.1149C31.2825 30.1173 30.4695 30.9292 29.4657 30.9292C28.462 30.9292 27.649 30.1173 27.649 29.1149V18.5779C27.649 18.3965 27.54 18.2287 27.372 18.1561C26.1911 17.6526 24.933 17.2852 23.625 17.0765C23.357 17.0312 23.1072 17.2489 23.1072 17.5256V27.7541C23.1072 28.7565 22.2942 29.5684 21.2905 29.5684C20.2867 29.5684 19.4737 28.7565 19.4737 27.7541V17.4576C19.4737 17.1854 19.233 16.9677 18.9651 17.004C17.489 17.1945 16.0765 17.5936 14.7503 18.1561C14.5867 18.2287 14.4777 18.392 14.4777 18.5779V29.1149C14.4777 30.1173 13.6648 30.9292 12.661 30.9292C11.6573 30.9292 10.8443 30.1173 10.8443 29.1149V21.5353C10.8443 21.1362 10.3674 20.9321 10.0767 21.1997C6.94287 24.1299 4.98535 28.2984 4.98535 32.925V55.2417C4.98535 64.1094 12.1841 71.2989 21.0634 71.2989C29.9426 71.2989 37.1414 64.1094 37.1414 55.2417V32.925C37.1414 28.2984 35.1839 24.1299 32.05 21.1997C31.7594 20.9275 31.2825 21.1362 31.2825 21.5353Z"
            fill={gradientFill1}
          />
        </G>
        <Path
          opacity={0.4}
          d="M27 60C27 61.6569 25.6569 63 24 63H18C16.3431 63 15 61.6569 15 60V58C15 56.3431 16.3431 55 18 55H24C25.6569 55 27 56.3431 27 58V60Z"
          fill={gradientFill2}
        />
        <Path
          d="M24.2148 59.443C24.2148 60.2399 23.5688 60.8859 22.7718 60.8859H18.443C17.646 60.8859 17 60.2399 17 59.443C17 58.646 17.646 58 18.443 58H22.7718C23.5688 58 24.2148 58.646 24.2148 59.443Z"
          fill="#FBDBAC"
        />
      </G>
      <Defs>
        <LinearGradient
          id={gradientId}
          x1={11.4995}
          y1={76}
          x2={37.8123}
          y2={39.4201}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFF5D8" />
          <Stop offset={0.880208} stopColor="white" />
        </LinearGradient>
        <RadialGradient
          id={gradientId1}
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(25.9995 26.5) rotate(115.301) scale(60.8358 60.8358)">
          <Stop stopColor="white" />
          <Stop offset={1} stopColor="#FFF5D8" />
        </RadialGradient>
        <RadialGradient
          id={gradientId2}
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(21.0004 58.9999) scale(13.0929 6.97862)">
          <Stop stopColor="white" />
          <Stop offset={1} stopColor="#FFF5D8" />
        </RadialGradient>
        <ClipPath id={clipPathId}>
          <Rect width={156} height={92} fill="white" />
        </ClipPath>
      </Defs>
    </AccessibleSvg>
  )
}

export const ConferencesMeetings = styled(ConferencesMeetingsSvg).attrs(({ size, theme }) => ({
  size: size ?? theme.illustrations.sizes.fullPage,
}))``
