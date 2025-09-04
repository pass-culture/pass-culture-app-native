import { DefaultTheme } from 'styled-components/native'

import { theme } from 'theme'
import { touchableFocusOutline } from 'ui/theme/customFocusOutline/touchableFocusOutline'

describe('touchableFocusOutline', () => {
  it('should return an empty object when is native', () => {
    const result = touchableFocusOutline({ theme: theme as DefaultTheme })

    expect(result).toMatchObject({})
  })
})
