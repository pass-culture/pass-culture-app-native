import * as React from 'react'
import { Path } from 'react-native-svg'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'
import { SMALLER_ICON_SIZE } from 'ui/theme/constants'

export const Duplicate: React.FunctionComponent<AccessibleIcon> = ({
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
    accessibilityLabel={accessibilityLabel ?? 'copier'}>
    <Path
      fill={color}
      d="M10.9484 35.9982H11.6613V13.8372C11.6613 11.3968 13.7483 9.41857 16.3226 9.41857H32.8164V8.8C32.8164 6.70132 31.0486 5 28.868 5H10.9484C8.76775 5 7 6.70132 7 8.8V32.1982C7 34.2969 8.76775 35.9982 10.9484 35.9982Z"
    />
    <Path
      fill={color}
      d="M18.6258 12.2381C16.5663 12.2381 14.8968 13.8121 14.8968 15.7537V39.4843C14.8968 41.426 16.5663 43 18.6258 43H37.271C39.3305 43 41 41.426 41 39.4843V15.7537C41 13.8121 39.3305 12.2381 37.271 12.2381H18.6258Z"
    />
  </AccessibleSvg>
)
