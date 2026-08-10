import { buildCategoryIllustrationUrl } from 'shared/illustrations/buildCategoryIllustrationUrl'

const genericInfoPageIllustrationNames = [
  'birthdayCake',
  'blockedPaintingLarge',
  'brokenDinosaurSkeletonLarge',
  'disconnectedCableStickManLarge',
  'emptyDigitalWindowLarge',
  'emptyWalletLarge',
  'hourglass',
  'mailBoxSendingLarge',
  'mobileDeviceAndParameters',
  'questioningKnightLarge',
  'sculptureMagnifyingGlassPaperLarge',
  'stressedKnightLarge',
  'trashMosaic',
  'validStampMosaïcLarge',
] as const

type GenericInfoPageIllustrationName = (typeof genericInfoPageIllustrationNames)[number]

export const genericInfoPageIllustrationUrls = {
  birthdayCake: buildCategoryIllustrationUrl('birthdayCake.png'),
  blockedPaintingLarge: buildCategoryIllustrationUrl('blockedPaintingLarge.png'),
  brokenDinosaurSkeletonLarge: buildCategoryIllustrationUrl('brokenDinosaurSkeletonLarge.png'),
  disconnectedCableStickManLarge: buildCategoryIllustrationUrl(
    'disconnectedCableStickManLarge.png'
  ),
  emptyDigitalWindowLarge: buildCategoryIllustrationUrl('emptyDigitalWindowLarge.png'),
  emptyWalletLarge: buildCategoryIllustrationUrl('emptyWalletLarge.png'),
  hourglass: buildCategoryIllustrationUrl('hourglass.png'),
  mailBoxSendingLarge: buildCategoryIllustrationUrl('mailBoxSendingLarge.png'),
  mobileDeviceAndParameters: buildCategoryIllustrationUrl('mobileDeviceAndParameters.png'),
  questioningKnightLarge: buildCategoryIllustrationUrl('questioningKnightLarge.png'),
  sculptureMagnifyingGlassPaperLarge: buildCategoryIllustrationUrl(
    'sculptureMagnifyingGlassPaperLarge.png'
  ),
  stressedKnightLarge: buildCategoryIllustrationUrl('stressedKnightLarge.png'),
  trashMosaic: buildCategoryIllustrationUrl('trashMosaic.png'),
  validStampMosaïcLarge: buildCategoryIllustrationUrl('validStampMosaïcLarge.png'),
} as const satisfies Record<GenericInfoPageIllustrationName, string>
