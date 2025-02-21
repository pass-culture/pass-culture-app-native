import * as React from 'react'
import { Defs, G, Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'

const TicketCutoutLeftSvg: React.FunctionComponent<AccessibleIcon> = ({
  accessibilityLabel,
  testID,
}) => (
  <AccessibleSvg width="54" height="86" testID={testID} accessibilityLabel={accessibilityLabel}>
    <G clip-path="url(#clip0_4957_1718)">
      <G filter="url(#filter0_d_4957_1718)">
        <Path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M54 0H24V23C35.0457 23 44 31.9543 44 43C44 54.0457 35.0457 63 24 63L24 86H54V0Z"
          fill="white"
        />
      </G>
    </G>
    <Defs>
      <filter
        id="filter0_d_4957_1718"
        x="8"
        y="-16"
        width="62"
        height="118"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset />
        <feGaussianBlur stdDeviation="8" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.0862745 0 0 0 0 0.0862745 0 0 0 0 0.0901961 0 0 0 0.15 0"
        />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4957_1718" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_4957_1718"
          result="shape"
        />
      </filter>
      <clipPath id="clip0_4957_1718">
        <rect width="54" height="86" fill="white" />
      </clipPath>
    </Defs>
  </AccessibleSvg>
)

export const TicketCutoutLeft = styled(TicketCutoutLeftSvg).attrs(({ color, theme }) => ({
  color: color ?? theme.colors.black,
}))``
