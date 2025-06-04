import * as React from 'react'
import {
  ClipPath,
  Defs,
  FeBlend,
  FeColorMatrix,
  FeGaussianBlur,
  Filter,
  G,
  Path,
  Rect,
  Use,
} from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { svgIdentifier } from 'ui/svg/utils'

const TicketCutoutLeftSvg: React.FunctionComponent<AccessibleIcon> = ({
  accessibilityLabel,
  testID,
}) => {
  const { id: clipPathId, fill: clipPath } = svgIdentifier()
  const { id: filterId, fill: filter } = svgIdentifier()
  const { id: pathId } = svgIdentifier()
  return (
    <AccessibleSvg width="54" height="86" testID={testID} accessibilityLabel={accessibilityLabel}>
      <G clipPath={clipPath}>
        <G filter={filter}>
          <Path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M54 0H24V23C35.0457 23 44 31.9543 44 43C44 54.0457 35.0457 63 24 63L24 86H54V0Z"
            fill="white"
            id={pathId}
          />
        </G>
        <Use href={`url(#${pathId})`} />
      </G>
      <Defs>
        <Filter id={filterId} x="8" y="-16" width="62" height="118" filterUnits="userSpaceOnUse">
          <FeGaussianBlur stdDeviation="8" />
          <FeColorMatrix
            type="matrix"
            values="0 0 0 0 0.0862745 0 0 0 0 0.0862745 0 0 0 0 0.0901961 0 0 0 0.15 0"
          />
          <FeBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4957_1718" />
          <FeBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_4957_1718"
            result="shape"
          />
        </Filter>
        <ClipPath id={clipPathId}>
          <Rect width="54" height="86" fill="white" />
        </ClipPath>
      </Defs>
    </AccessibleSvg>
  )
}
export const TicketCutoutLeft = styled(TicketCutoutLeftSvg).attrs(({ color, theme }) => ({
  color: color ?? theme.designSystem.color.icon.default,
}))``
