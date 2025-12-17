import React from 'react'
import { Path, G, Defs, LinearGradient, Stop, ClipPath, Rect } from 'react-native-svg'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { svgIdentifier } from 'ui/svg/utils'

import { AccessibleRectangleIcon } from '../types'

export const Books: React.FunctionComponent<AccessibleRectangleIcon> = ({
  accessibilityLabel,
  testID,
  width = 156,
  height = 92,
}) => {
  const { id: clipPathId, fill: clipPath } = svgIdentifier()
  const { id: gradientId, fill: gradientFill } = svgIdentifier()

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
            d="M47.4333 106.071L-1.4265 95.9831L-5.00629 91.1065L9.36123 29.7913C9.67506 28.2712 11.2935 27.317 12.9775 27.6647L61.5509 37.6934C63.2349 38.0411 64.343 39.5583 64.0292 41.0783L51.0495 103.944C50.7345 105.47 49.1173 106.419 47.4333 106.071Z"
            fill="white"
          />
        </G>
        <Path
          d="M45.3704 104.125L-1.08934 94.5328L-2.49406 92.5431L12.5767 28.3425L60.6372 38.223L62.0419 40.2128L49.3401 101.733C48.9835 103.431 47.2091 104.505 45.3704 104.125Z"
          fill="#EB0055"
        />
        <G>
          <Path
            d="M44.3492 102.222L-3.17599 92.4094C-4.73973 92.0866 -5.73517 90.5442 -5.40936 88.9662L7.41338 26.8602C7.73919 25.2822 9.26979 24.2614 10.8278 24.583L58.353 34.3953C59.9167 34.7182 60.9121 36.2605 60.5863 37.8386L47.7648 99.9388C47.4435 101.524 45.9129 102.545 44.3492 102.222Z"
            fill={gradientFill}
          />
        </G>
        <Path
          opacity={0.6}
          d="M1.59391 91.6926L1.39916 91.6524C0.9982 91.5696 0.750801 91.1191 0.847938 90.6486L14.2583 25.6963C14.3555 25.2259 14.7611 24.9102 15.162 24.993L15.3568 25.0332C15.7577 25.116 16.0051 25.5665 15.908 26.0369L2.49621 90.996C2.40046 91.4597 1.99487 91.7754 1.59391 91.6926Z"
          fill="#EB0055"
        />
        <Path
          d="M45.3695 51.7185L22.3373 46.9631C21.9936 46.8922 21.7716 46.5499 21.8435 46.2018L22.428 43.3707C22.4999 43.0226 22.8393 42.7962 23.1829 42.8672L46.2209 47.6237C46.5646 47.6947 46.7866 48.0369 46.7147 48.385L46.1314 51.2104C46.0583 51.5643 45.7189 51.7906 45.3695 51.7185Z"
          fill="#EB0055"
        />
        <Path
          d="M33.841 56.8997L20.6895 54.1844C20.4261 54.13 20.2584 53.8716 20.3135 53.6047L20.9592 50.4776C21.0143 50.2108 21.2705 50.0399 21.534 50.0943L34.6855 52.8096C34.949 52.864 35.1166 53.1224 35.0615 53.3893L34.4159 56.5163C34.362 56.7774 34.1045 56.9541 33.841 56.8997Z"
          fill="#EB0055"
        />
      </G>
      <Defs>
        <LinearGradient
          id={gradientId}
          x1={34.5904}
          y1={29.4892}
          x2={-5.75801}
          y2={117.376}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="white" />
          <Stop offset={1} stopColor="#F2C7D6" />
        </LinearGradient>
        <ClipPath id={clipPathId}>
          <Rect width={156} height={92} fill="white" />
        </ClipPath>
      </Defs>
    </AccessibleSvg>
  )
}
