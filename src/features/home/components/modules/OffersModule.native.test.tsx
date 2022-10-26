import mockdate from 'mockdate'
import React from 'react'
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'

import {
  SearchParametersFields,
  DisplayParametersFields,
  ContentTypes,
} from 'features/home/contentful/contentful'
import { mockedAlgoliaResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { analytics } from 'libs/firebase/analytics'
import { SearchHit, transformHit } from 'libs/search'
import { flushAllPromises, act, fireEvent, render } from 'tests/utils'
import { theme } from 'theme'

import { OffersModule } from './OffersModule'

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
  homeEntryId: 'fakeEntryId',
  index: 1,
}

const nativeEventEnd = {
  layoutMeasurement: { width: 1000 },
  contentOffset: { x: 900 },
  contentSize: { width: 1600 },
} as NativeSyntheticEvent<NativeScrollEvent>['nativeEvent']

const mockHits = mockedAlgoliaResponse.hits.map(transformHit('fakeUrlPrefix')) as SearchHit[]
let mockNbHits = mockedAlgoliaResponse.nbHits
jest.mock('features/home/api/useOfferModule', () => ({
  useOfferModule: jest.fn(() => ({ hits: mockHits, nbHits: mockNbHits })),
}))
jest.mock('react-query')
jest.mock('features/profile/api')

describe('OffersModule component', () => {
  it('should render correctly - with black title', () => {
    const component = render(<OffersModule {...props} index={1} />)
    expect(component).toMatchSnapshot()
    expect(component.getByTestId('playlistTitle').props.style[0].color).toBe(theme.colors.black)
  })

  it('should render with white title if first module displayed', async () => {
    const component = render(<OffersModule {...props} index={0} />)
    expect(component.getByTestId('playlistTitle').props.style[0].color).toBe(theme.colors.white)
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

  it('should trigger logEvent "ModuleDisplayedOnHomepage" when shouldModuleBeDisplayed is true', () => {
    render(<OffersModule {...props} />)

    expect(analytics.logModuleDisplayedOnHomepage).toHaveBeenNthCalledWith(
      1,
      props.moduleId,
      ContentTypes.ALGOLIA,
      props.index,
      props.homeEntryId
    )
  })

  it('should trigger logEvent "ModuleDisplayedOnHomepage" when shouldModuleBeDisplayed is false', () => {
    render(
      <OffersModule
        {...props}
        search={[{ title: 'Search title' } as SearchParametersFields]}
        display={{ ...props.display, minOffers: mockNbHits + 1 }}
        index={1}
      />
    )

    expect(analytics.logModuleDisplayedOnHomepage).not.toHaveBeenCalled()
  })

  it('should trigger logEvent "SeeMoreHasBeenClicked" when we click on See More', () => {
    mockNbHits = 10
    const component = render(<OffersModule {...props} index={1} />)

    act(() => {
      fireEvent.press(component.getByText('En voir plus'))
    })

    expect(analytics.logClickSeeMore).toHaveBeenCalledWith({
      moduleId: 'fakeModuleId',
      moduleName: 'Module title',
    })
  })
})
