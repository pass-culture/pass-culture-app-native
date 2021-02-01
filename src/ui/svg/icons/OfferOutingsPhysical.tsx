import React from 'react'
import Svg, { Path, G } from 'react-native-svg'

import { IconInterface } from 'ui/svg/icons/types'
import { ColorsEnum } from 'ui/theme/colors'

export function OfferOutingsPhysical({
  size = 32,
  testID,
  color = ColorsEnum.BLACK,
}: IconInterface) {
  return (
    <Svg width={size} height={size} testID={testID} viewBox="0 0 32 33">
      <G fill="none" fillRule="evenodd">
        <G fill={color}>
          <G>
            <Path
              d="M22.836 8c1.012 0 1.833.82 1.833 1.833V22.27c0 1.156-.832 2.12-1.9 2.12h-8.392c-1.067 0-1.9-.964-1.9-2.12V10.12c0-1.155.833-2.119 1.9-2.119zm0 1h-8.46c-.479 0-.899.486-.899 1.12v12.15c0 .633.42 1.12.9 1.12h8.393c.48 0 .9-.487.9-1.12V9.832c0-.46-.374-.833-.834-.833zm-11.327.145c.063.245-.067.495-.295.587l-.065.022-1.45.372c-.456.117-.757.598-.69 1.103l.017.095 2.407 10.652c.06.27-.108.537-.377.598-.247.056-.493-.082-.579-.313l-.02-.065-2.406-10.652c-.229-1.017.336-2.046 1.288-2.355l.111-.032 1.45-.372c.268-.069.54.093.609.36z"
              transform="translate(-194 -238) translate(194.5 238)"
            />
          </G>
        </G>
      </G>
    </Svg>
  )
}
