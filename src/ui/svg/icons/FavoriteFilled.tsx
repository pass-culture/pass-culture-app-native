import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { IconInterface } from './types'

const FavoriteFilledSvg: React.FunctionComponent<IconInterface> = ({
  size,
  color,
  testID,
}: IconInterface) => (
  <Svg width={size} height={size} viewBox="0 0 48 49" testID={testID} aria-hidden>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      fill={color}
      d="M46 19.5215C46 13.4385 41.0762 8.5 35 8.5C28.9238 8.5 24 13.4385 24 19.5215C24 13.4385 19.0762 8.5 13 8.5C6.92381 8.5 2 13.4385 2 19.5215C2 30.7549 14.5714 41.3525 23.9267 44.5C33.4976 41.3411 46 30.7954 46 19.5215ZM11.4296 16.0182C11.8944 15.7199 12.0292 15.1012 11.7309 14.6365C11.4325 14.1717 10.8138 14.0369 10.3491 14.3353C8.37228 15.6045 6.91921 17.6282 6.41156 19.9972C6.29585 20.5373 6.63981 21.0688 7.17984 21.1846C7.71986 21.3003 8.25145 20.9563 8.36717 20.4163C8.75953 18.5853 9.88645 17.009 11.4296 16.0182Z"
    />
  </Svg>
)

export const FavoriteFilled = styled(FavoriteFilledSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.standard,
}))``
