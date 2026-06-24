import { getCategoryHeaderBackgroundColor } from 'features/home/helpers/getCategoryColor'
import { Color } from 'features/home/types'
import { designTokensLight } from 'theme/designTokens'

describe('getCategoryHeaderBackgroundColor', () => {
  it.each`
    contentfulColor    | token
    ${'Positive01'}    | ${'positive01'}
    ${'Negative01'}    | ${'negative01'}
    ${'Pending01'}     | ${'pending01'}
    ${'Information01'} | ${'information01'}
    ${'Information04'} | ${'information04'}
  `('maps $contentfulColor to illustration.$token', ({ contentfulColor, token }) => {
    expect(
      getCategoryHeaderBackgroundColor(contentfulColor, designTokensLight.color.illustration)
    ).toBe(designTokensLight.color.illustration[token])
  })

  it('uses information04 as fallback for legacy Contentful colors', () => {
    expect(
      getCategoryHeaderBackgroundColor(Color.Aquamarine, designTokensLight.color.illustration)
    ).toBe(designTokensLight.color.illustration.information04)
  })
})
