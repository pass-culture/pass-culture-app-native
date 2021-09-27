const isNotEmpty = (text: string | undefined | null) => text !== undefined && text !== ''

export const formatFullAddress = (
  publicName: string | undefined | null,
  name: string,
  address: string | undefined | null,
  postalCode: string | undefined | null,
  city: string | undefined | null
) => {
  let fullAddress = `${publicName || name}`
  if (isNotEmpty(address)) fullAddress = fullAddress.concat(`, ${address}`)
  if (isNotEmpty(postalCode) || isNotEmpty(city)) fullAddress = fullAddress.concat(',')
  if (isNotEmpty(postalCode)) fullAddress = fullAddress.concat(` ${postalCode}`)
  if (isNotEmpty(city)) fullAddress = fullAddress.concat(` ${city}`)
  return fullAddress
}

// TODO (Lucasbeneston) : Add addressWithoutVenueName to formatFullAddress
// const addressWithoutVenueName = t`${venue.address}, ${venue.postalCode} ${venue.city}`
// const adaptedAddress =
//   address && !showVenueBanner
//     ? address
//     : venue.address &&
//       venue.postalCode &&
//       venue.city &&
//       // TODO : Remove testing condition when display the link to venue button
//       env.FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING &&
//       showVenueBanner
//     ? addressWithoutVenueName
//     : null
