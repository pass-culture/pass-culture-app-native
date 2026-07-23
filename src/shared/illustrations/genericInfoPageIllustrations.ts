import { buildCategoryIllustrationUrl } from 'shared/illustrations/buildCategoryIllustrationUrl'

const genericInfoPageIllustrationNames = [
  'blockedPaintingLarge',
  'brokenDinosaurSkeletonLarge',
  'emptyDigitalWindowLarge',
  'emptyWalletLarge',
  'hourglass',
  'trashMosaic',
] as const

type GenericInfoPageIllustrationName = (typeof genericInfoPageIllustrationNames)[number]

export const genericInfoPageIllustrationUrls = {
  blockedPaintingLarge: buildCategoryIllustrationUrl('blockedPaintingLarge.png'),
  brokenDinosaurSkeletonLarge: buildCategoryIllustrationUrl('brokenDinosaurSkeletonLarge.png'),
  emptyDigitalWindowLarge: buildCategoryIllustrationUrl('emptyDigitalWindowLarge.png'),
  emptyWalletLarge: buildCategoryIllustrationUrl('emptyWalletLarge.png'),
  hourglass: buildCategoryIllustrationUrl('emptyWalletLarge.png'),
  trashMosaic: buildCategoryIllustrationUrl('trashMosaic.png'),
} as const satisfies Record<GenericInfoPageIllustrationName, string>
