import { OfferImageResponse } from 'api/gen'

export function getImagesUrlsWithCredit<
  ImageResponse extends { url: string; credit?: string | null },
>(images: { [key: string]: ImageResponse }): OfferImageResponse[] {
  return Object.values(images).map(({ url, credit }) => ({ url, credit }))
}
