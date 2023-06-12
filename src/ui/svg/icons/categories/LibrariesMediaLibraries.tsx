import * as React from 'react'
import { Path, G, Defs, LinearGradient, Stop, ClipPath, Rect } from 'react-native-svg'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from '../types'

export const LibrariesMediaLibraries: React.FunctionComponent<AccessibleIcon> = ({
  accessibilityLabel,
  testID,
}) => {
  return (
    <AccessibleSvg
      width={156}
      height={92}
      viewBox="0 0 156 92"
      fill="none"
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      <G clipPath="url(#clip0_1981_1371)">
        <G filter="url(#filter0_d_1981_1371)">
          <Path
            d="M18.2042 22.7279L17.5949 22.6154C17.0024 22.5085 16.4379 22.9022 16.3317 23.4929L16.2702 23.8247C16.164 24.421 15.5938 24.8147 15.0069 24.7022L9.99853 23.7797C9.40603 23.6729 9.01475 23.0991 9.12654 22.5085L9.18803 22.1766C9.29423 21.5804 8.90295 21.0123 8.31604 20.9054L7.70676 20.7929C7.11425 20.686 6.5497 21.0798 6.44349 21.6704L-4.27753 80.5973C-4.38374 81.1936 -3.99246 81.7617 -3.40554 81.8686L-2.79626 81.9811C-2.20376 82.088 -1.6392 81.6942 -1.53299 81.1036C-1.42679 80.5073 -0.856642 80.1136 -0.269724 80.2261L4.73864 81.1486C5.33114 81.2555 5.72242 81.8292 5.61063 82.4198C5.50442 83.0161 5.8957 83.5842 6.48262 83.6911L7.0919 83.8036C7.6844 83.9104 8.24896 83.5167 8.35516 82.9261L19.0762 24.0047C19.1824 23.4085 18.7911 22.8404 18.2042 22.7279Z"
            fill="url(#paint0_linear_1981_1371)"
          />
        </G>
        <G filter="url(#filter1_d_1981_1371)">
          <Path
            d="M37.7569 84H20.4903C19.8531 84 19.3389 83.4825 19.3389 82.8413V17.1587C19.3389 16.5175 19.8531 16 20.4903 16H37.7569C38.3941 16 38.9084 16.5175 38.9084 17.1587V82.8469C38.9084 83.4825 38.3941 84 37.7569 84Z"
            fill="url(#paint1_linear_1981_1371)"
          />
        </G>
        <G filter="url(#filter2_d_1981_1371)">
          <Path
            d="M53.1055 84.0022H42.0323C41.5404 84.0022 41.1436 83.6029 41.1436 83.1079V22.8084C41.1436 22.3134 41.5404 21.9141 42.0323 21.9141H53.1055C53.5974 21.9141 53.9943 22.3134 53.9943 22.8084V83.1079C53.9998 83.6029 53.5974 84.0022 53.1055 84.0022Z"
            fill="url(#paint2_linear_1981_1371)"
          />
        </G>
        <Path d="M38.9077 73.9355H19.3438V76.748H38.9077V73.9355Z" fill="#FFB496" />
        <Path d="M53.9998 78.4375H41.1436V80.125H53.9998V78.4375Z" fill="#FFB496" />
        <Path d="M53.9998 26.123H41.1436V27.8105H53.9998V26.123Z" fill="#FFB496" />
        <Path d="M38.9077 22.1895H19.3438V25.0019H38.9077V22.1895Z" fill="#FFB496" />
        <Path
          d="M5.53778 82.8758L-1.63379 81.5595L9.20462 21.9238L16.3706 23.2457L5.53778 82.8758Z"
          fill="#FFB496"
        />
      </G>
      <Defs>
        <LinearGradient
          id="paint0_linear_1981_1371"
          x1={-20.7628}
          y1={96.873}
          x2={-0.993079}
          y2={27.4874}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFDECC" />
          <Stop offset={1} stopColor="white" />
        </LinearGradient>
        <LinearGradient
          id="paint1_linear_1981_1371"
          x1={5.55995}
          y1={98.0776}
          x2={31.7461}
          y2={26.7818}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFDECC" />
          <Stop offset={1} stopColor="white" />
        </LinearGradient>
        <LinearGradient
          id="paint2_linear_1981_1371"
          x1={32.0953}
          y1={96.856}
          x2={62.0202}
          y2={38.2592}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFDECC" />
          <Stop offset={1} stopColor="white" />
        </LinearGradient>
        <ClipPath id="clip0_1981_1371">
          <Rect width={156} height={92} fill="white" />
        </ClipPath>
      </Defs>
    </AccessibleSvg>
  )
}
