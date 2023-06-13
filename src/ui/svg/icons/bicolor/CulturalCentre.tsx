import * as React from 'react'
import { Defs, LinearGradient, Path, Stop } from 'react-native-svg'
import styled, { useTheme } from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { svgIdentifier } from 'ui/svg/utils'

function CulturalCentreSvg({
  size,
  color,
  color2,
  accessibilityLabel,
  testID,
}: AccessibleIcon): React.JSX.Element {
  const {
    colors: { primary, secondary },
  } = useTheme()
  const { id: gradientId, fill: gradientFill } = svgIdentifier()
  return (
    <AccessibleSvg
      width={size}
      height={size}
      testID={testID}
      viewBox="0 0 96 96"
      accessibilityLabel={accessibilityLabel}>
      <Defs>
        <LinearGradient id={gradientId} x1="28.841%" x2="71.159%" y1="0%" y2="100%">
          <Stop offset="0%" stopColor={color ?? primary} />
          <Stop offset="100%" stopColor={color2 ?? color ?? secondary} />
        </LinearGradient>
      </Defs>
      <Path
        fill={gradientFill}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M48.8944 8.21115C48.3314 7.92962 47.6686 7.92962 47.1056 8.21115L9.10557 27.2111C8.428 27.5499 8 28.2425 8 29V86C8 87.1046 8.89543 88 10 88H34H48H62H86C87.1046 88 88 87.1046 88 86V77.5C88 76.3954 87.1046 75.5 86 75.5C84.8954 75.5 84 76.3954 84 77.5V84H63.98V59.9C63.98 57.7692 62.2583 56 60.08 56H48H35.9C33.7692 56 32 57.7217 32 59.9V84H12V30.2361L48 12.2361L84 30.2361V67.5C84 68.6046 84.8954 69.5 86 69.5C87.1046 69.5 88 68.6046 88 67.5V29C88 28.2425 87.572 27.5499 86.8944 27.2111L48.8944 8.21115ZM46 60H36V84H46V60ZM50 84V60H59.98V84H50ZM24 34C24 32.8954 24.8954 32 26 32H70C71.1046 32 72 32.8954 72 34V44C72 45.1046 71.1046 46 70 46H46C44.8954 46 44 45.1046 44 44C44 42.8954 44.8954 42 46 42H68V36H28V42H32C33.1046 42 34 42.8954 34 44C34 45.1046 33.1046 46 32 46H26C24.8954 46 24 45.1046 24 44V34Z"
      />
    </AccessibleSvg>
  )
}

export const CulturalCentre = styled(CulturalCentreSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.standard,
}))``
