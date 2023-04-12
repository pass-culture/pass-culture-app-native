import * as React from 'react'
import { Path, Defs, LinearGradient, Stop, ClipPath, Rect } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { svgIdentifier } from 'ui/svg/utils'

import { AccessibleIcon } from './types'

const UbbleSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  accessibilityLabel,
  testID,
}) => {
  const { id: gradientId, fill: gradientFill } = svgIdentifier()
  const { id: gradientId2, fill: gradientFill2 } = svgIdentifier()
  const { id: gradientId3, fill: gradientFill3 } = svgIdentifier()
  const { id: gradientId4, fill: gradientFill4 } = svgIdentifier()

  return (
    <AccessibleSvg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      <Path
        clipRule={'evenodd'}
        fillRule={'evenodd'}
        d="M16.2377 2.60423C16.3435 3.70141 15.5404 4.67666 14.4439 4.78251C9.15176 5.29341 4.78998 9.56556 4.78998 14.4675C4.78998 15.5698 3.89697 16.4634 2.79538 16.4634C1.69379 16.4634 0.800781 15.5698 0.800781 14.4675C0.800781 7.13905 7.11409 1.47993 14.0608 0.809292C15.1573 0.703437 16.1319 1.50706 16.2377 2.60423Z"
        fill={gradientFill}
      />
      <Path
        clipRule={'evenodd'}
        fillRule={'evenodd'}
        d="M2.79538 23.5446C3.89697 23.5446 4.78998 24.4381 4.78998 25.5404C4.78998 30.7033 9.36838 35.2082 14.388 35.2082C15.4896 35.2082 16.3826 36.1018 16.3826 37.204C16.3826 38.3063 15.4896 39.1999 14.388 39.1999C7.16873 39.1999 0.800781 32.9113 0.800781 25.5404C0.800781 24.4381 1.69379 23.5446 2.79538 23.5446Z"
        fill={gradientFill2}
      />
      <Path
        clipRule={'evenodd'}
        fillRule={'evenodd'}
        d="M37.2053 23.5446C38.3069 23.5446 39.1999 24.4381 39.1999 25.5404C39.1999 32.8683 33.1458 39.1839 25.7563 39.1839C24.6547 39.1839 23.7617 38.2904 23.7617 37.1881C23.7617 36.0858 24.6547 35.1922 25.7563 35.1922C30.861 35.1922 35.2107 30.7463 35.2107 25.5404C35.2107 24.4381 36.1037 23.5446 37.2053 23.5446Z"
        fill={gradientFill3}
      />
      <Path
        clipRule={'evenodd'}
        fillRule={'evenodd'}
        d="M23.7539 2.79588C23.7539 1.69361 24.6469 0.800049 25.7485 0.800049C33.016 0.800049 39.2001 7.29709 39.2001 14.4675C39.2001 15.5698 38.3071 16.4634 37.2055 16.4634C36.1039 16.4634 35.2109 15.5698 35.2109 14.4675C35.2109 9.40748 30.7199 4.79172 25.7485 4.79172C24.6469 4.79172 23.7539 3.89815 23.7539 2.79588Z"
        fill={gradientFill4}
      />
      <Path
        fill="#7314F5"
        d="M23.1889 14.2676C24.2641 14.2676 25.1356 13.396 25.1356 12.3209C25.1356 11.2457 24.2641 10.3741 23.1889 10.3741C22.1138 10.3741 21.2422 11.2457 21.2422 12.3209C21.2422 13.396 22.1138 14.2676 23.1889 14.2676Z"
      />
      <Path
        fill="#7314F5"
        d="M16.7651 14.2676C17.8402 14.2676 18.7118 13.396 18.7118 12.3209C18.7118 11.2457 17.8402 10.3741 16.7651 10.3741C15.6899 10.3741 14.8184 11.2457 14.8184 12.3209C14.8184 13.396 15.6899 14.2676 16.7651 14.2676Z"
      />
      <Path
        fill="#7314F5"
        d="M23.1889 29.7138C24.2641 29.7138 25.1356 28.8422 25.1356 27.767C25.1356 26.6919 24.2641 25.8203 23.1889 25.8203C22.1138 25.8203 21.2422 26.6919 21.2422 27.767C21.2422 28.8422 22.1138 29.7138 23.1889 29.7138Z"
      />
      <Path
        fill="#7314F5"
        d="M16.7651 29.7138C17.8402 29.7138 18.7118 28.8422 18.7118 27.767C18.7118 26.6919 17.8402 25.8203 16.7651 25.8203C15.6899 25.8203 14.8184 26.6919 14.8184 27.767C14.8184 28.8422 15.6899 29.7138 16.7651 29.7138Z"
      />
      <Path
        fill="#7314F5"
        d="M12.226 18.7754C13.3012 18.7754 14.1728 17.9038 14.1728 16.8287C14.1728 15.7535 13.3012 14.882 12.226 14.882C11.1509 14.882 10.2793 15.7535 10.2793 16.8287C10.2793 17.9038 11.1509 18.7754 12.226 18.7754Z"
      />
      <Path
        fill="#7314F5"
        d="M27.7124 18.7754C28.7875 18.7754 29.6591 17.9038 29.6591 16.8287C29.6591 15.7535 28.7875 14.882 27.7124 14.882C26.6372 14.882 25.7656 15.7535 25.7656 16.8287C25.7656 17.9038 26.6372 18.7754 27.7124 18.7754Z"
      />
      <Path
        fill="#7314F5"
        d="M12.226 25.2139C13.3012 25.2139 14.1728 24.3423 14.1728 23.2672C14.1728 22.192 13.3012 21.3204 12.226 21.3204C11.1509 21.3204 10.2793 22.192 10.2793 23.2672C10.2793 24.3423 11.1509 25.2139 12.226 25.2139Z"
      />
      <Path
        fill="#7314F5"
        d="M27.7124 25.2139C28.7875 25.2139 29.6591 24.3423 29.6591 23.2672C29.6591 22.192 28.7875 21.3204 27.7124 21.3204C26.6372 21.3204 25.7656 22.192 25.7656 23.2672C25.7656 24.3423 26.6372 25.2139 27.7124 25.2139Z"
      />

      <Defs>
        <LinearGradient
          id={gradientId}
          x1="0.800781"
          y1="8.63204"
          x2="16.2471"
          y2="8.63204"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#7314F5" />
          <Stop offset="0.607" stopColor="#3B8BF3" />
        </LinearGradient>
        <LinearGradient
          id={gradientId2}
          x1="0.80253"
          y1="31.3709"
          x2="16.3802"
          y2="31.3709"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#7314F5" />
          <Stop offset="0.607" stopColor="#3B8BF3" />
        </LinearGradient>
        <LinearGradient
          id={gradientId3}
          x1="23.7609"
          y1="31.3646"
          x2="39.2001"
          y2="31.3646"
          gradientUnits="userSpaceOnUse">
          <Stop offset="0.4658" stopColor="#3B8BF3" />
          <Stop offset="1" stopColor="#7314F5" />
        </LinearGradient>
        <LinearGradient
          id={gradientId4}
          x1="23.7559"
          y1="8.63354"
          x2="39.2022"
          y2="8.63354"
          gradientUnits="userSpaceOnUse">
          <Stop offset="0.4662" stopColor="#3B8BF3" />
          <Stop offset="1" stopColor="#7314F5" />
        </LinearGradient>
        <ClipPath id="clip0_3962_10903">
          <Rect width="38.4" height="38.4" fill="white" transform="translate(0.800781 0.800049)" />
        </ClipPath>
      </Defs>
    </AccessibleSvg>
  )
}

export const Ubble = styled(UbbleSvg).attrs(({ size, theme }) => ({
  size: size ?? theme.icons.sizes.standard,
}))``
