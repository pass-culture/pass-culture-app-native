// eslint-disable-next-line no-restricted-imports
import { isSafari, browserVersion } from 'react-device-detect'

import { theme } from 'theme'
import { Argument } from 'ui/theme/customFocusOutline/type'

/*
 * The ':focus-visible' pseudo-class support starting with Safari 15.4 (https://caniuse.com/css-focus-visible)
 * The WICG ':focus-visible' polyfill (https://github.com/WICG/focus-visible) doesn't work.
 * If we add ':focus-visible', versions of Safari < 15.4 will not have button focus.
 */
const focus = isSafari && Number(browserVersion) < 15.4 ? '&:focus' : '&:focus-visible'

export function customFocusOutline({ color, width, isFocus, noOffset = false }: Argument) {
  const outlineRules = {
    outlineColor: color ?? theme.outline.color,
    outlineWidth: width ?? theme.outline.width,
    outlineStyle: theme.outline.style,
    outlineOffset: noOffset ? 0 : theme.outline.offSet,
  }

  return isFocus
    ? outlineRules
    : {
        [focus]: outlineRules,
        ['&:active']: { outline: 'none', opacity: theme.activeOpacity },
      }
}
