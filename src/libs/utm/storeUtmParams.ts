import { storage, StorageKey } from 'libs/storage'
import { UtmParams } from 'libs/utm/types'

export async function storeUtmParams({ campaign, medium, source }: UtmParams) {
  const multiString: Array<[StorageKey, string]> = []
  if (campaign) multiString.push(['traffic_campaign', campaign])
  if (medium) multiString.push(['traffic_medium', medium])
  if (source) multiString.push(['traffic_source', source])
  if (campaign || medium || source)
    multiString.push(['campaign_date', new Date().valueOf().toString()])
  if (multiString.length) {
    await storage.saveMultiString(multiString)
  }
}
