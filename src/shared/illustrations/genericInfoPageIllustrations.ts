import { buildCategoryIllustrationUrl } from 'shared/illustrations/buildCategoryIllustrationUrl'

const genericInfoPageIllustrationNames = ['emptyDigitalWindowLarge', 'emptyWalletLarge'] as const

type GenericInfoPageIllustrationName = (typeof genericInfoPageIllustrationNames)[number]

export const genericInfoPageIllustrationUrls = {
  emptyDigitalWindowLarge: buildCategoryIllustrationUrl('emptyDigitalWindowLarge.png'),
  emptyWalletLarge: buildCategoryIllustrationUrl('emptyWalletLarge.png'),
} as const satisfies Record<GenericInfoPageIllustrationName, string>
