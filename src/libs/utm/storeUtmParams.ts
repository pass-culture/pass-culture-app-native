import { storage, StorageKey } from 'libs/storage'
import { getUtmParamsConsent } from 'libs/utm/getUtmParamsConsent'
import { UtmParams } from 'libs/utm/types'

export async function storeUtmParams({ campaign, medium, source }: UtmParams) {
  const {
    acceptedTrafficCampaign,
    acceptedTrafficMedium,
    acceptedTrafficSource,
    acceptedCampaignDate,
  } = await getUtmParamsConsent()

  const multiString: Array<[StorageKey, string]> = []
  if (campaign && acceptedTrafficCampaign) multiString.push(['traffic_campaign', campaign])
  if (medium && acceptedTrafficMedium) multiString.push(['traffic_medium', medium])
  if (source && acceptedTrafficSource) multiString.push(['traffic_source', source])
  if (acceptedCampaignDate) multiString.push(['campaign_date', new Date().valueOf().toString()])
  if (multiString.length) {
    await storage.saveMultiString(multiString)
  }
}
