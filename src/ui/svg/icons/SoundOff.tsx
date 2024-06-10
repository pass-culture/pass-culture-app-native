import * as React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'

import { AccessibleIcon } from './types'

function SoundOffSvg({
  size,
  color,
  accessibilityLabel,
  testID,
}: AccessibleIcon): React.JSX.Element {
  return (
    <AccessibleSvg
      width={size}
      height={size}
      testID={testID}
      fill={color}
      accessibilityLabel={accessibilityLabel}
      viewBox="0 0 80 80">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M25.56,52.66c.55.33.72,1.05.38,1.6-.33.55-1.05.72-1.59.39l-3.68-2.03h-10.8c-1.62,0-3.08-.66-4.15-1.74l-.07-.07c-1.03-1.07-1.66-2.52-1.66-4.1v-14.09c0-1.62.66-3.1,1.73-4.17,1.06-1.07,2.53-1.74,4.15-1.74h10.8l24.73-15.16c.55-.33,1.26-.16,1.59.39.11.19.17.4.17.61v54.24c0,.65-.52,1.17-1.16,1.17-.25,0-.48-.08-.67-.22l-13.7-8.4c-.55-.33-.72-1.05-.38-1.6.33-.55,1.05-.72,1.59-.39l12,7.36V14.61l-23.18,14.2c-.19.14-.42.22-.67.22h-5.55v21.24h5.55c.21,0,.41.06.6.17l3.97,2.21h0ZM13.12,29.04h-3.25c-.97,0-1.86.4-2.5,1.05-.64.65-1.04,1.54-1.04,2.52v14.09c0,.96.38,1.83.99,2.47l.05.05c.64.65,1.53,1.05,2.51,1.05h3.25v-21.24h0Z"
      />
      <Path d="M66.08,40.5l9.6-9.6c.43-.43.43-1.14,0-1.58-.44-.44-1.14-.43-1.58,0l-9.6,9.6-9.6-9.6c-.44-.44-1.14-.43-1.58,0-.43.43-.43,1.14,0,1.58l9.6,9.6-9.6,9.6c-.43.43-.43,1.14,0,1.58.42.42,1.16.42,1.58,0l9.6-9.6,9.6,9.6c.21.21.49.33.79.33s.58-.12.79-.33c.43-.43.43-1.14,0-1.58l-9.6-9.6Z" />
    </AccessibleSvg>
  )
}

export const SoundOff = styled(SoundOffSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.standard,
}))``
