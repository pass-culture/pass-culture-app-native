import { AlgoliaParametersFields, DisplayParametersFields } from 'features/home/contentful.d'

export class Offers {
  algolia: AlgoliaParametersFields
  display: DisplayParametersFields
  constructor({
    algolia,
    display,
  }: {
    algolia: AlgoliaParametersFields
    display: DisplayParametersFields
  }) {
    this.algolia = algolia
    this.display = display
  }
}

export class OffersWithCover extends Offers {
  cover: string | null
  constructor({
    algolia,
    cover,
    display,
  }: {
    algolia: AlgoliaParametersFields
    display: DisplayParametersFields
    cover: string | null
  }) {
    super({ algolia, display })
    this.cover = cover
  }
}

export class ExclusivityPane {
  alt: string
  image: string
  offerId: string
  constructor({ alt, image, offerId }: { alt: string; image: string; offerId: string }) {
    this.alt = alt
    this.image = image
    this.offerId = offerId
  }
}

export class BusinessPane {
  firstLine: string | undefined
  image: string | undefined | null
  secondLine: string | undefined
  url: string | undefined
  constructor({
    firstLine,
    image,
    secondLine,
    url,
  }: {
    firstLine: string | undefined
    image: string | undefined | null
    secondLine: string | undefined
    url: string | undefined
  }) {
    this.firstLine = firstLine
    this.image = image
    this.secondLine = secondLine
    this.url = url
  }
}

export type ProcessedModule = Offers | ExclusivityPane | BusinessPane | OffersWithCover
