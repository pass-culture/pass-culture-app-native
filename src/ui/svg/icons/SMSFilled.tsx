import * as React from 'react'
import { Circle, Path } from 'react-native-svg'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'
import { SMALLER_ICON_SIZE } from 'ui/theme/constants'

export const SMSFilled: React.FunctionComponent<AccessibleIcon> = ({
  size = SMALLER_ICON_SIZE,
  color = ColorsEnum.BLACK,
  testID,
  accessibilityLabel,
}) => (
  <AccessibleSvg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    testID={testID}
    accessibilityLabel={accessibilityLabel ?? 'sms'}>
    <Path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M24 40.2371C34.4934 40.2371 43 33.2444 43 24.6186C43 15.9927 34.4934 9 24 9C13.5066 9 5 15.9927 5 24.6186C5 28.3843 6.62126 31.8388 9.32132 34.5361C9.02727 38.3967 7.26559 40.9014 6.0843 42.1706C5.80631 42.4693 6.06112 43.0485 6.46524 42.9922C9.18941 42.6126 14.9065 41.5307 16.5495 38.9906C18.8373 39.793 21.3555 40.2371 24 40.2371Z"
      fill={color}
    />
    <Circle cx="17.5" cy="25.5" r="2.5" fill="white" />
    <Circle cx="24.5" cy="25.5" r="2.5" fill="white" />
    <Circle cx="31.5" cy="25.5" r="2.5" fill="white" />
  </AccessibleSvg>
)
