import * as React from 'react'
import { Defs, LinearGradient, Path, Stop } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { svgIdentifier } from 'ui/svg/utils'

import { AccessibleIcon } from './types'

const BicolorInfoSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  color2,
  accessibilityLabel,
  testID,
}) => {
  const { id: gradientId, fill: gradientFill } = svgIdentifier()
  return (
    <AccessibleSvg
      width={size}
      height={size}
      viewBox="0 0 136 136"
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      fill={gradientFill}>
      <Defs>
        <LinearGradient id={gradientId} x1="28.841%" x2="71.159%" y1="0%" y2="100%">
          <Stop offset="0%" stopColor={color} />
          <Stop offset="100%" stopColor={color2} />
        </LinearGradient>
      </Defs>
      <Path
        fill={gradientFill}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M68 13.9091C38.121 13.9091 13.9091 38.121 13.9091 68C13.9091 97.879 38.121 122.091 68 122.091C97.879 122.091 122.091 97.879 122.091 68C122.091 58.6732 119.722 49.8934 115.55 42.2192C114.836 40.9069 115.322 39.2648 116.634 38.5514C117.946 37.838 119.589 38.3235 120.302 39.6358C124.893 48.0807 127.5 57.7459 127.5 68C127.5 100.866 100.866 127.5 68 127.5C35.1336 127.5 8.5 100.866 8.5 68C8.5 35.1336 35.1336 8.5 68 8.5C78.1087 8.5 87.6621 11.0209 96.0012 15.5025C97.3169 16.2095 97.8103 17.8493 97.1032 19.1651C96.3961 20.4808 94.7563 20.9742 93.4406 20.2671C85.877 16.2023 77.2018 13.9091 68 13.9091ZM64.4583 92.7917C64.4583 90.8357 66.044 89.25 68 89.25C69.956 89.25 71.5417 90.8357 71.5417 92.7917C71.5417 94.7477 69.956 96.3333 68 96.3333C66.044 96.3333 64.4583 94.7477 64.4583 92.7917ZM70.8333 42.3619C70.8333 40.8733 69.5648 39.6667 68 39.6667C66.4352 39.6667 65.1667 40.8733 65.1667 42.3619V76.6381C65.1667 78.1266 66.4352 79.3333 68 79.3333C69.5648 79.3333 70.8333 78.1266 70.8333 76.6381V42.3619Z"
      />
    </AccessibleSvg>
  )
}

export const BicolorInfo = styled(BicolorInfoSvg).attrs(({ color, color2, size, theme }) => ({
  color: color ?? theme.colors.primary,
  color2: color2 ?? theme.colors.secondary,
  size: size ?? theme.icons.sizes.standard,
}))``
