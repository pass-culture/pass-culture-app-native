import { getCategoryLabelParts } from 'features/search/helpers/getCategoryLabelParts/getCategoryLabelParts'

describe('getCategoryLabelParts', () => {
  it('should split category labels while preserving separator', () => {
    expect(getCategoryLabelParts('Concerts & festivals')).toEqual(['Concerts', '& festivals'])
    expect(getCategoryLabelParts('Films, séries et documentaires')).toEqual([
      'Films, séries',
      'et documentaires',
    ])
  })

  it('should split online event category label', () => {
    expect(getCategoryLabelParts('Évènements en ligne')).toEqual(['Évènements', 'en ligne'])
    expect(getCategoryLabelParts('Événements en ligne')).toEqual(['Événements', 'en ligne'])
  })

  it('should return undefined when label should not be split', () => {
    expect(getCategoryLabelParts('Musique')).toBeUndefined()
  })
})
