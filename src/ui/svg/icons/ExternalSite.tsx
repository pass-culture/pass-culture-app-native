import * as React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'
const ExternalSiteSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  testID,
  accessibilityLabel,
}) => (
  <AccessibleSvg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    testID={testID}
    accessibilityLabel={accessibilityLabel ?? 'Nouvelle fenêtre'}>
    <Path
      fill={color}
      d="M37 44.5C40.866 44.5 44 41.366 44 37.5L44 11.5C44 7.63401 40.866 4.5 37 4.5L11 4.5C7.13401 4.5 4 7.63401 4 11.5L4 24.5C4 25.0523 4.44772 25.5 5 25.5C5.55229 25.5 6 25.0523 6 24.5L6 11.5C6 8.73858 8.23857 6.5 11 6.5L37 6.5C39.7614 6.5 42 8.73857 42 11.5L42 37.5C42 40.2614 39.7614 42.5 37 42.5L11 42.5C9.6292 42.5 8.38889 41.9497 7.48465 41.0556C6.56684 40.1481 6 38.8912 6 37.5C6 36.9477 5.55229 36.5 5 36.5C4.44772 36.5 4 36.9477 4 37.5C4 39.4471 4.79627 41.21 6.07844 42.4778C7.34185 43.727 9.08163 44.5 11 44.5L37 44.5ZM24.7191 14.5C24.1447 14.5 23.679 14.9632 23.679 15.5345C23.679 16.1059 24.1447 16.569 24.7191 16.569H30.5562L14.3046 32.734C13.8984 33.138 13.8984 33.793 14.3046 34.197C14.7107 34.601 15.3693 34.601 15.7754 34.197L31.9198 18.1387V23.3511C31.9198 23.9224 32.3855 24.3856 32.9599 24.3856C33.5343 24.3856 33.9999 23.9224 33.9999 23.3511V16.569C33.9999 15.4263 33.0687 14.5 31.9198 14.5H24.7191Z"
    />
  </AccessibleSvg>
)

export const ExternalSite = styled(ExternalSiteSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.standard,
}))``
