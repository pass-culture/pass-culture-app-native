import { computeHeaderImageHeight } from 'features/bookings/helpers/computeHeaderImageHeight'

jest.mock('libs/firebase/analytics/analytics')

describe('computeHeaderImageHeight', () => {
  it.each`
    topBlockHeight | windowHeight | display      | isAndroid | expectedHeaderImageHeight | expectedScrollContentHeight
    ${120}         | ${780}       | ${'punched'} | ${false}  | ${236}                    | ${484}
    ${120}         | ${780}       | ${'full'}    | ${false}  | ${280}                    | ${484}
    ${120}         | ${780}       | ${'punched'} | ${true}   | ${268}                    | ${484}
    ${120}         | ${780}       | ${'full'}    | ${true}   | ${312}                    | ${484}
  `(
    'should return headerImageHeight:$expectedHeaderImageHeight and scrollContentHeight:$expectedScrollContentHeight for computeHeaderImageHeight({topBlockHeight:$topBlockHeight, windowHeight:$windowHeight, display:$display, isAndroid:$isAndroid})',
    ({
      topBlockHeight,
      windowHeight,
      display,
      expectedHeaderImageHeight,
      isAndroid,
      expectedScrollContentHeight,
    }) => {
      const { headerImageHeight, scrollContentHeight } = computeHeaderImageHeight({
        topBlockHeight,
        windowHeight,
        display,
        isAndroid,
        ticketFullMiddleHeight: 32,
        extraAndroidMargin: 32,
      })

      expect(headerImageHeight).toEqual(expectedHeaderImageHeight)
      expect(scrollContentHeight).toEqual(expectedScrollContentHeight)
    }
  )
})
