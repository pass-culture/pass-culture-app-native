import * as React from 'react'
import { Defs, LinearGradient, Path, Stop } from 'react-native-svg'
import styled, { useTheme } from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { svgIdentifier } from 'ui/svg/utils'

function ChemistryToolsSvg({
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
        clipRule="evenodd"
        fillRule="evenodd"
        d="M35.9994 9.65394C35.8066 8.56504 34.7659 7.83838 33.675 8.03092C32.5842 8.22345 31.8562 9.26226 32.0491 10.3512L36.4038 34.9358L51.7598 54.741H47.2119C46.1041 54.741 45.2061 55.6374 45.2061 56.7432C45.2061 57.849 46.1041 58.7454 47.2119 58.7454H54.8646L63.0649 69.3216L63.0909 69.3525C65.227 71.8894 63.8167 75.7337 60.4975 76.282L15.1784 83.7679L15.1702 83.7692C11.7976 84.3407 9.1539 81.0914 10.2914 78.0566L10.3074 78.0139L16.5437 58.7454H33.6631C34.7709 58.7454 35.6689 57.849 35.6689 56.7432C35.6689 55.6374 34.7709 54.741 33.6631 54.741H17.8397L23.5779 37.0114L19.2224 12.4227C19.0296 11.3338 17.9889 10.6071 16.898 10.7997C15.8072 10.9922 15.0792 12.031 15.2721 13.1199L19.4538 36.728L6.51727 76.6988C4.30099 82.7124 9.54293 88.7802 15.8358 87.7182L15.8415 87.7172L59.4581 80.5126C59.7522 84.0516 62.4229 87.0825 66.1031 87.8284C70.5651 88.7328 75.0353 85.9781 76.0015 81.5323L89.954 17.2974C90.1887 16.2167 89.5014 15.1507 88.4188 14.9164C87.3362 14.6821 86.2682 15.3682 86.0335 16.4489L81.4225 37.6772H72.5152L77.4883 14.7745C77.723 13.6939 77.0356 12.6279 75.9529 12.3936C74.8703 12.1594 73.8024 12.8456 73.5677 13.9263L68.2202 38.5532C68.0011 38.8741 67.873 39.2618 67.873 39.6795C67.873 39.7954 67.8829 39.9089 67.9018 40.0194L65.3067 51.9709C65.072 53.0516 65.7594 54.1176 66.8421 54.3518C67.9247 54.5861 68.9926 53.8999 69.2272 52.8192L71.6457 41.6817H80.5527L72.081 80.6838C71.6029 82.883 69.3199 84.3943 66.9013 83.9041C64.6818 83.4542 63.2888 81.5156 63.4601 79.51C68.1177 77.2739 69.7603 71.0913 66.1894 66.8089L40.1819 33.266L35.9994 9.65394Z"
      />
    </AccessibleSvg>
  )
}

export const ChemistryTools = styled(ChemistryToolsSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.standard,
}))``
