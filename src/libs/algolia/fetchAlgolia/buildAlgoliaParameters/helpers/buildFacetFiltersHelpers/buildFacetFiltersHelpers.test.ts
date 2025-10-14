import {
  GenreType,
  NativeCategoryIdEnumv2,
  SearchGroupNameEnumv2,
  SubcategoryIdEnumv2,
} from 'api/gen'
import { BooksNativeCategoriesEnum } from 'features/search/types'
import {
  buildAccessibiltyFiltersPredicate,
  buildAllocineIdPredicate,
  buildEanPredicate,
  buildObjectIdsPredicate,
  buildOfferCategoriesPredicate,
  buildOfferGenreTypesPredicate,
  buildOfferGtlsPredicate,
  buildOfferIsDuoPredicate,
  buildOfferNativeCategoriesPredicate,
  buildOfferSubcategoriesPredicate,
  buildTagsPredicate,
} from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/helpers/buildFacetFiltersHelpers/buildFacetFiltersHelpers'
import { eventMonitoring } from 'libs/monitoring/services'

describe('buildOfferCategoriesPredicate', () => {
  it('should return an offer categories predicate formatted for Algolia API', () => {
    const offerCategoriesPredicate = buildOfferCategoriesPredicate([
      SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS,
      SearchGroupNameEnumv2.LIVRES,
    ])

    expect(offerCategoriesPredicate).toEqual([
      'offer.searchGroupNamev2:ARTS_LOISIRS_CREATIFS',
      'offer.searchGroupNamev2:LIVRES',
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

  it('should return an LIVRES_PAPIERS offer native categories predicate formatted for Algolia API with BookEnum', () => {
    const offerSubcategoriesPredicate = buildOfferNativeCategoriesPredicate([
      BooksNativeCategoriesEnum.MANGAS,
    ])

    expect(offerSubcategoriesPredicate).toEqual(['offer.nativeCategoryId:LIVRES_PAPIER'])
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
    const eansPredicate = buildEanPredicate(['9780000000001', '9780000000002'])

    expect(eansPredicate).toEqual(['offer.ean:9780000000001', 'offer.ean:9780000000002'])
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

describe('buildTagsPredicate', () => {
  it('should return undefined when no tags associated', () => {
    const tagsPredicate = buildTagsPredicate([])

    expect(tagsPredicate).toEqual(undefined)
  })

  it('should return a tags predicate formatted for Algolia API', () => {
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

describe('buildOfferGtlsPredicate', () => {
  it('should return empty array when no gtls associated', () => {
    const gtlsPredicate = buildOfferGtlsPredicate([])

    expect(gtlsPredicate).toEqual([])
  })

  it('should return a gtls predicate formatted for Algolia API', () => {
    const gtlsPredicate = buildOfferGtlsPredicate([
      { code: '03040500', level: 3, label: 'Shonen' },
      { code: '03040800', level: 3, label: 'Yaoi' },
    ])

    expect(gtlsPredicate).toEqual(['offer.gtlCodeLevel3:03040500', 'offer.gtlCodeLevel3:03040800'])
  })
})

describe('buildAccessibiltyFiltersPredicate', () => {
  it('should return an accessibility filters predicate formatted for Algolia API', () => {
    const accessibilityFiltersPredicate = buildAccessibiltyFiltersPredicate({
      isAudioDisabilityCompliant: true,
      isMentalDisabilityCompliant: false,
      isMotorDisabilityCompliant: true,
      isVisualDisabilityCompliant: false,
    })

    expect(accessibilityFiltersPredicate).toEqual([
      ['venue.isAudioDisabilityCompliant:true'],
      ['venue.isMotorDisabilityCompliant:true'],
    ])
  })

  it('should return an empty array when no accessibility filters associated', () => {
    const accessibilityFiltersPredicate = buildAccessibiltyFiltersPredicate({
      isAudioDisabilityCompliant: false,
      isMentalDisabilityCompliant: false,
      isMotorDisabilityCompliant: false,
      isVisualDisabilityCompliant: false,
    })

    expect(accessibilityFiltersPredicate).toEqual([])
  })

  it('should return all accessibility filters predicate formatted for Algolia API', () => {
    const accessibilityFiltersPredicate = buildAccessibiltyFiltersPredicate({
      isAudioDisabilityCompliant: true,
      isMentalDisabilityCompliant: true,
      isMotorDisabilityCompliant: true,
      isVisualDisabilityCompliant: true,
    })

    expect(accessibilityFiltersPredicate).toEqual([
      ['venue.isAudioDisabilityCompliant:true'],
      ['venue.isMentalDisabilityCompliant:true'],
      ['venue.isMotorDisabilityCompliant:true'],
      ['venue.isVisualDisabilityCompliant:true'],
    ])
  })

  describe('buildAllocineIdPredicate', () => {
    it('should return an allocine predicate formatted for Algolia API', () => {
      const allocineIdPredicate = buildAllocineIdPredicate([123456])

      expect(allocineIdPredicate).toEqual(['offer.allocineId:123456'])
    })
  })

  it('should return an allocine predicate with multiple IDs formatted when provided for Algolia API', () => {
    const allocineIdPredicate = buildAllocineIdPredicate([123456, 654321])

    expect(allocineIdPredicate).toEqual(['offer.allocineId:123456', 'offer.allocineId:654321'])
  })
})
