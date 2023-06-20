import * as React from 'react'
import { Path, G, Defs, LinearGradient, Stop, ClipPath, Rect, Mask } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from '../types'

export const FilmsSeriesCinema: React.FunctionComponent<AccessibleIcon> = ({
  accessibilityLabel,
  testID,
}) => (
  <AccessibleSvg
    width={156}
    height={92}
    viewBox="0 0 156 92"
    fill="none"
    accessibilityLabel={accessibilityLabel}
    testID={testID}>
    <G clipPath="url(#clip0_1981_1388)">
      <G filter="url(#filter0_d_1981_1388)">
        <Path
          d="M-8.91866 56.6547C-9.30391 54.893 -8.18806 53.1525 -6.42634 52.7673L44.0771 41.7233C45.8388 41.3381 47.5793 42.4539 47.9646 44.2157L53.9198 71.4487C54.3051 73.2104 53.1892 74.9509 51.4275 75.3362L0.924023 86.3801C-0.837696 86.7654 -2.57816 85.6495 -2.96341 83.8878L-8.91866 56.6547Z"
          fill="url(#paint0_linear_1981_1388)"
        />
      </G>
      <StyledMask
        id="mask0_1981_1388"
        maskUnits="userSpaceOnUse"
        x={-4}
        y={39}
        width={65}
        height={21}>
        <Path
          d="M59.2807 40.8103C59.0313 39.5729 57.829 38.7863 56.5952 39.0535L-1.95993 51.7335C-3.19368 52.0007 -3.99164 53.2204 -3.74222 54.4579L-3.03898 57.947C-2.78956 59.1844 -1.58722 59.971 -0.353469 59.7038L58.2017 47.0237C59.4354 46.7566 60.2334 45.5368 59.984 44.2994L59.2807 40.8103Z"
          fill="#B91528"
        />
      </StyledMask>
      <G mask="url(#mask0_1981_1388)">
        <Path
          d="M14.9163 40.5111C13.9685 39.6773 12.5243 39.7697 11.6905 40.7175L9.50474 43.202C8.67095 44.1498 8.76336 45.594 9.71114 46.4278L31.9372 65.9808C32.885 66.8146 34.3293 66.7222 35.1631 65.7744L37.3488 63.2899C38.1826 62.3421 38.0902 60.8978 37.1424 60.064L14.9163 40.5111Z"
          fill="#94F0D6"
        />
        <Path
          d="M-2.38477 44.9935L-7.58994 50.9103L18.0684 73.4827L23.2736 67.566L-2.38477 44.9935Z"
          fill="#94F0D6"
        />
        <Path
          d="M32.4443 35.974L27.2392 41.8908L59.1483 69.9622L64.3535 64.0455L32.4443 35.974Z"
          fill="#94F0D6"
        />
      </G>
      <G filter="url(#filter1_d_1981_1388)">
        <Path
          d="M-20.144 59.6308C-21.1361 58.5834 -21.0721 56.951 -20.0009 55.9846L27.007 13.5756C28.0782 12.6092 29.7508 12.6749 30.743 13.7222L34.8191 18.0251C35.8112 19.0725 35.7472 20.705 34.676 21.6714L-12.3319 64.0803C-13.4031 65.0467 -15.0757 64.9811 -16.0679 63.9337L-20.144 59.6308Z"
          fill="#DBFFEA"
        />
      </G>
      <StyledMask
        id="mask1_1981_1388"
        maskUnits="userSpaceOnUse"
        x={-21}
        y={12}
        width={57}
        height={53}>
        <Path
          d="M-20.4152 59.3488C-21.2575 58.4595 -21.1806 57.0532 -20.2433 56.2076L27.2494 13.3612C28.1867 12.5156 29.6294 12.551 30.4718 13.4402L35.1157 18.3426C35.9581 19.2319 35.8812 20.6383 34.9439 21.4838L-12.5488 64.3303C-13.4861 65.1759 -14.9288 65.1404 -15.7712 64.2512L-20.4152 59.3488Z"
          fill="#4E0CD9"
        />
      </StyledMask>
      <G mask="url(#mask1_1981_1388)">
        <Path
          d="M6.60827 14.0619C6.48321 12.8058 7.39938 11.6788 8.65458 11.5447L13.1869 11.0604C14.4421 10.9263 15.561 11.8359 15.686 13.0921L19.1065 47.4499C19.2316 48.7061 18.3154 49.8331 17.0602 49.9672L12.5279 50.4514C11.2727 50.5855 10.1538 49.6759 10.0287 48.4198L6.60827 14.0619Z"
          fill="#94F0D6"
        />
        <Path
          d="M22.498 1.53552L31.5758 0.565672L35.4492 39.4724L26.3714 40.4423L22.498 1.53552Z"
          fill="#94F0D6"
        />
        <Path
          d="M-9.51367 28.1898L-0.435895 27.22L4.38106 75.6051L-4.69672 76.5749L-9.51367 28.1898Z"
          fill="#94F0D6"
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M36.4091 20.1993L-0.228237 53.2148L-0.924805 52.4418L35.7125 19.4263L36.4091 20.1993Z"
          fill="#94F0D6"
        />
      </G>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M49.0937 49.3513L-0.365065 60.0551L-0.572266 59.0977L48.8865 48.3939L49.0937 49.3513Z"
        fill="#94F0D6"
      />
    </G>
    <Defs>
      <LinearGradient
        id="paint0_linear_1981_1388"
        x1={14.1326}
        y1={38.6194}
        x2={24.7447}
        y2={79.4351}
        gradientUnits="userSpaceOnUse">
        <Stop stopColor="#DBFFEA" />
        <Stop offset={0.5625} stopColor="white" />
        <Stop offset={1} stopColor="#DBFFEA" />
      </LinearGradient>
      <ClipPath id="clip0_1981_1388">
        <Rect width={156} height={92} fill="white" />
      </ClipPath>
    </Defs>
  </AccessibleSvg>
)

const StyledMask = styled(Mask)({
  maskType: 'alpha',
})
