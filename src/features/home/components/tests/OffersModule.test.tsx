import mockdate from 'mockdate'
import React from 'react'
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'

import { formatAlgoliaHit } from 'features/home/pages/useHomeAlgoliaModules'
import { mockedAlgoliaResponse } from 'libs/algolia/mockedResponses/mockedAlgoliaResponse'
import { analytics } from 'libs/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { flushAllPromises, act, fireEvent, render } from 'tests/utils'
import { ColorsEnum } from 'ui/theme'

import { AlgoliaParametersFields, DisplayParametersFields } from '../../contentful/contentful'
import { OffersModule } from '../OffersModule'

mockdate.set(new Date(2020, 10, 16))

const props = {
  algolia: {} as AlgoliaParametersFields,
  display: {
    minOffers: 0,
    title: 'Module title',
    layout: 'one-item-medium',
  } as DisplayParametersFields,
  hits: mockedAlgoliaResponse.hits.map(formatAlgoliaHit),
  nbHits: mockedAlgoliaResponse.nbHits,
  cover: null,
  position: null,
}

const nativeEventMiddle = {
  layoutMeasurement: { width: 1000 },
  contentOffset: { x: 400 }, // how far did we scroll
  contentSize: { width: 1600 },
} as NativeSyntheticEvent<NativeScrollEvent>['nativeEvent']
const nativeEventEnd = {
  layoutMeasurement: { width: 1000 },
  contentOffset: { x: 900 },
  contentSize: { width: 1600 },
} as NativeSyntheticEvent<NativeScrollEvent>['nativeEvent']

describe('OffersModule component', () => {
  it('should render correctly - with black title', () => {
    const component = render(reactQueryProviderHOC(<OffersModule {...props} index={1} />))
    expect(component).toMatchSnapshot()
    expect(component.getByTestId('moduleTitle').props.color).toBe(ColorsEnum.BLACK)
  })
  it('should render with white title if first module displayed', async () => {
    const component = render(reactQueryProviderHOC(<OffersModule {...props} index={0} />))
    expect(component.getByTestId('moduleTitle').props.color).toBe(ColorsEnum.WHITE)
  })
})

describe('OffersModule component - Analytics', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })
  it('should not trigger logEvent "AllTilesSeen" when reaching the middle', async () => {
    const component = render(reactQueryProviderHOC(<OffersModule {...props} index={1} />))
    const scrollView = component.getByTestId('offersModuleList')

    await act(async () => {
      await scrollView.props.onScroll({ nativeEvent: nativeEventMiddle })
      await flushAllPromises()
    })

    expect(analytics.logAllTilesSeen).not.toHaveBeenCalled()
  })

  it('should trigger logEvent "AllTilesSeen" when reaching the end of the module', async () => {
    const component = render(reactQueryProviderHOC(<OffersModule {...props} index={1} />))
    const scrollView = component.getByTestId('offersModuleList')

    await act(async () => {
      await scrollView.props.onScroll({ nativeEvent: nativeEventEnd })
      await flushAllPromises()
    })

    expect(analytics.logAllTilesSeen).toHaveBeenCalledWith(props.display.title, props.nbHits)
  })

  it('should trigger logEvent "AllTilesSeen" only once', async () => {
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

  it('should trigger logEvent "AllTilesSeen" with algolia title if no display.title', async () => {
    const component = render(
      reactQueryProviderHOC(
        <OffersModule
          {...props}
          algolia={{ ...props.algolia, title: 'Algolia title' }}
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

    expect(analytics.logAllTilesSeen).toHaveBeenCalledWith('Algolia title', props.nbHits)
  })

  it('should trigger logEvent "SeeMoreHasBeenClicked" when we click on See More', async () => {
    const component = render(
      reactQueryProviderHOC(<OffersModule {...props} nbHits={10} index={1} />)
    )

    await act(async () => {
      fireEvent.press(component.getByText('En voir plus'))
      await flushAllPromises()
    })

    expect(analytics.logClickSeeMore).toHaveBeenCalledWith('Module title')
  })
})
