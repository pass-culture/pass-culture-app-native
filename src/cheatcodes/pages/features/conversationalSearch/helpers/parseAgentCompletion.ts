import { SubcategoryIdEnum } from 'api/gen'
import { buildProductionImageUrl } from 'cheatcodes/pages/features/conversationalSearch/constants'
import { isRecord } from 'cheatcodes/pages/features/conversationalSearch/helpers/isRecord'
import {
  ParsedCompletion,
  ParsedSearch,
} from 'cheatcodes/pages/features/conversationalSearch/types'
import { convertEuroToCents } from 'libs/parsers/pricesConversion'
import { Offer } from 'shared/offer/types'

const CITED_OFFER_ID_REGEX = /\/offre\/(\d+)/g

const toOptionalString = (value: unknown): string | undefined =>
  typeof value === 'string' ? value : undefined

const toOptionalBoolean = (value: unknown): boolean | undefined =>
  typeof value === 'boolean' ? value : undefined

const toNumbers = (value: unknown): number[] | undefined =>
  Array.isArray(value)
    ? value.filter((item): item is number => typeof item === 'number')
    : undefined

const toReleaseDate = (value: unknown): number | string | undefined =>
  typeof value === 'number' || typeof value === 'string' ? value : undefined

const toSubcategoryId = (value: unknown): SubcategoryIdEnum | undefined =>
  Object.values(SubcategoryIdEnum).find((subcategoryId) => subcategoryId === value)

const toOffer = (hit: unknown): Offer | undefined => {
  if (!isRecord(hit) || typeof hit.objectID !== 'string' || !isRecord(hit.offer)) return undefined

  const subcategoryId = toSubcategoryId(hit.offer.subcategoryId)
  if (!subcategoryId) return undefined

  const thumbUrl = toOptionalString(hit.offer.thumbUrl)
  const venue = isRecord(hit.venue) ? hit.venue : {}

  return {
    objectID: hit.objectID,
    offer: {
      subcategoryId,
      name: toOptionalString(hit.offer.name),
      prices: toNumbers(hit.offer.prices)?.map(convertEuroToCents),
      dates: toNumbers(hit.offer.dates),
      releaseDate: toReleaseDate(hit.offer.releaseDate),
      thumbUrl: thumbUrl ? buildProductionImageUrl(thumbUrl) : undefined,
      isDuo: toOptionalBoolean(hit.offer.isDuo),
      isDigital: toOptionalBoolean(hit.offer.isDigital),
    },
    venue: {
      name: toOptionalString(venue.name),
      publicName: toOptionalString(venue.publicName),
      city: toOptionalString(venue.city),
      postalCode: toOptionalString(venue.postalCode),
    },
    _geoloc: {},
  }
}

const toQueries = (input: unknown): string[] => {
  if (!isRecord(input)) return []
  const queries = Array.isArray(input.queries) ? input.queries : [input]
  return queries
    .map((item) => (isRecord(item) ? toOptionalString(item.query) : undefined))
    .filter((query): query is string => !!query)
}

const toSearch = (part: unknown): { search: ParsedSearch; offers: Offer[] } | undefined => {
  if (!isRecord(part) || !isRecord(part.output) || !Array.isArray(part.output.hits)) {
    return undefined
  }
  const offers = part.output.hits.map(toOffer).filter((offer): offer is Offer => !!offer)
  const nbHits =
    typeof part.output.nbHits === 'number' ? part.output.nbHits : part.output.hits.length

  return { search: { queries: toQueries(part.input), nbHits }, offers }
}

const toText = (part: unknown): string | undefined =>
  isRecord(part) && part.type === 'text' ? toOptionalString(part.text) : undefined

const getCitedOfferIds = (text: string): string[] => [
  ...new Set(Array.from(text.matchAll(CITED_OFFER_ID_REGEX), (match) => match[1] ?? '')),
]

export const getDisplayedOffers = ({ citedOffers, offers }: ParsedCompletion): Offer[] =>
  citedOffers.length ? citedOffers : offers

export const parseAgentCompletion = (raw: unknown): ParsedCompletion => {
  const parts = isRecord(raw) && Array.isArray(raw.parts) ? raw.parts : []

  const text = parts
    .map(toText)
    .filter((partText): partText is string => !!partText)
    .join('\n\n')

  const toolResults = parts
    .map(toSearch)
    .filter((result): result is NonNullable<ReturnType<typeof toSearch>> => !!result)

  const offersById = new Map<string, Offer>()
  toolResults.forEach(({ offers }) =>
    offers.forEach((offer) => {
      if (!offersById.has(offer.objectID)) offersById.set(offer.objectID, offer)
    })
  )

  const citedOfferIds = getCitedOfferIds(text)

  return {
    text,
    searches: toolResults.map(({ search }) => search),
    offers: [...offersById.values()],
    citedOffers: citedOfferIds
      .map((offerId) => offersById.get(offerId))
      .filter((offer): offer is Offer => !!offer),
    unknownCitedOfferIds: citedOfferIds.filter((offerId) => !offersById.has(offerId)),
  }
}
