import * as React from 'react'
import Svg, { Path, G, Defs, LinearGradient, Stop } from 'react-native-svg'
import { v1 as uuidv1 } from 'uuid'

import { ColorsEnum } from 'ui/theme'

import { BicolorIconInterface } from './types'

const NotMemoizedBicolorLock: React.FC<BicolorIconInterface> = ({
  size = 32,
  color,
  color2,
  testID,
}) => {
  const LINEAR_GRADIENT_ID = uuidv1()
  return (
    <Svg width={size} height={size} viewBox="0 0 37 36" testID={testID}>
      <Defs>
        <LinearGradient id={LINEAR_GRADIENT_ID} x1="16.056%" x2="83.944%" y1="0%" y2="100%">
          <Stop offset="0%" stopColor={color ?? ColorsEnum.PRIMARY} />
          <Stop offset="100%" stopColor={color2 ?? ColorsEnum.SECONDARY} />
        </LinearGradient>
      </Defs>
      <G fill="none" fillRule="evenodd">
        <G fill={`url(#${LINEAR_GRADIENT_ID})`} transform="translate(-22.000000, -433.000000)">
          <G>
            <Path
              d="M18.552 7.5c2.427 0 4.621 1.32 5.771 3.402.49.885.767 1.875.807 2.903l.005.257v1.688h.188c1.087 0 1.996.784 2.065 1.799l.004.123v9.282c0 1.073-.939 1.921-2.069 1.921-.312 0-.564-.252-.564-.562 0-.285.212-.52.488-.558l.076-.005c.495 0 .885-.322.935-.712l.005-.084v-9.282c0-.398-.357-.747-.836-.792l-.104-.005H11.848c-.495 0-.885.322-.934.712l-.006.085v9.282c0 .398.357.747.836.791l.104.005h9.705c.311 0 .564.252.564.563 0 .284-.212.52-.488.557l-.076.005h-9.705c-1.087 0-1.996-.784-2.064-1.799l-.004-.122v-9.282c0-1.033.867-1.856 1.939-1.918l.13-.004h.12l.001-1.688c0-3.624 2.947-6.562 6.582-6.562zm0 12.75c1.143 0 2.07.924 2.07 2.063 0 1.138-.927 2.062-2.07 2.062-1.142 0-2.068-.924-2.068-2.062 0-1.14.926-2.063 2.068-2.063zm0 1.125c-.518 0-.94.42-.94.938 0 .517.422.937.94.937.52 0 .94-.42.94-.937 0-.518-.42-.938-.94-.938zm0-12.75c-2.951 0-5.356 2.338-5.45 5.258l-.003.18-.001 1.687h10.908v-1.688c0-.929-.233-1.824-.671-2.617-.954-1.726-2.772-2.82-4.783-2.82z"
              transform="translate(22.000000, 422.000000) translate(0.000000, 11.000000)"
            />
          </G>
        </G>
      </G>
    </Svg>
  )
}

export const BicolorLock = React.memo(NotMemoizedBicolorLock)
