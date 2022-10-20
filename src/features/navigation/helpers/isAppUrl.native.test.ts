import { isAppUrl } from './isAppUrl'

jest.mock('features/navigation/navigationRef')
jest.mock('features/navigation/RootNavigator/linking')

describe('isAppUrl', () => {
  it('should return false if url does not start with linking prefixes', () => {
    const url = isAppUrl('https://notavalidprefix')
    expect(url).toEqual(false)
  })
  it('should return true if url starts with linking prefixes', () => {
    const url = isAppUrl('https://mockValidPrefix1')
    expect(url).toEqual(true)
  })
})
