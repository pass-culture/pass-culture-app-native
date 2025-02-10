import { ImageWithCredit } from 'shared/types'

export function getImagesUrlsWithCredit<
  ImageResponse extends { url: string; credit?: string | null },
>(images: { [key: string]: ImageResponse }): ImageWithCredit[] {
  return Object.values(images).map(({ url, credit }) => ({ url, credit }))
}
