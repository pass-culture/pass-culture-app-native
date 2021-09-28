import { env } from 'libs/environment'

const isNotEmpty = (text: string | undefined | null) => text !== undefined && text !== ''

export const formatFullAddress = (
  publicName: string | undefined | null,
  name: string,
  address: string | undefined | null,
  postalCode: string | undefined | null,
  city: string | undefined | null,
  showVenueBanner?: boolean | false
) => {
  let fullAddress = `${publicName || name}`
  if (isNotEmpty(address)) fullAddress = fullAddress.concat(`, ${address}`)
  if (isNotEmpty(postalCode) || isNotEmpty(city)) fullAddress = fullAddress.concat(',')
  if (isNotEmpty(postalCode)) fullAddress = fullAddress.concat(` ${postalCode}`)
  if (isNotEmpty(city)) fullAddress = fullAddress.concat(` ${city}`)
  // TODO (Lucasbeneston): Remove testing condition when display the link to venue button
  if (showVenueBanner && isNotEmpty(address) && env.FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING) {
    if (isNotEmpty(postalCode)) fullAddress = `${address}, ${postalCode}`
    if (isNotEmpty(city)) fullAddress = `${address}, ${city}`
    if (isNotEmpty(postalCode) && isNotEmpty(city))
      fullAddress = `${address}, ${postalCode} ${city}`
  }
  return fullAddress
}
