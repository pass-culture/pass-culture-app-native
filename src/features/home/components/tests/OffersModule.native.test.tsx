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
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { flushAllPromises, act, fireEvent, render } from 'tests/utils'
import { ColorsEnum } from 'ui/theme'

import { OffersModule } from '../OffersModule'

mockdate.set(new Date(2020, 10, 16))

const props = {
  search: {} as SearchParametersFields,
  display: {
    minOffers: 0,
    title: 'Module title',
    layout: 'one-item-medium',
  } as DisplayParametersFields,
  hits: mockedAlgoliaResponse.hits.map(transformHit('fakeUrlPrefix')) as SearchHit[],
  nbHits: mockedAlgoliaResponse.nbHits,
  cover: null,
  position: null,
}

const nativeEventEnd = {
  layoutMeasurement: { width: 1000 },
  contentOffset: { x: 900 },
  contentSize: { width: 1600 },
} as NativeSyntheticEvent<NativeScrollEvent>['nativeEvent']

describe('OffersModule component', () => {
  it('should render correctly - with black title', () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const component = render(reactQueryProviderHOC(<OffersModule {...props} index={1} />))
    expect(component).toMatchSnapshot()
    expect(component.getByTestId('playlistTitle').props.color).toBe(ColorsEnum.BLACK)
  })
  it('should render with white title if first module displayed', async () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const component = render(reactQueryProviderHOC(<OffersModule {...props} index={0} />))
    expect(component.getByTestId('playlistTitle').props.color).toBe(ColorsEnum.WHITE)
  })
})

describe('OffersModule component - Analytics', () => {
  afterEach(jest.resetAllMocks)

  it('should trigger logEvent "AllTilesSeen" only once', async () => {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    const component = render(reactQueryProviderHOC(<OffersModule {...props} index={1} />))
    const scrollView = component.getByTestId('offersModuleList')

    await act(async () => {
      // 1st scroll to last item => trigger
      await scrollView.props.onScroll({ nativeEvent: nativeEventEnd })
      await flushAllPromises()
    })
    expect(analytics.logAllTilesSeen).toHaveBeenCalledWith(props.display.title, props.nbHits)
    expect(analytics.logAllTilesSeen).toHaveBeenCalledTimes(1)

    scrollView.props.onScroll({ nativeEvent: nativeEventEnd })
    expect(analytics.logAllTilesSeen).toHaveBeenCalledTimes(1)
  })

  it('should trigger logEvent "AllTilesSeen" with module title if no display.title', async () => {
    const component = render(
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      reactQueryProviderHOC(
        <OffersModule
          {...props}
          search={{ ...props.search, title: 'Search title' }}
          display={{ ...props.display, title: '' }}
          index={1}
        />
      )
    )
    const scrollView = component.getByTestId('offersModuleList')

    await act(async () => {
      await scrollView.props.onScroll({ nativeEvent: nativeEventEnd })
      await flushAllPromises()
    })

    expect(analytics.logAllTilesSeen).toHaveBeenCalledWith('Search title', props.nbHits)
  })

  it('should trigger logEvent "SeeMoreHasBeenClicked" when we click on See More', async () => {
    const component = render(
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      reactQueryProviderHOC(<OffersModule {...props} nbHits={10} index={1} />)
    )

    await act(async () => {
      fireEvent.press(component.getByText('En voir plus'))
      await flushAllPromises()
    })

    expect(analytics.logClickSeeMore).toHaveBeenCalledWith('Module title')
  })
})
