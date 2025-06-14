import React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

const AgainSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  accessibilityLabel,
  testID,
}) => (
  <AccessibleSvg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    accessibilityLabel={accessibilityLabel}
    testID={testID}>
    <Path
      fill={color}
      clipRule="evenodd"
      fillRule="evenodd"
      d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44ZM30.9462 13.7689C31.3182 14.8089 30.7765 15.9536 29.7365 16.3255L28.6621 16.7097C29.7851 17.3026 30.7813 18.1025 31.599 19.0576C33.0947 20.8046 34 23.0783 34 25.5582C34 31.0811 29.5228 35.5582 24 35.5582C18.4772 35.5582 14 31.0811 14 25.5582C14 24.3352 14.2205 23.1591 14.6256 22.0705C15.0109 21.0353 16.1624 20.5085 17.1976 20.8937C18.2328 21.279 18.7597 22.4305 18.3744 23.4657C18.1329 24.1146 18 24.8186 18 25.5582C18 28.872 20.6863 31.5582 24 31.5582C27.3137 31.5582 30 28.872 30 25.5582C30 24.0678 29.4591 22.7087 28.5604 21.6589C28.022 21.0301 27.3577 20.5148 26.6067 20.152L27.4486 21.9012C27.9277 22.8965 27.5092 24.0917 26.5139 24.5707C25.5187 25.0498 24.3235 24.6313 23.8444 23.636L20.9269 17.5748C20.681 17.064 20.6635 16.4727 20.8787 15.9482C21.094 15.4237 21.5217 15.0151 22.0556 14.8242L28.3896 12.5591C29.4296 12.1872 30.5743 12.7288 30.9462 13.7689Z"
    />
  </AccessibleSvg>
)

export const Again = styled(AgainSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.designSystem.color.icon.default,
  size: size ?? theme.icons.sizes.smaller,
}))``
