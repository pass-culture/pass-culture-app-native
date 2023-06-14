import * as React from 'react'
import { Defs, LinearGradient, Path, Stop } from 'react-native-svg'
import styled, { useTheme } from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { svgIdentifier } from 'ui/svg/utils'

function LandscapeSvg({
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
        d="M8 20C8 17.7846 9.78457 16 12 16H62C63.1046 16 64 15.1046 64 14C64 12.8954 63.1046 12 62 12H12C7.57543 12 4 15.5754 4 20V59.999V60V76C4 80.4246 7.57543 84 12 84H73.9879H74.0121H84C88.4246 84 92 80.4246 92 76V20C92 15.5754 88.4246 12 84 12H77.58C76.4754 12 75.58 12.8954 75.58 14C75.58 15.1046 76.4754 16 77.58 16H84C86.2154 16 88 17.7846 88 20V66.5611L76.07 56.755C73.6994 54.8051 70.2177 54.9539 68.0258 57.1458L64.5858 60.5858C63.8047 61.3668 63.8047 62.6332 64.5858 63.4142C65.3668 64.1953 66.6332 64.1953 67.4142 63.4142L70.8542 59.9742C71.5821 59.2464 72.7398 59.1949 73.5293 59.8444L87.91 71.665C87.9395 71.6893 87.9695 71.7126 88 71.7349V76C88 78.2154 86.2154 80 84 80H74.8284L45.4413 50.6129C45.4225 50.5933 45.4033 50.5742 45.3839 50.5555L32.3742 37.5458C29.9499 35.1215 26.016 35.2084 23.7058 37.7285L23.7057 37.7286L8 54.8591V20ZM30.6504 54.44C33.8035 54.4247 37.286 53.7056 40.8358 51.6642L29.5458 40.3742C28.7301 39.5586 27.4241 39.5917 26.6543 40.4315L26.6542 40.4316L17.3953 50.5304C17.5364 50.623 17.7415 50.7533 18.006 50.9103C18.5871 51.2553 19.4504 51.7268 20.5465 52.2098C21.5573 52.6553 22.0156 53.8358 21.5701 54.8465C21.1247 55.8573 19.9442 56.3156 18.9334 55.8702C17.6696 55.3132 16.6628 54.7647 15.9639 54.3497C15.6141 54.142 15.3403 53.9671 15.1489 53.8405C15.0531 53.7771 14.9778 53.7257 14.9239 53.6883L14.8589 53.6428L14.8386 53.6283L14.8315 53.6232L14.8269 53.6199L15.8194 52.2493L15.8189 52.2499C14.8264 53.6195 14.8267 53.6197 14.8269 53.6199C14.7737 53.5813 14.7229 53.5406 14.6746 53.498L8 60.7781V76C8 78.2154 9.78457 80 12 80H69.1715L43.7496 54.5781C39.2481 57.411 34.7396 58.4202 30.6699 58.44C29.5653 58.4454 28.6655 57.5543 28.6602 56.4497C28.6548 55.3452 29.5459 54.4454 30.6504 54.44ZM60 34C60 31.7909 61.7909 30 64 30C66.2091 30 68 31.7909 68 34C68 36.2091 66.2091 38 64 38C61.7909 38 60 36.2091 60 34ZM64 26C59.5817 26 56 29.5817 56 34C56 38.4183 59.5817 42 64 42C68.4183 42 72 38.4183 72 34C72 29.5817 68.4183 26 64 26Z"
      />
    </AccessibleSvg>
  )
}

export const Landscape = styled(LandscapeSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.standard,
}))``
