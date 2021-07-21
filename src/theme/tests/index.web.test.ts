import { theme } from 'theme'

describe('theme', () => {
  it('should have a theme variable for black color', () => {
    expect(theme.colors.black).toBeDefined()
  })
})
