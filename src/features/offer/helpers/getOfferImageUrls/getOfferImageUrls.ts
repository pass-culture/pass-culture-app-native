import { OfferImageResponse } from 'api/gen'

export function getOfferImageUrls(images: { [key: string]: OfferImageResponse }) {
  return Object.values(images).map((image) => image.url)
}
