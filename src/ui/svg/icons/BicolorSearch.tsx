import * as React from 'react'
import Svg, { Defs, LinearGradient, Stop, G, Path } from 'react-native-svg'

import { ColorsEnum } from 'ui/theme'

import { BicolorIconInterface } from './types'

export const BicolorSearch: React.FC<BicolorIconInterface> = ({
  size = 32,
  color,
  color2,
  thin = false,
  testID,
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 44 44" testID={testID}>
      <Defs>
        <LinearGradient id="prefix__a" x1="-42.969%" x2="153.672%" y1="52.422%" y2="52.422%">
          <Stop offset="0%" stopColor={color ?? ColorsEnum.PRIMARY} />
          <Stop offset="100%" stopColor={color2 ?? color ?? ColorsEnum.SECONDARY} />
        </LinearGradient>
      </Defs>
      <G fill="none" fillRule="evenodd">
        <Path d="M0 0h44v44H0z" />
        <Path
          d="M26.89 25.929l.077.066 8.123 8.123c.269.268.269.704 0 .972-.244.244-.626.266-.895.067l-.077-.067-8.123-8.123c-.268-.268-.268-.703 0-.972.244-.244.626-.266.895-.066zm-8.403-15.846c4.642 0 8.405 3.763 8.405 8.404 0 4.642-3.763 8.405-8.405 8.405-4.64 0-8.404-3.763-8.404-8.405 0-4.64 3.763-8.404 8.404-8.404zm0 1.375c-3.882 0-7.029 3.147-7.029 7.03 0 3.881 3.148 7.03 7.03 7.03 3.881 0 7.03-3.149 7.03-7.03 0-3.882-3.149-7.03-7.03-7.03zm-1.72 2.675c.19.328.078.749-.25.939-1.21.7-1.972 1.992-1.972 3.415 0 .38-.308.688-.688.688-.38 0-.687-.308-.687-.688 0-1.92 1.027-3.662 2.658-4.605.328-.19.749-.078.94.25z"
          fill="url(#prefix__a)"
          stroke="url(#prefix__a)"
          transform="translate(-676 -629) translate(583 619) translate(93.75 10)"
          strokeWidth={thin ? 0 : 0.5}
        />
      </G>
    </Svg>
  )
}
