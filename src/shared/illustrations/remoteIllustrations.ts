import { buildCategoryIllustrationUrl } from 'shared/illustrations/buildCategoryIllustrationUrl'

const remoteIllustrationNames = [
  'bellPaintingSmall',
  'birthdayCake',
  'blockedPaintingLarge',
  'brokenBellSmall',
  'brokenDinosaurSkeletonLarge',
  'cryingManPaintingLarge',
  'disconnectedCableStickManLarge',
  'emptyDigitalWindowLarge',
  'emptyWalletLarge',
  'emptyWalletSmall',
  'heartMosaicSmall',
  'hourglass',
  'mailBoxSendingLarge',
  'mobileDeviceAndParameters',
  'oldMegaphone',
  'questioningKnightLarge',
  'questioningKnightSmall',
  'ratingHandsSmall',
  'ringingBellSmall',
  'sculptureMagnifyingGlassPaperLarge',
  'sculptureMagnifyingGlassPaperSmall',
  'signingDocumentPaintingLarge',
  'stressedKnightLarge',
  'trashMosaic',
  'validStampMosaïcLarge',
  'workedInPrgressSignSculptureLarge',
  'worldGlobeSmall',
] as const

export type RemoteIllustrationName = (typeof remoteIllustrationNames)[number]

export const remoteIllustrationUrls = {
  bellPaintingSmall: buildCategoryIllustrationUrl('bellPaintingSmall.png'),
  birthdayCake: buildCategoryIllustrationUrl('birthdayCake.png'),
  blockedPaintingLarge: buildCategoryIllustrationUrl('blockedPaintingLarge.png'),
  brokenBellSmall: buildCategoryIllustrationUrl('brokenBellSmall.png'),
  brokenDinosaurSkeletonLarge: buildCategoryIllustrationUrl('brokenDinosaurSkeletonLarge.png'),
  cryingManPaintingLarge: buildCategoryIllustrationUrl('cryingManPaintingLarge.png'),
  disconnectedCableStickManLarge: buildCategoryIllustrationUrl(
    'disconnectedCableStickManLarge.png'
  ),
  emptyDigitalWindowLarge: buildCategoryIllustrationUrl('emptyDigitalWindowLarge.png'),
  emptyWalletLarge: buildCategoryIllustrationUrl('emptyWalletLarge.png'),
  emptyWalletSmall: buildCategoryIllustrationUrl('emptyWalletSmall.png'),
  heartMosaicSmall: buildCategoryIllustrationUrl('heartMosaicSmall.png'),
  hourglass: buildCategoryIllustrationUrl('hourglass.png'),
  mailBoxSendingLarge: buildCategoryIllustrationUrl('mailBoxSendingLarge.png'),
  mobileDeviceAndParameters: buildCategoryIllustrationUrl('mobileDeviceAndParameters.png'),
  oldMegaphone: buildCategoryIllustrationUrl('oldMegaphone.png'),
  questioningKnightLarge: buildCategoryIllustrationUrl('questioningKnightLarge.png'),
  questioningKnightSmall: buildCategoryIllustrationUrl('questioningKnightSmall.png'),
  ratingHandsSmall: buildCategoryIllustrationUrl('ratingHandsSmall.png'),
  ringingBellSmall: buildCategoryIllustrationUrl('ringingBellSmall.png'),
  sculptureMagnifyingGlassPaperLarge: buildCategoryIllustrationUrl(
    'sculptureMagnifyingGlassPaperLarge.png'
  ),
  sculptureMagnifyingGlassPaperSmall: buildCategoryIllustrationUrl(
    'sculptureMagnifyingGlassPaperSmall.png'
  ),
  signingDocumentPaintingLarge: buildCategoryIllustrationUrl('signingDocumentPaintingLarge.png'),
  stressedKnightLarge: buildCategoryIllustrationUrl('stressedKnightLarge.png'),
  trashMosaic: buildCategoryIllustrationUrl('trashMosaic.png'),
  validStampMosaïcLarge: buildCategoryIllustrationUrl('validStampMosaïcLarge.png'),
  workedInPrgressSignSculptureLarge: buildCategoryIllustrationUrl(
    'workedInPrgressSignSculptureLarge.png'
  ),
  worldGlobeSmall: buildCategoryIllustrationUrl('worldGlobeSmall.png'),
} as const satisfies Record<RemoteIllustrationName, string>
