import { env } from 'libs/environment/env'
import { buildCategoryIllustrationUrl } from 'shared/illustrations/buildCategoryIllustrationUrl'

describe('buildCategoryIllustrationUrl', () => {
  it('builds a category illustration URL from a complete filename', () => {
    expect(buildCategoryIllustrationUrl('book%403x.png')).toBe(
      `${env.ILLUSTRATIONS_BASE_URL}/book%403x.png`
    )
  })
})
