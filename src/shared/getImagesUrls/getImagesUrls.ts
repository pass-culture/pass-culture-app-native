export function getImagesUrls<ImageResponse extends { url: string }>(images: {
  [key: string]: ImageResponse
}): string[] {
  return Object.values(images).map((image) => image.url)
}
