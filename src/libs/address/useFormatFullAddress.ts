type FullAddressType = string | undefined | null
const isNotEmpty = (text: FullAddressType) => !!text

export function formatFullAddress(
  address: FullAddressType,
  postalCode: FullAddressType,
  city: FullAddressType
) {
  let fullAddress = ''
  if (isNotEmpty(address)) fullAddress = fullAddress.concat(`${String(address)}`)
  if (isNotEmpty(fullAddress) && (isNotEmpty(postalCode) || isNotEmpty(city))) {
    fullAddress = fullAddress.concat(', ')
  }
  if (isNotEmpty(postalCode)) {
    if (isNotEmpty(city)) {
      fullAddress = fullAddress.concat(`${String(postalCode)} ${String(city)}`)
    } else {
      fullAddress = fullAddress.concat(`${String(postalCode)}`)
    }
  } else if (isNotEmpty(city)) {
    fullAddress = fullAddress.concat(`${String(city)}`)
  }

  return fullAddress
}

export function formatFullAddressStartsWithPostalCode(
  address: FullAddressType,
  postalCode: FullAddressType,
  city: FullAddressType
) {
  if (!address && !postalCode && !city) return ''
  if (address && !postalCode && !city) return address

  const firstPart = [postalCode, city].filter(Boolean).join(' ')

  return [firstPart, address].filter(Boolean).join(', ')
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
