import * as React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'

const NewPunchedTicket: React.FunctionComponent<AccessibleIcon> = ({
  accessibilityLabel,
  testID,
}) => (
  <AccessibleSvg width="327" height="48" testID={testID} accessibilityLabel={accessibilityLabel}>
    <g clipPath="url(#clip0_4721_1181)">
      <g filter="url(#filter0_d_4721_1181)">
        <Path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M0.496667 4.00604L4.58445e-05 -249.953C-0.02591 -263.226 10.7268 -274 24 -274L30.5038 -274L30.5038 478L25.3767 478C12.1402 478 1.40261 467.283 1.37673 454.047L0.57486 43.9919C11.3547 43.6876 20 34.8534 20 24C20 13.1204 11.3129 4.26965 0.496667 4.00604Z"
          fill="white"
        />
        <g clipPath="url(#clip1_4721_1181)">
          <rect width="268" height="752" transform="translate(30.5039 -274)" fill="white" />
          <Path
            d="M290.504 24L38.5039 24"
            stroke="#CBCDD2"
            stroke-width="4"
            stroke-linecap="round"
            stroke-dasharray="2 16"
          />
        </g>
        <Path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M306.998 24C306.998 35.0457 315.952 44 326.998 44C327.194 44 327.389 43.9972 327.584 43.9916L327.584 454C327.584 467.255 316.839 478 303.584 478L298.504 478L298.504 -274L303.584 -274C316.839 -274 327.584 -263.255 327.584 -250L327.584 4.00842C327.389 4.00284 327.194 4 326.998 4C315.952 4 306.998 12.9543 306.998 24Z"
          fill="white"
        />
      </g>
    </g>
    <defs>
      <filter
        id="filter0_d_4721_1181"
        x="-16"
        y="-288"
        width="359.584"
        height="784"
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
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4721_1181" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_4721_1181"
          result="shape"
        />
      </filter>
      <clipPath id="clip0_4721_1181">
        <rect width="327" height="48" fill="white" />
      </clipPath>
      <clipPath id="clip1_4721_1181">
        <rect width="268" height="752" fill="white" transform="translate(30.5039 -274)" />
      </clipPath>
    </defs>
  </AccessibleSvg>
)

export const NewPunchedTicketSvg = styled(NewPunchedTicket).attrs(({ color, theme }) => ({
  color: color ?? theme.colors.black,
}))``
