import * as React from 'react'
import { Path, G, Defs, LinearGradient, Stop, ClipPath, Rect, Mask } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from '../types'

const FilmsSeriesCinemaSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  accessibilityLabel,
  testID,
}) => (
  <AccessibleSvg
    width={size}
    height={size}
    viewBox="0 0 269 112"
    accessibilityLabel={accessibilityLabel}
    fill="none"
    testID={testID}>
    <G clipPath="url(#clip0_1876_556)">
      <G filter="url(#filter0_d_1876_556)">
        <Path
          d="M-8.41866 56.6547C-8.80391 54.893 -7.68806 53.1525 -5.92634 52.7673L44.5771 41.7233C46.3389 41.3381 48.0793 42.4539 48.4646 44.2157L54.4198 71.4487C54.8051 73.2104 53.6892 74.9509 51.9275 75.3362L1.42402 86.3801C-0.337696 86.7654 -2.07816 85.6495 -2.46341 83.8878L-8.41866 56.6547Z"
          fill="url(#paint0_linear_1876_556)"
        />
      </G>
      <StyledMask
        id="mask0_1876_556"
        maskUnits="userSpaceOnUse"
        x={-4}
        y={39}
        width={65}
        height={21}>
        <Path
          d="M59.7812 40.8103C59.5318 39.5729 58.3294 38.7863 57.0957 39.0535L-1.45944 51.7335C-2.69319 52.0007 -3.49115 53.2204 -3.24173 54.4579L-2.53849 57.947C-2.28907 59.1844 -1.08673 59.971 0.147019 59.7038L58.7022 47.0237C59.9359 46.7566 60.7339 45.5368 60.4844 44.2994L59.7812 40.8103Z"
          fill="#B91528"
        />
      </StyledMask>
      <G mask="url(#mask0_1876_556)">
        <Path
          d="M15.4168 40.5111C14.469 39.6773 13.0248 39.7697 12.191 40.7175L10.0052 43.202C9.17144 44.1498 9.26384 45.594 10.2116 46.4278L32.4377 65.9808C33.3855 66.8146 34.8298 66.7222 35.6636 65.7744L37.8493 63.2899C38.6831 62.3421 38.5907 60.8978 37.6429 60.064L15.4168 40.5111Z"
          fill="#94F0D6"
        />
        <Path
          d="M-1.88428 44.9935L-7.08945 50.9103L18.5689 73.4827L23.774 67.566L-1.88428 44.9935Z"
          fill="#94F0D6"
        />
        <Path
          d="M32.9448 35.974L27.7397 41.8908L59.6488 69.9622L64.854 64.0455L32.9448 35.974Z"
          fill="#94F0D6"
        />
      </G>
      <G filter="url(#filter1_d_1876_556)">
        <Path
          d="M-19.644 59.6308C-20.6361 58.5834 -20.5721 56.951 -19.5009 55.9846L27.507 13.5756C28.5782 12.6092 30.2508 12.6749 31.243 13.7222L35.3191 18.0252C36.3112 19.0725 36.2472 20.705 35.176 21.6714L-11.8319 64.0803C-12.9031 65.0467 -14.5757 64.9811 -15.5679 63.9337L-19.644 59.6308Z"
          fill="#DBFFEA"
        />
      </G>
      <StyledMask
        id="mask1_1876_556"
        maskUnits="userSpaceOnUse"
        x={-21}
        y={12}
        width={58}
        height={53}>
        <Path
          d="M-19.9156 59.3488C-20.758 58.4595 -20.6811 57.0532 -19.7438 56.2076L27.7489 13.3612C28.6862 12.5156 30.1289 12.551 30.9713 13.4402L35.6153 18.3426C36.4576 19.2319 36.3807 20.6383 35.4434 21.4838L-12.0493 64.3303C-12.9866 65.1759 -14.4293 65.1404 -15.2717 64.2512L-19.9156 59.3488Z"
          fill="#4E0CD9"
        />
      </StyledMask>
      <G mask="url(#mask1_1876_556)">
        <Path
          d="M7.10778 14.0619C6.98272 12.8058 7.89889 11.6788 9.15409 11.5447L13.6864 11.0604C14.9416 10.9263 16.0605 11.8359 16.1856 13.0921L19.606 47.4499C19.7311 48.7061 18.8149 49.8331 17.5597 49.9672L13.0274 50.4514C11.7722 50.5855 10.6533 49.6759 10.5283 48.4198L7.10778 14.0619Z"
          fill="#94F0D6"
        />
        <Path
          d="M22.9976 1.53552L32.0753 0.565672L35.9487 39.4724L26.8709 40.4423L22.9976 1.53552Z"
          fill="#94F0D6"
        />
        <Path
          d="M-9.01416 28.1898L0.0636164 27.22L4.88057 75.6051L-4.19721 76.5749L-9.01416 28.1898Z"
          fill="#94F0D6"
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M36.9086 20.1993L0.271275 53.2148L-0.425293 52.4418L36.2121 19.4263L36.9086 20.1993Z"
          fill="#94F0D6"
        />
      </G>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M49.5937 49.3513L0.134935 60.0551L-0.0722656 59.0977L49.3865 48.3939L49.5937 49.3513Z"
        fill="#94F0D6"
      />
    </G>
    <Defs>
      <LinearGradient
        id="paint0_linear_1876_556"
        x1={14.6326}
        y1={38.6194}
        x2={25.2447}
        y2={79.4351}
        gradientUnits="userSpaceOnUse">
        <Stop stopColor="#DBFFEA" />
        <Stop offset={0.5625} stopColor="white" />
        <Stop offset={1} stopColor="#DBFFEA" />
      </LinearGradient>
      <ClipPath id="clip0_1876_556">
        <Rect width={268.5} height={112} fill="white" transform="translate(0.5)" />
      </ClipPath>
    </Defs>
  </AccessibleSvg>
)

export const FilmsSeriesCinema = styled(FilmsSeriesCinemaSvg).attrs(({ size, theme }) => ({
  size: size ?? theme.illustrations.sizes.medium,
}))``

const StyledMask = styled(Mask)({
  maskType: 'alpha',
})
