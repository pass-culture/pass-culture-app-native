const isNotEmpty = (text: string | undefined | null) => !!text

export function formatFullAddress(
  address: string | undefined | null,
  postalCode: string | undefined | null,
  city: string | undefined | null
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
  address: string | undefined | null,
  postalCode: string | undefined | null,
  city: string | undefined | null,
  publicName: string | undefined | null,
  name: string | undefined | null
) {
  let fullAddress = `${publicName || name || ''}`
  const placeAddress = formatFullAddress(address, postalCode, city)
  if (isNotEmpty(placeAddress)) fullAddress = fullAddress.concat(`, ${placeAddress}`)
  return fullAddress
}
