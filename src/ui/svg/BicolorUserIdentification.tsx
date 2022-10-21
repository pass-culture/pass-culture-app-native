import React from 'react'
import { Defs, LinearGradient, Path, Stop } from 'react-native-svg'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { svgIdentifier } from 'ui/svg/utils'

const BicolorUserIdentificationSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  color2,
  accessibilityLabel,
  testID,
}) => {
  const height = typeof size === 'string' ? size : ((size as number) * 156) / 200
  const {
    colors: { primary, secondary },
  } = useTheme()
  const { id: gradientId, fill: gradientFill } = svgIdentifier()

  return (
    <AccessibleSvg
      width={size}
      height={height}
      viewBox="0 0 200 156"
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      <Defs>
        <LinearGradient
          id={gradientId}
          x1="28.841%"
          x2="71.159%"
          y1="0%"
          y2="100%"
          gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor={color ?? primary} />
          <Stop offset="100%" stopColor={color2 ?? secondary} />
        </LinearGradient>
      </Defs>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M83.05 18.5c-11.043 0-19.775 9.4-19.775 20.738v9.908c0 11.312 8.735 20.71 19.775 20.71 11.043 0 19.775-9.4 19.775-20.738v-9.88c0-11.338-8.732-20.738-19.775-20.738ZM68.925 39.238c0-8.479 6.466-15.07 14.125-15.07s14.125 6.591 14.125 15.07v9.88c0 8.478-6.466 15.069-14.125 15.069-7.661 0-14.125-6.594-14.125-15.04v-9.91ZM83.05 82.276c-16.663 0-30.647 12.448-33.719 29.093 8.35 9.62 20.353 15.637 33.72 15.637h.02c2.786 0 6.763-.009 10.366-.668 1.8-.33 3.37-.799 4.589-1.428 1.21-.625 1.912-1.321 2.269-2.041.145-.293.333-.55.554-.766a29.688 29.688 0 0 1-3.674-14.353c0-16.43 13.28-29.75 29.662-29.75a2.829 2.829 0 0 1 2.825 2.833 2.829 2.829 0 0 1-2.825 2.834c-13.261 0-24.012 10.782-24.012 24.083 0 13.301 10.751 24.083 24.012 24.083 13.262 0 24.013-10.782 24.013-24.083a24.014 24.014 0 0 0-5.219-14.992 2.839 2.839 0 0 1 .45-3.982 2.818 2.818 0 0 1 3.969.451 29.69 29.69 0 0 1 6.45 18.523c0 16.43-13.28 29.75-29.663 29.75-9.031 0-17.12-4.048-22.56-10.434-1.016 1.252-2.313 2.186-3.667 2.885-1.894.978-4.058 1.579-6.16 1.963-4.154.76-8.598.76-11.327.76h-.073c-15.622 0-29.535-7.279-38.902-18.646a2.84 2.84 0 0 1-.648-1.819c0-.2.02-.4.06-.596 3.036-19.75 19.462-35.005 39.49-35.005 4.294 0 8.437.708 12.306 2 1.48.496 2.28 2.1 1.787 3.586a2.823 2.823 0 0 1-3.573 1.793 33.147 33.147 0 0 0-10.52-1.71Zm54.624 22.534-7.916.002.02-7.947a2.917 2.917 0 0 0-2.92-2.925 2.932 2.932 0 0 0-2.929 2.922l-.019 7.971-7.937.039a2.93 2.93 0 0 0-2.916 2.935 2.917 2.917 0 0 0 2.933 2.913l7.92-.038.014 7.938a2.918 2.918 0 0 0 2.933 2.913 2.93 2.93 0 0 0 2.916-2.935l-.014-7.937 7.905-.002a2.933 2.933 0 0 0 2.93-2.923 2.918 2.918 0 0 0-2.92-2.926Z"
        fill={gradientFill}
      />
    </AccessibleSvg>
  )
}

export const BicolorUserIdentification = styled(BicolorUserIdentificationSvg).attrs(
  ({ size, theme }) => ({
    size: size ?? theme.illustrations.sizes.medium,
  })
)``
