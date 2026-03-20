import { LogTypeEnum } from 'libs/monitoring/errors'
import { eventMonitoring } from 'libs/monitoring/services'
import { buildPlaceUrl, BuildSearchAddressProps } from 'libs/place/buildUrl'
import { Collection } from 'libs/place/types'

const buildSuggestedAddresses = (collection: Collection): string[] =>
  collection.features.map(({ properties }) => properties.name)

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
  } catch (error) {
    eventMonitoring.captureException('Failed to fetch addresses', {
      level: LogTypeEnum.INFO,
      extra: { error },
    })
    return []
  }
}
