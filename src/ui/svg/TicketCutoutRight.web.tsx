import * as React from 'react'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { svgIdentifier } from 'ui/svg/utils'

const TicketCutoutRightSvg: React.FunctionComponent<AccessibleIcon> = ({
  accessibilityLabel,
  testID,
}) => {
  const { id: clipPathId, fill: clipPath } = svgIdentifier()
  const { id: filterId, fill: filter } = svgIdentifier()
  return (
    <AccessibleSvg
      viewBox="0 0 54 86"
      width="54"
      height="86"
      testID={testID}
      fill="none"
      accessibilityLabel={accessibilityLabel}>
      <g clipPath={clipPath}>
        <g filter={filter}>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M-1.90735e-06 86H30L30 63C18.9543 63 10 54.0457 10 43C10 31.9543 18.9543 23 30 23L30 0H-1.90735e-06L-1.90735e-06 86Z"
            fill="white"
          />
        </g>
      </g>
      <defs>
        <filter
          id={filterId}
          x="-16"
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
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4957_1722" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_4957_1722"
            result="shape"
          />
        </filter>
        <clipPath id={clipPathId}>
          <rect width="54" height="86" fill="white" transform="matrix(-1 0 0 -1 54 86)" />
        </clipPath>
      </defs>
    </AccessibleSvg>
  )
}

export const TicketCutoutRight = styled(TicketCutoutRightSvg).attrs(({ color, theme }) => ({
  color: color ?? theme.designSystem.color.icon.default,
}))``
