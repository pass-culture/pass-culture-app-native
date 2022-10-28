import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'

describe('customFocusOutline', () => {
  it('should return an empty object when is native', () => {
    const result = customFocusOutline({})
    expect(result).toMatchObject({})
  })
})
