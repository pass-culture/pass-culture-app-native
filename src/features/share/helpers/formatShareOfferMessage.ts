export const formatShareOfferMessage = ({
  offerName,
  venueName,
}: {
  offerName: string
  venueName: string
}): string => {
  return `Retrouve "${offerName}" chez "${venueName}" sur le pass Culture`
}
