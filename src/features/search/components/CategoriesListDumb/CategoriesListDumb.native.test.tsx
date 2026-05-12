import React, { ComponentProps } from 'react'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { CategoriesListDumb } from 'features/search/components/CategoriesListDumb/CategoriesListDumb'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { render, screen } from 'tests/utils'

const fixtureSortedCategories: ComponentProps<typeof CategoriesListDumb>['sortedCategories'] = [
  {
    label: 'Concerts & Festivals',
    navigateTo: {
      screen: 'TabNavigator',
      params: {
        screen: 'SearchStackNavigator',
        params: {
          screen: 'ThematicSearch',
          params: { offerCategories: SearchGroupNameEnumv2.CONCERTS_FESTIVALS },
        },
      },
    },
    searchLandingPosition: undefined,
    fillColor: 'decorative01',
    borderColor: 'decorative01',
  },
  {
    label: 'Cinéma',
    navigateTo: {
      screen: 'TabNavigator',
      params: {
        screen: 'SearchStackNavigator',
        params: {
          screen: 'ThematicSearch',
          params: { offerCategories: SearchGroupNameEnumv2.CINEMA },
        },
      },
    },
    searchLandingPosition: undefined,
    fillColor: 'decorative05',
    borderColor: 'decorative05',
  },
]

const initialProps: ComponentProps<typeof CategoriesListDumb> = {
  sortedCategories: fixtureSortedCategories,
  showVenueMapLocationModal: jest.fn(),
  venueMapLocationModalVisible: false,
  hideVenueMapLocationModal: jest.fn(),
  shouldDisplayVenueMap: false,
  isMapWithoutPositionAndNotLocated: false,
  onPressAIFakeDoorBanner: jest.fn(),
}

describe('CategoriesListDumb', () => {
  beforeEach(() => setFeatureFlags([RemoteStoreFeatureFlags.WIP_VENUE_MAP]))

  it('should not display venue map block when shouldDisplayVenueMap and isMapWithoutPositionAndNotLocated are false', () => {
    render(
      <CategoriesListDumb
        {...initialProps}
        shouldDisplayVenueMap={false}
        isMapWithoutPositionAndNotLocated={false}
      />
    )

    expect(screen.queryByText('Explore la carte')).not.toBeOnTheScreen()
  })

  it.each([
    { isMapWithoutPositionAndNotLocated: true, shouldDisplayVenueMap: true },
    { isMapWithoutPositionAndNotLocated: false, shouldDisplayVenueMap: true },
    { isMapWithoutPositionAndNotLocated: true, shouldDisplayVenueMap: false },
  ])('should display venue map block', (props) => {
    render(<CategoriesListDumb {...initialProps} {...props} />)

    expect(screen.getByText('Explore la carte')).toBeOnTheScreen()
  })

  it('should display categories', () => {
    render(<CategoriesListDumb {...initialProps} />)

    expect(screen.getByText('Cinéma'.toUpperCase())).toBeOnTheScreen()
  })

  it('should display new category blocks with split labels', () => {
    render(
      <CategoriesListDumb
        {...initialProps}
        enableNewCategoryBlocks
        sortedCategories={[
          {
            label: 'Concerts & Festivals',
            navigateTo: {
              screen: 'TabNavigator',
              params: {
                screen: 'SearchStackNavigator',
                params: {
                  screen: 'ThematicSearch',
                  params: { offerCategories: SearchGroupNameEnumv2.CONCERTS_FESTIVALS },
                },
              },
            },
            borderColor: 'brandPrimary',
            fillColor: 'information03',
            labelParts: ['Concerts', 'et festivals'],
            searchLandingPosition: undefined,
          },
        ]}
      />
    )

    expect(screen.getByText('Concerts')).toBeOnTheScreen()
    expect(screen.getByText('et festivals')).toBeOnTheScreen()
  })

  it('should display new category blocks with label parts instead of raw label', () => {
    render(
      <CategoriesListDumb
        {...initialProps}
        enableNewCategoryBlocks
        sortedCategories={[
          {
            label: 'Médias & presse',
            navigateTo: {
              screen: 'TabNavigator',
              params: {
                screen: 'SearchStackNavigator',
                params: {
                  screen: 'SearchResults',
                  params: { offerCategories: SearchGroupNameEnumv2.MEDIA_PRESSE },
                },
              },
            },
            borderColor: 'decorative01',
            fillColor: 'pending01',
            labelParts: ['Médias', 'et presse'],
            searchLandingPosition: undefined,
          },
        ]}
      />
    )

    expect(screen.getByLabelText('Catégorie Médias et presse')).toBeOnTheScreen()
    expect(screen.getByText('Médias')).toBeOnTheScreen()
    expect(screen.getByText('et presse')).toBeOnTheScreen()
    expect(screen.queryByText('Médias & presse')).not.toBeOnTheScreen()
  })

  it('should display AI fake door banner when enableAIFakeDoor FF activated', () => {
    render(<CategoriesListDumb {...initialProps} enableAIFakeDoor />)

    expect(screen.getByText('Utilise notre IA pass Culture')).toBeOnTheScreen()
  })

  it('should not display AI fake door banner when enableAIFakeDoor FF deactivated', () => {
    render(<CategoriesListDumb {...initialProps} />)

    expect(screen.queryByText('Utilise notre IA pass Culture')).not.toBeOnTheScreen()
  })
})
