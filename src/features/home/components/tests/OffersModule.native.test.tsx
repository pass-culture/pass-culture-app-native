import mockdate from 'mockdate'
import React from 'react'
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'

import {
  SearchParametersFields,
  DisplayParametersFields,
} from 'features/home/contentful/contentful'
import { mockedAlgoliaResponse } from 'libs/algolia/mockedResponses/mockedAlgoliaResponse'
import { analytics } from 'libs/analytics'
import { SearchHit, transformHit } from 'libs/search'
import { flushAllPromises, act, fireEvent, render } from 'tests/utils'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

import { OffersModule } from '../OffersModule'

mockdate.set(new Date(2020, 10, 16))

const props = {
  search: [{} as SearchParametersFields],
  display: {
    minOffers: 0,
    title: 'Module title',
    layout: 'one-item-medium',
  } as DisplayParametersFields,
  moduleId: 'fakeModuleId',
  cover: null,
  position: null,
}

const nativeEventEnd = {
  layoutMeasurement: { width: 1000 },
  contentOffset: { x: 900 },
  contentSize: { width: 1600 },
} as NativeSyntheticEvent<NativeScrollEvent>['nativeEvent']

const mockHits = mockedAlgoliaResponse.hits.map(transformHit('fakeUrlPrefix')) as SearchHit[]
let mockNbHits = mockedAlgoliaResponse.nbHits
jest.mock('features/home/pages/useOfferModule', () => ({
  useOfferModule: jest.fn(() => ({ hits: mockHits, nbHits: mockNbHits })),
}))
jest.mock('react-query')
jest.mock('features/home/api')

describe('OffersModule component', () => {
  it('should render correctly - with black title', () => {
    const component = render(<OffersModule {...props} index={1} />)
    expect(component).toMatchSnapshot()
    expect(component.getByTestId('playlistTitle').props.style[0].color).toBe(ColorsEnum.BLACK)
  })

  it('should render with white title if first module displayed', async () => {
    const component = render(<OffersModule {...props} index={0} />)
    expect(component.getByTestId('playlistTitle').props.style[0].color).toBe(ColorsEnum.WHITE)
  })
})

describe('OffersModule component - Analytics', () => {
  it('should trigger logEvent "AllTilesSeen" only once', async () => {
    const component = render(<OffersModule {...props} index={1} />)
    const scrollView = component.getByTestId('offersModuleList')

    await act(async () => {
      // 1st scroll to last item => trigger
      await scrollView.props.onScroll({ nativeEvent: nativeEventEnd })
      await flushAllPromises()
    })
    expect(analytics.logAllTilesSeen).toHaveBeenCalledWith(props.display.title, mockNbHits)
    expect(analytics.logAllTilesSeen).toHaveBeenCalledTimes(1)

    scrollView.props.onScroll({ nativeEvent: nativeEventEnd })
    expect(analytics.logAllTilesSeen).toHaveBeenCalledTimes(1)
  })

  it('should trigger logEvent "AllTilesSeen" with module title if no display.title', async () => {
    const component = render(
      <OffersModule
        {...props}
        search={[{ title: 'Search title' } as SearchParametersFields]}
        display={{ ...props.display, title: '' }}
        index={1}
      />
    )
    const scrollView = component.getByTestId('offersModuleList')

    await act(async () => {
      await scrollView.props.onScroll({ nativeEvent: nativeEventEnd })
      await flushAllPromises()
    })

    expect(analytics.logAllTilesSeen).toHaveBeenCalledWith('Search title', mockNbHits)
  })

  it('should trigger logEvent "SeeMoreHasBeenClicked" when we click on See More', () => {
    mockNbHits = 10
    const component = render(<OffersModule {...props} index={1} />)

    act(() => {
      fireEvent.press(component.getByText('En voir plus'))
    })

    expect(analytics.logClickSeeMore).toHaveBeenCalledWith('Module title')
  })
})
