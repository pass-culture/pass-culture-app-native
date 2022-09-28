import React from 'react'
import { Defs, LinearGradient, Path, Stop } from 'react-native-svg'
import styled, { useTheme } from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { svgIdentifier } from 'ui/svg/utils'

const ThingSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  color2,
  accessibilityLabel,
  testID,
}) => {
  const { id: gradientId, fill: gradientFill } = svgIdentifier()
  const {
    colors: { primary, secondary },
  } = useTheme()
  return (
    <AccessibleSvg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      <Defs>
        <LinearGradient id={gradientId} x1="28.841%" x2="71.159%" y1="0%" y2="100%">
          <Stop offset="0%" stopColor={color ?? primary} />
          <Stop offset="100%" stopColor={color2 ?? color ?? secondary} />
        </LinearGradient>
      </Defs>
      <Path
        fill={gradientFill}
        clipRule={'evenodd'}
        fillRule={'evenodd'}
        d="M11.7856 3.03434L9.60567 3.76412C9.34375 3.85181 9.06033 3.71062 8.97262 3.44877C8.88491 3.18691 9.02614 2.90356 9.28806 2.81588L11.4693 2.08566C11.812 1.97145 12.188 1.97145 12.5307 2.08566L12.5318 2.08603L20.9144 4.90119C21.5485 5.11486 22 5.69552 22 6.375V17.625C22 18.3045 21.5485 18.8851 20.9144 19.0988L12.5307 21.9143C12.188 22.0286 11.812 22.0286 11.4693 21.9143L3.0858 19.0939C2.45176 18.8802 2 18.2995 2 17.62V6.37C2 5.69052 2.45152 5.10986 3.08556 4.89619L6.62684 3.70606C6.88865 3.61807 7.17224 3.75893 7.26025 4.02068C7.34826 4.28243 7.20737 4.56595 6.94555 4.65394L3.69916 5.74497L9.2487 7.6087L11.7856 8.46067L11.7861 8.46083C11.9232 8.5064 12.0768 8.5064 12.2139 8.46084L12.2144 8.46067L18.705 6.28103C18.9668 6.19311 19.2504 6.33403 19.3383 6.5958C19.4263 6.85757 19.2853 7.14106 19.0235 7.22898L12.5318 9.40898L12.5308 9.40935C12.188 9.52356 11.812 9.52356 11.4693 9.40935L11.4682 9.40898L8.75552 8.49798L3.08606 6.59398C3.05579 6.58381 3.02713 6.57103 3.00025 6.55597V17.62C3.00025 17.8405 3.14879 18.0597 3.40482 18.1461L11.5024 20.8704V11.06C11.5024 10.7839 11.7263 10.56 12.0025 10.56C12.2787 10.56 12.5026 10.7839 12.5026 11.06V20.8689L20.5949 18.1512C20.8511 18.0649 20.9998 17.8455 20.9998 17.625V6.375C20.9998 6.15453 20.8512 5.93524 20.5951 5.84887L12.2144 3.03434L12.214 3.03418C12.0768 2.98858 11.9227 2.9887 11.7856 3.03434Z"
      />
    </AccessibleSvg>
  )
}

export const Thing = styled(ThingSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.standard,
}))``
