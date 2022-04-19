type FullAddressType = string | undefined | null
const isNotEmpty = (text: FullAddressType) => !!text

export function formatFullAddress(
  address: FullAddressType,
  postalCode: FullAddressType,
  city: FullAddressType
) {
  let fullAddress = ''
  if (isNotEmpty(address)) fullAddress = fullAddress.concat(`${address}`)
  if (isNotEmpty(fullAddress) && (isNotEmpty(postalCode) || isNotEmpty(city))) {
    fullAddress = fullAddress.concat(', ')
  }
  if (isNotEmpty(postalCode)) {
    if (isNotEmpty(city)) {
      fullAddress = fullAddress.concat(`${postalCode} ${city}`)
    } else {
      fullAddress = fullAddress.concat(`${postalCode}`)
    }
  } else {
    if (isNotEmpty(city)) {
      fullAddress = fullAddress.concat(`${city}`)
    }
  }
  return fullAddress
}

export function formatFullAddressWithVenueName(
  address: FullAddressType,
  postalCode: FullAddressType,
  city: FullAddressType,
  publicName: FullAddressType,
  name: FullAddressType
) {
  let fullAddress = `${publicName || name || ''}`
  const placeAddress = formatFullAddress(address, postalCode, city)
  if (isNotEmpty(placeAddress)) fullAddress = fullAddress.concat(`, ${placeAddress}`)
  return fullAddress
}
