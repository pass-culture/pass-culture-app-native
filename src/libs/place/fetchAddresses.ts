import { Collection } from 'libs/place'
import { buildPlaceUrl, BuildSearchAddressProps } from 'libs/place/buildUrl'

export const buildSuggestedAddresses = (collection: Collection): string[] =>
  collection.features.map(({ properties }) => properties.label)

export const fetchAddresses = async ({
  query,
  cityCode,
  postalCode,
  limit = 10,
}: BuildSearchAddressProps): Promise<string[]> => {
  const url = buildPlaceUrl({ query, cityCode, postalCode, limit })

  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error('Failed to fetch addresses')
    const collection: Collection = await response.json()
    return buildSuggestedAddresses(collection)
  } catch (_error) {
    return []
  }
}
