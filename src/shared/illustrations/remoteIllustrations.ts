import { buildCategoryIllustrationUrl } from 'shared/illustrations/buildCategoryIllustrationUrl'

export type RemoteIllustrationName =
  | 'bellPaintingSmall'
  | 'birthdayCake'
  | 'blockedPaintingLarge'
  | 'brokenBellSmall'
  | 'brokenDinosaurSkeletonLarge'
  | 'brokenRobotLarge'
  | 'cryingManPaintingLarge'
  | 'cubistGuyWarningSignLarge'
  | 'disconnectedCableStickManLarge'
  | 'emptyHeartBoxLarge'
  | 'emptyDigitalWindowLarge'
  | 'emptyWalletLarge'
  | 'emptyWalletSmall'
  | 'heartMosaicSmall'
  | 'hourglass'
  | 'mailBoxSendingLarge'
  | 'mobileDeviceAndParameters'
  | 'oldMegaphone'
  | 'phoneHourglass'
  | 'questioningKnightLarge'
  | 'questioningKnightSmall'
  | 'ratingHandsSmall'
  | 'ringingBellSmall'
  | 'sculptureMagnifyingGlassPaperLarge'
  | 'sculptureMagnifyingGlassPaperSmall'
  | 'signingDocumentPaintingLarge'
  | 'stressedKnightLarge'
  | 'trashMosaic'
  | 'thumbUpKnightLarge'
  | 'validStampMosaïcLarge'
  | 'workedInPrgressSignSculptureLarge'
  | 'worldGlobeSmall'

export const remoteIllustrationUrls = {
  bellPaintingSmall: buildCategoryIllustrationUrl('bellPaintingSmall.png'),
  birthdayCake: buildCategoryIllustrationUrl('birthdayCake.png'),
  blockedPaintingLarge: buildCategoryIllustrationUrl('blockedPaintingLarge.png'),
  brokenBellSmall: buildCategoryIllustrationUrl('brokenBellSmall.png'),
  brokenDinosaurSkeletonLarge: buildCategoryIllustrationUrl('brokenDinosaurSkeletonLarge.png'),
  brokenRobotLarge: buildCategoryIllustrationUrl('brokenRobotLarge.png'),
  cryingManPaintingLarge: buildCategoryIllustrationUrl('cryingManPaintingLarge.png'),
  cubistGuyWarningSignLarge: buildCategoryIllustrationUrl('cubistGuyWarningSignLarge.png'),
  disconnectedCableStickManLarge: buildCategoryIllustrationUrl(
    'disconnectedCableStickManLarge.png'
  ),
  emptyDigitalWindowLarge: buildCategoryIllustrationUrl('emptyDigitalWindowLarge.png'),
  emptyHeartBoxLarge: buildCategoryIllustrationUrl('emptyHeartBoxLarge.png'),
  emptyWalletLarge: buildCategoryIllustrationUrl('emptyWalletLarge.png'),
  emptyWalletSmall: buildCategoryIllustrationUrl('emptyWalletSmall.png'),
  heartMosaicSmall: buildCategoryIllustrationUrl('heartMosaicSmall.png'),
  hourglass: buildCategoryIllustrationUrl('hourglass.png'),
  mailBoxSendingLarge: buildCategoryIllustrationUrl('mailBoxSendingLarge.png'),
  mobileDeviceAndParameters: buildCategoryIllustrationUrl('mobileDeviceAndParameters.png'),
  oldMegaphone: buildCategoryIllustrationUrl('oldMegaphone.png'),
  phoneHourglass: buildCategoryIllustrationUrl('phoneHourglass.png'),
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
  thumbUpKnightLarge: buildCategoryIllustrationUrl('thumbUpKnightLarge.png'),
  validStampMosaïcLarge: buildCategoryIllustrationUrl('validStampMosaïcLarge.png'),
  workedInPrgressSignSculptureLarge: buildCategoryIllustrationUrl(
    'workedInPrgressSignSculptureLarge.png'
  ),
  worldGlobeSmall: buildCategoryIllustrationUrl('worldGlobeSmall.png'),
} as const satisfies Record<RemoteIllustrationName, string>
