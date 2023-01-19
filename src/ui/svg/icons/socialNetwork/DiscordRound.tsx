import * as React from 'react'
import { Path, Defs, ClipPath, G } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { svgIdentifier } from 'ui/svg/utils'

const DiscordRoundSvg = ({ color: _color, size, accessibilityLabel, testID }: AccessibleIcon) => {
  const { id: clipPathId, fill: clipPathFill } = svgIdentifier()

  return (
    <AccessibleSvg
      width={size}
      height={size}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      viewBox="0 0 48 48">
      <G clipPath={clipPathFill}>
        <Path
          d="M24 48c13.255 0 24-10.745 24-24S37.255 0 24 0 0 10.745 0 24s10.745 24 24 24Z"
          fill="#5865F2"
        />
        <Path
          d="M33.705 14.823a22.594 22.594 0 0 0-5.7-1.821.084.084 0 0 0-.053.006.087.087 0 0 0-.04.038c-.26.488-.498.99-.71 1.503a20.69 20.69 0 0 0-6.402 0 15.41 15.41 0 0 0-.72-1.503.09.09 0 0 0-.092-.044 22.53 22.53 0 0 0-5.698 1.821.082.082 0 0 0-.038.034c-3.63 5.59-4.624 11.043-4.136 16.426a.102.102 0 0 0 .036.068 22.964 22.964 0 0 0 6.993 3.643.088.088 0 0 0 .098-.033 17.2 17.2 0 0 0 1.43-2.398.095.095 0 0 0 .004-.075.092.092 0 0 0-.052-.052 15.093 15.093 0 0 1-2.185-1.07.092.092 0 0 1-.044-.075.094.094 0 0 1 .035-.08c.147-.112.294-.23.434-.35a.085.085 0 0 1 .09-.012c4.583 2.156 9.545 2.156 14.073 0a.084.084 0 0 1 .092.011c.14.119.287.239.438.352a.093.093 0 0 1 .035.079.091.091 0 0 1-.043.075c-.699.42-1.43.777-2.188 1.07a.09.09 0 0 0-.052.053.093.093 0 0 0 .005.076c.418.834.896 1.635 1.429 2.397a.086.086 0 0 0 .098.034 22.888 22.888 0 0 0 7-3.643.09.09 0 0 0 .037-.067c.585-6.225-.977-11.633-4.14-16.427a.072.072 0 0 0-.034-.036ZM19.357 28.006c-1.38 0-2.516-1.306-2.516-2.91 0-1.602 1.115-2.908 2.516-2.908 1.413 0 2.539 1.317 2.516 2.909 0 1.603-1.114 2.909-2.516 2.909Zm9.305 0c-1.38 0-2.516-1.306-2.516-2.91 0-1.602 1.114-2.908 2.516-2.908 1.412 0 2.538 1.317 2.515 2.909.001 1.603-1.103 2.909-2.515 2.909Z"
          fill="#fff"
        />
      </G>
      <Defs>
        <ClipPath id={clipPathId}>
          <Path fill="#fff" d="M0 0h48v48H0z" />
        </ClipPath>
      </Defs>
    </AccessibleSvg>
  )
}

export const DiscordRound = styled(DiscordRoundSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.greyDark,
  size: size ?? theme.icons.sizes.standard,
}))``
