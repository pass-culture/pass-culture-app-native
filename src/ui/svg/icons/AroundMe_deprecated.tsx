import * as React from 'react'
import Svg, { Defs, LinearGradient, Stop, Path, G } from 'react-native-svg'
import { v1 as uuidv1 } from 'uuid'

import { ColorsEnum } from 'ui/theme'

import { BicolorIconInterface } from './types'

export const AroundMeDeprecated: React.FunctionComponent<BicolorIconInterface> = ({
  size = 32,
  color = ColorsEnum.PRIMARY,
  color2 = ColorsEnum.SECONDARY,
  testID,
}) => {
  const LINEAR_GRADIENT_1_ID = uuidv1()
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" testID={testID}>
      <Defs>
        <LinearGradient id={LINEAR_GRADIENT_1_ID} x1=".001%" x2="99.999%" y1="0%" y2="100%">
          <Stop offset="0%" stopColor={color} />
          <Stop offset="100%" stopColor={color2} />
        </LinearGradient>
      </Defs>
      <G fill="none" fillRule="evenodd">
        <G fill={`url(#${LINEAR_GRADIENT_1_ID})`} transform="translate(-89 -396)">
          <Path
            d="M27.902 10.588c.264.222.299.616.077.88-.222.265-.616.3-.88.077-3.967-3.328-9.713-3.454-13.82-.302-4.108 3.152-5.474 8.735-3.286 13.427 2.189 4.693 7.344 7.234 12.399 6.113 5.055-1.122 8.651-5.605 8.65-10.783 0-.345.28-.625.624-.625.346 0 .626.28.626.625.001 5.764-4.002 10.754-9.63 12.003-5.626 1.249-11.365-1.58-13.802-6.804-2.436-5.224-.915-11.439 3.657-14.947 4.573-3.51 10.97-3.37 15.385.336zm-1.84 4.006c2.658 2.977 2.76 7.443.242 10.539-2.518 3.095-6.911 3.904-10.367 1.908-.299-.172-.4-.555-.228-.854.172-.299.555-.4.854-.228 2.923 1.689 6.641 1.004 8.772-1.615 2.13-2.62 2.043-6.399-.205-8.917-2.25-2.519-5.994-3.032-8.837-1.21-2.844 1.821-3.943 5.438-2.595 8.533.138.317-.007.685-.323.823-.317.138-.685-.007-.823-.323-1.593-3.66-.294-7.933 3.066-10.086 3.36-2.153 7.786-1.546 10.444 1.43zM20 16.042c.345 0 .625.28.625.625s-.28.625-.625.625c-1.496 0-2.708 1.212-2.708 2.708 0 1.496 1.212 2.708 2.708 2.708 1.496 0 2.708-1.212 2.708-2.708 0-.345.28-.625.625-.625.346 0 .625.28.625.625 0 2.186-1.772 3.958-3.958 3.958S16.042 22.186 16.042 20s1.772-3.958 3.958-3.958zm0 3.125c.46 0 .833.373.833.833 0 .46-.373.833-.833.833-.46 0-.833-.373-.833-.833 0-.46.373-.833.833-.833z"
            transform="translate(89 396)"
          />
        </G>
      </G>
    </Svg>
  )
}
