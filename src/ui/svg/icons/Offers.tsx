import React from 'react'
import Svg, { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { IconInterface } from 'ui/svg/icons/types'

function OffersSvg({ size, testID, color }: IconInterface) {
  return (
    <Svg width={size} height={size} testID={testID} viewBox="0 0 48 48" fill="none" aria-hidden>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.8245 8.5C19.8245 7.3989 20.7198 6.5 21.8461 6.5H39.9778C41.1041 6.5 41.9995 7.3989 41.9995 8.5V11.09C41.9995 11.6423 42.4473 12.09 42.9997 12.09C43.5522 12.09 44 11.6423 44 11.09V8.5C44 6.2811 42.1957 4.5 39.9778 4.5H21.8461C19.6282 4.5 17.8239 6.2811 17.8239 8.5V40.5C17.8239 42.7189 19.6282 44.5 21.8461 44.5H39.9778C42.1957 44.5 44 42.7189 44 40.5V18.09C44 17.5377 43.5522 17.09 42.9997 17.09C42.4473 17.09 41.9995 17.5377 41.9995 18.09V40.5C41.9995 41.6011 41.1041 42.5 39.9778 42.5H21.8461C20.7198 42.5 19.8245 41.6011 19.8245 40.5V8.5ZM13.9101 8.95737C14.4445 8.81745 14.7643 8.27091 14.6243 7.73664C14.4844 7.20238 13.9377 6.8827 13.4033 7.02261L6.98723 8.70248C4.83922 9.26258 3.56074 11.4637 4.13908 13.6012L11.8751 42.2407C12.0191 42.7739 12.5682 43.0894 13.1016 42.9454C13.6349 42.8014 13.9505 42.2525 13.8065 41.7193L6.07014 13.0787C5.7826 12.0166 6.41755 10.9178 7.49242 10.6377L13.9101 8.95737Z"
        fill={color}
      />
    </Svg>
  )
}

export const Offers = styled(OffersSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.standard,
}))``
