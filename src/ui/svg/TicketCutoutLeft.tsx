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
    <G clipPath="url(#clip0_4790_1361)">
      <G filter="url(#filter0_d_4790_1361)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M54 0H24V23C35.0457 23 44 31.9543 44 43C44 54.0457 35.0457 63 24 63L24 86H54V0Z"
          fill="white"
        />
      </G>
    </G>
    <Defs>
      <filter
        id="filter0_d_4790_1361"
        x="8"
        y="-14"
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
        <feOffset dy="2" />
        <feGaussianBlur stdDeviation="8" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.145098 0 0 0 0 0.00784314 0 0 0 0 0.423529 0 0 0 0.15 0"
        />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4790_1361" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_4790_1361"
          result="shape"
        />
      </filter>
      <clipPath id="clip0_4790_1361">
        <rect width="54" height="86" fill="white" />
      </clipPath>
    </Defs>
  </AccessibleSvg>
)

export const TicketCutoutLeft = styled(TicketCutoutLeftSvg).attrs(({ color, theme }) => ({
  color: color ?? theme.colors.black,
}))``
