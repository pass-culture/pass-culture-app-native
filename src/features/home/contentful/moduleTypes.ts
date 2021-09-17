import {
  SearchParametersFields,
  DisplayParametersFields,
  VenuesSearchParametersFields,
} from './contentful'

export class Offers {
  search: SearchParametersFields[]
  display: DisplayParametersFields
  moduleId: string
  constructor({
    search,
    display,
    moduleId,
  }: {
    search: SearchParametersFields[]
    display: DisplayParametersFields
    moduleId: string
  }) {
    this.search = search
    this.display = display
    this.moduleId = moduleId
  }
}

export class OffersWithCover extends Offers {
  cover: string | null
  constructor({
    cover,
    display,
    search,
    moduleId,
  }: {
    search: SearchParametersFields[]
    display: DisplayParametersFields
    cover: string | null
    moduleId: string
  }) {
    super({ search, display, moduleId })
    this.cover = cover
  }
}

export class VenuesPane {
  search: VenuesSearchParametersFields[]
  display: DisplayParametersFields
  moduleId: string
  constructor({
    search,
    display,
    moduleId,
  }: {
    search: VenuesSearchParametersFields[]
    display: DisplayParametersFields
    moduleId: string
  }) {
    this.search = search
    this.display = display
    this.moduleId = moduleId
  }
}

export class ExclusivityPane {
  alt: string
  image: string
  offerId: string
  moduleId: string
  constructor({
    alt,
    image,
    offerId,
    moduleId,
  }: {
    alt: string
    image: string
    offerId: string
    moduleId: string
  }) {
    this.alt = alt
    this.image = image
    this.offerId = offerId
    this.moduleId = moduleId
  }
}

export class RecommendationPane {
  display: DisplayParametersFields
  constructor({ display }: { display: DisplayParametersFields }) {
    this.display = display
  }
}

export class BusinessPane {
  title: string
  firstLine: string | undefined
  image: string
  leftIcon: string | undefined
  secondLine: string | undefined
  url: string | undefined
  moduleId: string
  targetNotConnectedUsersOnly: boolean | undefined
  constructor({
    title,
    firstLine,
    image,
    leftIcon,
    secondLine,
    url,
    moduleId,
    targetNotConnectedUsersOnly,
  }: {
    title: string
    firstLine: string | undefined
    image: string
    leftIcon: string | undefined
    secondLine: string | undefined
    url: string | undefined
    moduleId: string
    targetNotConnectedUsersOnly: boolean | undefined
  }) {
    this.title = title
    this.firstLine = firstLine
    this.image = image
    this.leftIcon = leftIcon
    this.secondLine = secondLine
    this.url = url
    this.moduleId = moduleId
    this.targetNotConnectedUsersOnly = targetNotConnectedUsersOnly
  }
}

export type ProcessedModule =
  | Offers
  | ExclusivityPane
  | BusinessPane
  | OffersWithCover
  | RecommendationPane
