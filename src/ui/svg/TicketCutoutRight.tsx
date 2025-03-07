import * as React from 'react'
import {
  G,
  Path,
  Defs,
  Filter,
  FeColorMatrix,
  FeGaussianBlur,
  FeBlend,
  ClipPath,
  Rect,
  Use,
} from 'react-native-svg'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { svgIdentifier } from 'ui/svg/utils'

export const TicketCutoutRight: React.FunctionComponent<AccessibleIcon> = ({
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
            fillRule="evenodd"
            clipRule="evenodd"
            d="M-1.90735e-06 86H30L30 63C18.9543 63 10 54.0457 10 43C10 31.9543 18.9543 23 30 23L30 0H-1.90735e-06L-1.90735e-06 86Z"
            fill="white"
            id={pathId}
          />
        </G>
        <Use href={`url(#${pathId})`} />
      </G>
      <Defs>
        <Filter id={filterId} x="-16" y="-16" width="62" height="118" filterUnits="userSpaceOnUse">
          <FeGaussianBlur stdDeviation="8" />
          <FeColorMatrix
            type="matrix"
            values="0 0 0 0 0.0862745 0 0 0 0 0.0862745 0 0 0 0 0.0901961 0 0 0 0.15 0"
          />
          <FeBlend mode="normal" in2="BackgroundImageFix" result="efFect1_dropShadow_4957_1722" />
          <FeBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_4957_1722"
            result="shape"
          />
        </Filter>
        <ClipPath id={clipPathId}>
          <Rect width="54" height="86" fill="white" transform="matrix(-1 0 0 -1 54 86)" />
        </ClipPath>
      </Defs>
    </AccessibleSvg>
  )
}
