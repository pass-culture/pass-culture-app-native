import { env } from 'libs/environment/env'
import { buildContentfulIllustrationUrl } from 'shared/illustrations/buildContentfulIllustrationUrl'

describe('buildContentfulIllustrationUrl', () => {
  it('builds an illustration URL from a Contentful illustration name', () => {
    expect(buildContentfulIllustrationUrl('museum')).toBe(
      `${env.ILLUSTRATIONS_BASE_URL}/museum.png`
    )
  })
})
