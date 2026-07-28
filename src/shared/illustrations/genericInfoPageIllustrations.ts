import { buildCategoryIllustrationUrl } from 'shared/illustrations/buildCategoryIllustrationUrl'

const genericInfoPageIllustrationNames = [
  'blockedPaintingLarge',
  'brokenDinosaurSkeletonLarge',
  'emptyDigitalWindowLarge',
  'emptyWalletLarge',
  'hourglass',
  'mailBoxSendingLarge',
  'questioningKnightLarge',
  'sculptureMagnifyingGlassPaperLarge',
  'stressedKnightLarge',
  'trashMosaic',
  'validStampMosaïcLarge',
] as const

type GenericInfoPageIllustrationName = (typeof genericInfoPageIllustrationNames)[number]

export const genericInfoPageIllustrationUrls = {
  blockedPaintingLarge: buildCategoryIllustrationUrl('blockedPaintingLarge.png'),
  brokenDinosaurSkeletonLarge: buildCategoryIllustrationUrl('brokenDinosaurSkeletonLarge.png'),
  emptyDigitalWindowLarge: buildCategoryIllustrationUrl('emptyDigitalWindowLarge.png'),
  emptyWalletLarge: buildCategoryIllustrationUrl('emptyWalletLarge.png'),
  hourglass: buildCategoryIllustrationUrl('hourglass.png'),
  mailBoxSendingLarge: buildCategoryIllustrationUrl('mailBoxSendingLarge.png'),
  questioningKnightLarge: buildCategoryIllustrationUrl('questioningKnightLarge.png'),
  sculptureMagnifyingGlassPaperLarge: buildCategoryIllustrationUrl(
    'sculptureMagnifyingGlassPaperLarge.png'
  ),
  stressedKnightLarge: buildCategoryIllustrationUrl('stressedKnightLarge.png'),
  trashMosaic: buildCategoryIllustrationUrl('trashMosaic.png'),
  validStampMosaïcLarge: buildCategoryIllustrationUrl('validStampMosaïcLarge.png'),
} as const satisfies Record<GenericInfoPageIllustrationName, string>
