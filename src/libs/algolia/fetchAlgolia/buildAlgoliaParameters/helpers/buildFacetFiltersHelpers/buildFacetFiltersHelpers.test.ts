import {
  GenreType,
  NativeCategoryIdEnumv2,
  SearchGroupNameEnumv2,
  SubcategoryIdEnumv2,
} from 'api/gen'
import {
  buildEanPredicate,
  buildObjectIdsPredicate,
  buildOfferCategoriesPredicate,
  buildOfferGenreTypesPredicate,
  buildOfferIsDuoPredicate,
  buildOfferNativeCategoriesPredicate,
  buildOfferSubcategoriesPredicate,
  buildOfferTypesPredicate,
  buildTagsPredicate,
} from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/helpers/buildFacetFiltersHelpers/buildFacetFiltersHelpers'
import { eventMonitoring } from 'libs/monitoring'

describe('buildOfferCategoriesPredicate', () => {
  it('should return an offer categories predicate formatted for Algolia API', () => {
    const offerCategoriesPredicate = buildOfferCategoriesPredicate([
      SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS,
      SearchGroupNameEnumv2.BIBLIOTHEQUES_MEDIATHEQUE,
    ])

    expect(offerCategoriesPredicate).toEqual([
      'offer.searchGroupNamev2:ARTS_LOISIRS_CREATIFS',
      'offer.searchGroupNamev2:BIBLIOTHEQUES_MEDIATHEQUE',
    ])
  })
})

describe('buildOfferSubcategoriesPredicate', () => {
  it('should return an offer subcategories predicate formatted for Algolia API', () => {
    const offerSubcategoriesPredicate = buildOfferSubcategoriesPredicate([
      SubcategoryIdEnumv2.CONCERT,
      SubcategoryIdEnumv2.SEANCE_CINE,
    ])

    expect(offerSubcategoriesPredicate).toEqual([
      'offer.subcategoryId:CONCERT',
      'offer.subcategoryId:SEANCE_CINE',
    ])
  })
})

describe('buildOfferNativeCategoriesPredicate', () => {
  it('should return an offer native categories predicate formatted for Algolia API', () => {
    const offerSubcategoriesPredicate = buildOfferNativeCategoriesPredicate([
      NativeCategoryIdEnumv2.ARTS_VISUELS,
      NativeCategoryIdEnumv2.DVD_BLU_RAY,
    ])

    expect(offerSubcategoriesPredicate).toEqual([
      'offer.nativeCategoryId:ARTS_VISUELS',
      'offer.nativeCategoryId:DVD_BLU_RAY',
    ])
  })
})

describe('buildOfferGenreTypesPredicate', () => {
  it('should return an offer genre types predicate with an empty string when no API correspondence', () => {
    const offerGenreTypePredicate = buildOfferGenreTypesPredicate([
      { key: 'DRAMA' as GenreType, name: 'Comédie', value: 'Comédie' },
    ])

    expect(offerGenreTypePredicate).toEqual([''])
  })

  it('should return a movie offer genre types predicate formatted for Algolia API', () => {
    const offerGenreTypePredicate = buildOfferGenreTypesPredicate([
      { key: GenreType.MOVIE, name: 'DETECTIVE', value: 'Policier' },
      { key: GenreType.MOVIE, name: 'ROMANCE', value: 'Romance' },
    ])

    expect(offerGenreTypePredicate).toEqual([
      'offer.movieGenres:DETECTIVE',
      'offer.movieGenres:ROMANCE',
    ])
  })

  it('should return a book offer genre types predicate formatted for Algolia API', () => {
    const offerGenreTypePredicate = buildOfferGenreTypesPredicate([
      { key: GenreType.BOOK, name: 'Policier', value: 'Policier' },
      { key: GenreType.BOOK, name: 'Romance', value: 'Romance' },
    ])

    expect(offerGenreTypePredicate).toEqual([
      'offer.bookMacroSection:Policier',
      'offer.bookMacroSection:Romance',
    ])
  })

  it('should return a music offer genre types predicate formatted for Algolia API', () => {
    const offerGenreTypePredicate = buildOfferGenreTypesPredicate([
      { key: GenreType.MUSIC, name: 'Pop', value: 'Pop' },
      { key: GenreType.MUSIC, name: 'Rap', value: 'Rap' },
    ])

    expect(offerGenreTypePredicate).toEqual(['offer.musicType:Pop', 'offer.musicType:Rap'])
  })

  it('should return a show offer genre types predicate formatted for Algolia API', () => {
    const offerGenreTypePredicate = buildOfferGenreTypesPredicate([
      { key: GenreType.SHOW, name: 'Comédie musicale', value: 'Comédie musicale' },
      { key: GenreType.SHOW, name: 'Pièce de théâtre', value: 'Pièce de théâtre' },
    ])

    expect(offerGenreTypePredicate).toEqual([
      'offer.showType:Comédie musicale',
      'offer.showType:Pièce de théâtre',
    ])
  })
})

