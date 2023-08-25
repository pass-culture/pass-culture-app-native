# Using SVG icons on the application

## The different kinds of icons

- Illustrations (rectangular frame)
- Pictograms (square frame)

## svg VS react-native-svg

:warning: SVG attributes use hyphen (e.g. `fill-rule` and `clip-rule`) while react-native-svg use camelCase props. 

Since react-native-svg use camelCase props, use `fillRule` and `clipRule`. 

> TypeScript will not throw if you use `fill-rule` and `clip-rule`, although it will fail at compilation and throw warnings on the Web. 

### Illustrations

Illustrations are meant to be used in Generic info pages and modals. They have a ratio of 200x156 and thus cannot be replaced by pictograms in generic components: the render would differ.

### Pictograms

Pictograms can be linear or filled.

- Linear pictograms have to be used at size 20px or bigger for Accessibility reasons. Typical use cases include Primary and Secondary buttons.
- Filled pictograms have to be used at size 20 px or smaller. Typical use cases include Tertiary and Quaternary buttons.

If you don't download icons from the [Fondations file](https://www.figma.com/file/jswn3bl2Sy7hm4XDyOLWE9/Fondations), make sure to use the viewbox values from your import, rather than the default "48 48 0 0" used in Fondations. The Path and the ViewBox are related to maintain a consistent ratio.


# Importing new icons

All types of icons should be imported the same way to enforce consistency in use throughout the codebase. Follow the given templates (or existing icons) to import your icons correctly.

## Illustrations

Illustrations should be imported with a fixed ratio of 156/200, a black color, and the standard icon size as follows:

```jsx
import React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'

const MyIllustrationSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  accessibilityLabel,
  testID,
}) => {
  const height = typeof size === 'string' ? size : ((size as number) * 156) / 200
  return (
    <AccessibleSvg width={size} height={height} viewBox="0 0 200 156" accessibilityLabel={accessibilityLabel} testID={testID}>
      <Path
        fill={color}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M100 18C133.137 18 160 44.8629 160 78C160 91.3909 155.5114.525C146.542 115.12 70C112 67.792 113.787 66 116 66Z"
      />
    </AccessibleSvg>
  )
}

export const MyIllustration = styled(MyIllustrationSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.standard,
}))``
```

> Do not import constants to style your SVG, instead, use `theme` API from styled-components

## Linear pictograms

Regular linear pictograms should be imported as follows:

```jsx
import React from 'react'
import { Path } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'

const MyRegularPictogramSvg: React.FunctionComponent<AccessibleIcon> = ({
  size,
  color,
  accessibilityLabel,
  testID,
}) => (
  <AccessibleSvg width={size} height={size} viewBox="0 0 48 48" accessibilityLabel={accessibilityLabel} testID={testID}>
    <Path
      fill={color}
      d="M24 5.4059 23 15.4512V27.5488C23 28.0741 23.4477 28.5 28.0741 25 27.5488V15.4512Z"
    />
  </AccessibleSvg>
)

export const MyRegularPictogram = styled(MyRegularPictogramSvg).attrs(({ color, size, theme }) => ({
  color: color ?? theme.colors.black,
  size: size ?? theme.icons.sizes.standard
}))``
```

Filled (tertiary and quaternary) pictograms should be imported with a default size of `theme.icons.sizes.smaller`.

## Bicolor pictograms

The offset value of the Stop component should always be specified (for valid HTML) and should be in percentage for uniformity.

```jsx
import React from 'react'
import { Defs, LinearGradient, Path, Stop } from 'react-native-svg'
import styled from 'styled-components/native'

import { AccessibleSvg } from 'ui/svg/AccessibleSvg'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { svgIdentifier } from 'ui/svg/utils'

const MyBicolorPictogramSvg: React.FunctionComponent<IconInterface> = ({
  size,
  color,
  color2,
  accessibilityLabel,
  testID,
}) => {
  const { id: gradientId, fill: gradientFill } = svgIdentifier()

  return (
    <AccessibleSvg width={size} height={size} viewBox="0 0 48 48" accessibilityLabel={accessibilityLabel} testID={testID}>
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
        d="M24 6.5C22.8923 6.5 22 74 38 29.74H34ZM35 35.5V31.74H37V35.5H35Z" />
      </AccessibleSvg>
  )
}

export const MyBicolorPictogram = styled(MyBicolorPictogramSvg).attrs(({ color, color2, size, theme }) => ({
  color: color ?? theme.colors.primary,
  color2: color2 ?? theme.colors.secondary,
  size: size ?? theme.icons.sizes.standard
}))``

```

## Accessibility
By using `AccessibleSvg`, all the accessibility attributes are automatically handled, by hiding the element from screen readers if there is no accessibility label attached, and adding the correct accessibility role when there is one.