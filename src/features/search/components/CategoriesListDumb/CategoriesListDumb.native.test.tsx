import React, { ComponentProps } from 'react'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { CategoriesListDumb } from 'features/search/components/CategoriesListDumb/CategoriesListDumb'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { render, screen } from 'tests/utils'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

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
    textColor: ColorsEnum.LILAC_DARK,
    fillColor: ColorsEnum.GOLD_LIGHT_100,
    borderColor: ColorsEnum.GOLD_LIGHT_200,
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
    textColor: ColorsEnum.SKY_BLUE_DARK,
    fillColor: ColorsEnum.CORAL_LIGHT,
    borderColor: ColorsEnum.CORAL,
  },
]

const initialProps: ComponentProps<typeof CategoriesListDumb> = {
  sortedCategories: fixtureSortedCategories,
  showVenueMapLocationModal: jest.fn(),
  venueMapLocationModalVisible: false,
  hideVenueMapLocationModal: jest.fn(),
  shouldDisplayVenueMap: false,
  isMapWithoutPositionAndNotLocated: false,
}

describe('CategoriesListDumb', () => {
  beforeEach(() =>
    setFeatureFlags([
      RemoteStoreFeatureFlags.WIP_VENUE_MAP,
      RemoteStoreFeatureFlags.WIP_APP_V2_VENUE_MAP_BLOCK,
    ])
  )

  it('should not display venue map block when shouldDisplayVenueMap and isMapWithoutPositionAndNotLocated are false', async () => {
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
  ])('should display venue map block', async (props) => {
    render(<CategoriesListDumb {...initialProps} {...props} />)

    expect(screen.getByText('Explore la carte')).toBeOnTheScreen()
  })

  it('should display categories', async () => {
    render(<CategoriesListDumb {...initialProps} />)

    expect(screen.getByText('Cinéma'.toUpperCase())).toBeOnTheScreen()
  })
})