describe('buildObjectIdsPredicate', () => {
  it('should return an object ids predicate formatted for Algolia API', () => {
    const objectIdsPredicate = buildObjectIdsPredicate(['15000', '150001'])

    expect(objectIdsPredicate).toEqual(['objectID:15000', 'objectID:150001'])
  })

  it('should catch an error Sentry when object ids param not correctly passed and return an empty array', () => {
    const error = new TypeError('objectIds.map is not a function')
    const objectIdsPredicate = buildObjectIdsPredicate('15000' as unknown as string[])

    expect(eventMonitoring.captureException).toHaveBeenCalledWith(error, {
      level: 'error',
      extra: { objectIds: '15000' },
    })
    expect(objectIdsPredicate).toEqual([])
  })
})

describe('buildEanPredicate', () => {
  it('should return an ean predicate formatted for Algolia API', () => {
    const objectIdsPredicate = buildEanPredicate(['9780000000001', '9780000000002'])

    expect(objectIdsPredicate).toEqual(['offer.ean:9780000000001', 'offer.ean:9780000000002'])
  })
})

describe('buildOfferIsDuoPredicate', () => {
  it('should return an offer is duo predicate formatted for Algolia API when offerIsDuo param is true', () => {
    const offerIsDuoPredicate = buildOfferIsDuoPredicate(true)

    expect(offerIsDuoPredicate).toEqual(['offer.isDuo:true'])
  })

  it('should return undefined when offerIsDuo param is false', () => {
    const offerIsDuoPredicate = buildOfferIsDuoPredicate(false)

    expect(offerIsDuoPredicate).toEqual(undefined)
  })
})

describe('buildOfferTypesPredicate', () => {
  it('should return undefined when all offer types are false', () => {
    const offerTypesPredicate = buildOfferTypesPredicate({
      isDigital: false,
      isEvent: false,
      isThing: false,
    })

    expect(offerTypesPredicate).toEqual(undefined)
  })

  it('should return an offer types predicate formatted for Algolia API with isDigital = true when offer is digital, is not an event and a thing', () => {
    const offerTypesPredicate = buildOfferTypesPredicate({
      isDigital: true,
      isEvent: false,
      isThing: false,
    })

    expect(offerTypesPredicate).toEqual([['offer.isDigital:true']])
  })

  it('should return an offer types predicate formatted for Algolia API with isThing = true when offer is digital, is a thing and is not an event', () => {
    const offerTypesPredicate = buildOfferTypesPredicate({
      isDigital: true,
      isEvent: false,
      isThing: true,
    })

    expect(offerTypesPredicate).toEqual([['offer.isThing:true']])
  })

  it('should return an offer types predicate formatted for Algolia API with isDigital = true and isEvent = true when offer is digital, is an event and is not a thing', () => {
    const offerTypesPredicate = buildOfferTypesPredicate({
      isDigital: true,
      isEvent: true,
      isThing: false,
    })

    expect(offerTypesPredicate).toEqual([['offer.isDigital:true', 'offer.isEvent:true']])
  })

  it('should return an offer types predicate formatted for Algolia API with isDigital = false and isThing = true when offer is not digital, is not an event and is a thing', () => {
    const offerTypesPredicate = buildOfferTypesPredicate({
      isDigital: false,
      isEvent: false,
      isThing: true,
    })

    expect(offerTypesPredicate).toEqual([['offer.isDigital:false'], ['offer.isThing:true']])
  })

  it('should return an offer types predicate formatted for Algolia API with isEvent = true when offer is not digital, is not a thing and is an event', () => {
    const offerTypesPredicate = buildOfferTypesPredicate({
      isDigital: false,
      isEvent: true,
      isThing: false,
    })

    expect(offerTypesPredicate).toEqual([['offer.isEvent:true']])
  })

  it('should return an offer types predicate formatted for Algolia API with isDigital = false when offer is not digital, is a thing and is an event', () => {
    const offerTypesPredicate = buildOfferTypesPredicate({
      isDigital: false,
      isEvent: true,
      isThing: true,
    })

    expect(offerTypesPredicate).toEqual([['offer.isDigital:false']])
  })
})

describe('buildTagsPredicate', () => {
  it('should return undefined when no tags associated', () => {
    const tagsPredicate = buildTagsPredicate([])

    expect(tagsPredicate).toEqual(undefined)
  })

  it('should return a tags predicate for formatted for Algolia API', () => {
    const tagsPredicate = buildTagsPredicate([
      'Semaine du 14 juillet',
      'Offre cinema spéciale pass culture',
    ])

    expect(tagsPredicate).toEqual([
      'offer.tags:Semaine du 14 juillet',
      'offer.tags:Offre cinema spéciale pass culture',
    ])
  })
})
