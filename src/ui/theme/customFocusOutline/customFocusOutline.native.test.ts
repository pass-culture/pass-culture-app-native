import { DefaultTheme } from 'styled-components/native'

import { theme } from 'theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'

describe('customFocusOutline', () => {
  it('should return an empty object when is native', () => {
    const result = customFocusOutline({ theme: theme as DefaultTheme })

    expect(result).toMatchObject({})
  })
})
