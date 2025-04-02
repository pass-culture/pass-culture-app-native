type FullAddressType = string | undefined | null
const isNotEmpty = (text: FullAddressType) => !!text

export function formatFullAddress(
  address: FullAddressType,
  postalCode: FullAddressType,
  city: FullAddressType
) {
  return [address, [postalCode, city].filter(isNotEmpty).join(' ')].filter(isNotEmpty).join(', ')
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
