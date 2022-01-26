# Using SVG icons on the application

## The different kinds of icons

- Illustrations (rectangular frame)
- Pictograms (square frame)

### Illustrations

Illustrations are meant to be used in Generic info pages and modals. They have a ratio of 200x156 and thus cannot be replaced by pictograms in generic components: the render would differ.

### Pictograms

Pictograms can be linear or filled.

- Linear pictograms have to be used at size 20px or bigger for Accessibility reasons. Typical use cases include Primary and Secondary buttons.
- Filled pictograms have to be used at size 20 px or smaller. Typical use cases include Tertiary and Quaternary buttons.

# Importing new icons

All types of icons should be imported the same way to enforce consistency in use throughout the codebase. Follow the given templates (or existing icons) to import your icons correctly.

## Illustrations

Illustrations should be imported with a fixed ratio of 156/200, a black color, and the `ILLUSTRATION_ICON_SIZE` as follows:

```jsx
import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

import { IconInterface } from 'ui/svg/icons/types'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'
import { ILLUSTRATION_ICON_SIZE } from 'ui/theme/constants'

export const MyIllustration: React.FunctionComponent<IconInterface> = ({
  size = ILLUSTRATION_ICON_SIZE,
  color = ColorsEnum.BLACK,
  testID,
}) => {
  const height = typeof size === 'string' ? size : (size * 156) / 200
  return (
    <Svg width={size} height={height} viewBox="0 0 200 156" testID={testID} aria-hidden>
      <Path
        fill={color}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M100 18C133.137 18 160 44.8629 160 78C160 91.3909 155.5114.525C146.542 115.12 70C112 67.792 113.787 66 116 66Z"
      />
    </Svg>
  )
}
```

## Accessible icons

Accessible SVGs are the ones that indicate an action that can be performed. They should be wrapped in the `AccessibleSvg` component as follows.

```jsx
import * as React from 'react'
import { Path } from 'react-native-svg'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'
import { STANDARD_ICON_SIZE } from 'ui/theme/constants'

export const MyAccessiblePictogram: React.FunctionComponent<AccessibleIcon> = ({
  size = STANDARD_ICON_SIZE,
  color = ColorsEnum.BLACK,
  testID,
  accessibilityLabel,
}) => (
  <AccessibleSvg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    testID={testID}
    accessibilityLabel={accessibilityLabel ?? 'what my icon does'}>
    <Path fill={color} d="M37 44.15.4263 33.0687 14.5 31.9198 14.5H24.7191Z" />
  </AccessibleSvg>
)
```

Icons that are not meant to be accessible should come with the `aria-hidden` prop, as written in all the following examples.

## Linear pictograms

Regular linear pictograms should be imported as follows:

```jsx
import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'
import { STANDARD_ICON_SIZE } from 'ui/theme/constants'

import { IconInterface } from './types'

export const MyRegularPictogram: React.FunctionComponent<IconInterface> = ({
  size = STANDARD_ICON_SIZE,
  color = ColorsEnum.BLACK,
  testID,
}) => (
  <Svg width={size} height={size} viewBox="0 0 48 48" testID={testID} aria-hidden>
    <Path
      fill={color}
      d="M24 5.4059 23 15.4512V27.5488C23 28.0741 23.4477 28.5 28.0741 25 27.5488V15.4512Z"
    />
  </Svg>
)
```

Filled (tertiary and quaternary) pictograms should be imported with a default size of `SMALLER_ICON_SIZE`.

## Bicolor pictograms

```jsx
import * as React from 'react'
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg'

import { svgIdentifier } from 'ui/svg/utils'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'
import { STANDARD_ICON_SIZE } from 'ui/theme/constants'

import { IconInterface } from './types'

const NotMemoizedMyBicolorPictogram: React.FunctionComponent<IconInterface> = ({
  size = STANDARD_ICON_SIZE,
  color = ColorsEnum.PRIMARY,
  color2 = ColorsEnum.SECONDARY,
  testID,
}) => {
  const { id: gradientId, fill: gradientFill } = svgIdentifier()

  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" testID={testID} aria-hidden>
      <Defs>
        <LinearGradient id={gradientId} x1="28.841%" x2="71.159%" y1="0%" y2="100%">
          <Stop offset="0%" stopColor={color} />
          <Stop offset="100%" stopColor={color2} />
        </LinearGradient>
      </Defs>
      <Path
        fill={gradientFill}
        clipRule={'evenodd'}
        fillRule={'evenodd'}
        d="M24 6.5C22.8923 6.5 22 74 38 29.74H34ZM35 35.5V31.74H37V35.5H35Z"
      />
    </Svg>
  )
}

export const MyBicolorPictogram = React.memo(NotMemoizedMyBicolorPictogram)
```
