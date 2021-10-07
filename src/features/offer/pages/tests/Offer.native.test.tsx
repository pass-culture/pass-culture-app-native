import { act, fireEvent } from 'tests/utils'

import { renderOfferPage } from './renderOfferPageTestUtil'

describe('<Offer />', () => {
  // fake timers are needed to avoid warning (because we use useTrackOfferSeenDuration)
  // See https://github.com/facebook/jest/issues/6434
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  it('animates on scroll', async () => {
    const { getByTestId } = await renderOfferPage()
    expect(getByTestId('offerHeaderName').props.style.opacity).toBe(0)
    const scrollContainer = getByTestId('offer-container')
    await act(async () => await fireEvent.scroll(scrollContainer, scrollEvent))
    expect(getByTestId('offerHeaderName').props.style.opacity).toBe(1)
  })
})

const scrollEvent = {
  nativeEvent: {
    contentOffset: { y: 200 },
    layoutMeasurement: { height: 1000 },
    contentSize: { height: 1600 },
  },
}
