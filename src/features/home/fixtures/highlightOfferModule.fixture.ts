import { Color, HighlightOfferModule, HomepageModuleType } from 'features/home/types'

export const highlightOfferModuleFixture: HighlightOfferModule = {
  type: HomepageModuleType.HighlightOfferModule,
  id: 'fH2FmoYeTzZPjhbz4ZHUW',
  highlightTitle: 'L’offre du moment 💥',
  displayBookingAllowedDatetime: undefined,
  offerTitle: 'We love green',
  offerId: '20859',
  offerEan: undefined,
  offerTag: undefined,
  image:
    'https://images.ctfassets.net/2bg01iqy0isv/E2HH4xFaGnqDsFffxBlvq/b997f4612a51884c7a85143122a5913e/couv_YT.jpg',
  color: Color.SkyBlue,
  isGeolocated: true,
  aroundRadius: 50,
}
