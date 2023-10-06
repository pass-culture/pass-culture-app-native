import { storage, StorageKey } from 'libs/storage'
import { UtmParams } from 'libs/utm/types'

export async function storeUtmParams({ campaign, content, gen, medium, source }: UtmParams) {
  const multiString: Array<[StorageKey, string]> = []
  if (campaign) multiString.push(['traffic_campaign', campaign])
  if (content) multiString.push(['traffic_content', content])
  if (gen) multiString.push(['traffic_gen', gen])
  if (medium) multiString.push(['traffic_medium', medium])
  if (source) multiString.push(['traffic_source', source])
  if (campaign || medium || source)
    multiString.push(['campaign_date', new Date().valueOf().toString()])
  if (multiString.length) {
    await storage.saveMultiString(multiString)
  }
}
