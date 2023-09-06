import mockdate from 'mockdate'
import React from 'react'
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'

import { OffersModuleParameters } from 'features/home/types'
import { transformHit } from 'libs/algolia'
import { mockedAlgoliaResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { analytics } from 'libs/analytics'
import { DisplayParametersFields, ContentTypes } from 'libs/contentful/types'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { Offer } from 'shared/offer/types'
import { act, fireEvent, render, screen } from 'tests/utils'

import { OffersModule } from './OffersModule'

mockdate.set(new Date(2020, 10, 16))

const mockHits = mockedAlgoliaResponse.hits.map(transformHit('fakeUrlPrefix')) as Offer[]
const mockNbHits = mockedAlgoliaResponse.nbHits

const props = {
  offersModuleParameters: [{} as OffersModuleParameters],
  displayParameters: {
    minOffers: 0,
    title: 'Module title',
    layout: 'one-item-medium',
  } as DisplayParametersFields,
  moduleId: 'fakeModuleId',
  cover: null,
  position: null,
  homeEntryId: 'fakeEntryId',
  index: 1,
  data: { playlistItems: mockHits, nbPlaylistResults: mockNbHits, moduleId: 'fakeModuleId' },
}

const nativeEventEnd = {
  layoutMeasurement: { width: 1000 },
  contentOffset: { x: 900 },
  contentSize: { width: 1600 },
} as NativeSyntheticEvent<NativeScrollEvent>['nativeEvent']

jest.mock('react-query')
jest.mock('features/auth/context/AuthContext')

const mockSubcategories = placeholderData.subcategories
const mockHomepageLabels = placeholderData.homepageLabels
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: {
      subcategories: mockSubcategories,
      homepageLabels: mockHomepageLabels,
    },
  }),
}))

describe('OffersModule component', () => {
  it('should render correctly', () => {
    render(<OffersModule {...props} index={1} />)
    expect(screen).toMatchSnapshot()
  })

  it('should not render if data is undefined', () => {
    render(<OffersModule {...{ ...props, data: undefined }} />)
    expect(screen.toJSON()).not.toBeOnTheScreen()
  })
})

describe('OffersModule component - Analytics', () => {
  it('should trigger logEvent "AllTilesSeen" only once', async () => {
    render(<OffersModule {...props} index={1} />)
    const scrollView = screen.getByTestId('offersModuleList')

    await act(async () => {
      // 1st scroll to last item => trigger
      await scrollView.props.onScroll({ nativeEvent: nativeEventEnd })
    })
    expect(analytics.logAllTilesSeen).toHaveBeenCalledWith({
      moduleName: props.displayParameters.title,
      numberOfTiles: mockNbHits,
    })
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
        offersModuleParameters={[{ title: 'Search title' } as OffersModuleParameters]}
        displayParameters={{ ...props.displayParameters, minOffers: mockNbHits + 1 }}
        index={1}
      />
    )

    expect(analytics.logModuleDisplayedOnHomepage).not.toHaveBeenCalled()
  })

  it('should trigger logEvent "SeeMoreHasBeenClicked" when we click on See More', () => {
    const mockData = { playlistItems: mockHits, nbPlaylistResults: 10, moduleId: 'fakeModuleId' }
    render(<OffersModule {...props} index={1} data={mockData} />)

    act(() => {
      fireEvent.press(screen.getByText('En voir plus'))
    })

    expect(analytics.logClickSeeMore).toHaveBeenCalledWith({
      moduleId: 'fakeModuleId',
      moduleName: 'Module title',
    })
  })
})
