const isNotEmpty = (text: string | undefined | null) => text !== undefined && text !== ''

export const formatFullAddress = (
  publicName: string | undefined | null,
  name: string,
  address: string | undefined | null,
  postalCode: string | undefined | null,
  city: string | undefined | null,
  addressWithoutVenueName?: boolean | false
) => {
  function formatFullAddressWithoutVenueName() {
    let fullAddress = `${address}`
    if (isNotEmpty(postalCode) || isNotEmpty(city)) fullAddress = fullAddress.concat(',')
    if (isNotEmpty(postalCode)) fullAddress = fullAddress.concat(` ${postalCode}`)
    if (isNotEmpty(city)) fullAddress = fullAddress.concat(` ${city}`)
    return fullAddress
  }
  function formatFullAddress() {
    let fullAddress = `${publicName || name}`
    if (isNotEmpty(address)) fullAddress = fullAddress.concat(`, ${address}`)
    if (isNotEmpty(postalCode) || isNotEmpty(city)) fullAddress = fullAddress.concat(',')
    if (isNotEmpty(postalCode)) fullAddress = fullAddress.concat(` ${postalCode}`)
    if (isNotEmpty(city)) fullAddress = fullAddress.concat(` ${city}`)
    return fullAddress
  }
  if (addressWithoutVenueName) return formatFullAddressWithoutVenueName()
  return formatFullAddress()
}
