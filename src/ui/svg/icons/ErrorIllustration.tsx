import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { IconInterface } from 'ui/svg/icons/types'

const ErrorIllustrationSvg: React.FunctionComponent<IconInterface> = ({ size, color, testID }) => {
  const height = typeof size === 'string' ? size : ((size as number) * 156) / 200
  return (
    <Svg width={size} height={height} viewBox="0 0 200 156" testID={testID} aria-hidden>
      <Path
        fill={color}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M100 23.9091C70.121 23.9091 45.9091 48.121 45.9091 78C45.9091 107.879 70.121 132.091 100 132.091C129.879 132.091 154.091 107.879 154.091 78C154.091 68.6732 151.722 59.8934 147.55 52.2192C146.836 50.9069 147.322 49.2648 148.634 48.5514C149.946 47.838 151.589 48.3235 152.302 49.6358C156.893 58.0807 159.5 67.7459 159.5 78C159.5 110.866 132.866 137.5 100 137.5C67.1336 137.5 40.5 110.866 40.5 78C40.5 45.1336 67.1336 18.5 100 18.5C110.109 18.5 119.662 21.0209 128.001 25.5025C129.317 26.2095 129.81 27.8493 129.103 29.1651C128.396 30.4808 126.756 30.9742 125.441 30.2671C117.877 26.2023 109.202 23.9091 100 23.9091ZM96.4583 102.792C96.4583 100.836 98.044 99.25 100 99.25C101.956 99.25 103.542 100.836 103.542 102.792C103.542 104.748 101.956 106.333 100 106.333C98.044 106.333 96.4583 104.748 96.4583 102.792ZM102.833 52.3619C102.833 50.8733 101.565 49.6667 100 49.6667C98.4352 49.6667 97.1667 50.8733 97.1667 52.3619V86.6381C97.1667 88.1266 98.4352 89.3333 100 89.3333C101.565 89.3333 102.833 88.1266 102.833 86.6381V52.3619Z"
      />
    </Svg>
  )
}

export const ErrorIllustration = styled(ErrorIllustrationSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.illustrations.sizes.medium,
}))``
