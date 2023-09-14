import { CreditStatus } from 'features/tutorial/enums'
import { getTagColor } from 'features/tutorial/helpers/getTagColor'
import { theme } from 'theme'

describe('getTagColor', () => {
  it('should return white for GONE status', () => {
    expect(getTagColor(theme, CreditStatus.GONE)).toEqual(theme.colors.white)
  })
  it('should return green for ONGOING status', () => {
    expect(getTagColor(theme, CreditStatus.ONGOING)).toEqual(theme.colors.greenValid)
  })
  it('should return secondary for COMING status', () => {
    expect(getTagColor(theme, CreditStatus.COMING)).toEqual(theme.colors.secondary)
  })
})
