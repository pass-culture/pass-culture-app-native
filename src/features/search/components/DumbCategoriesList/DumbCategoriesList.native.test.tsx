import React from 'react'

import { DumbCategoriesList } from 'features/search/components/DumbCategoriesList/DumbCategoriesList'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { render, screen } from 'tests/utils'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

const fixtureSortedCategories = [
  {
    label: 'Concerts & festivals',
    textColor: ColorsEnum.LILAC_DARK,
    position: 1,
    gradients: [ColorsEnum.GOLD, ColorsEnum.GOLD_DARK],
    onPress: jest.fn(),
    fillColor: ColorsEnum.GOLD_LIGHT_100,
    borderColor: ColorsEnum.GOLD_LIGHT_200,
  },
  {
    label: 'Cinéma',
    textColor: ColorsEnum.SKY_BLUE_DARK,
    position: 2,
    gradients: [ColorsEnum.AQUAMARINE, ColorsEnum.AQUAMARINE_DARK],
    onPress: jest.fn(),
    fillColor: ColorsEnum.CORAL_LIGHT,
    borderColor: ColorsEnum.CORAL,
  },
]

const initialProps = {
  sortedCategories: fixtureSortedCategories,
  showVenueMapLocationModal: jest.fn(),
  venueMapLocationModalVisible: false,
  hideVenueMapLocationModal: jest.fn(),
  shouldDisplayVenueMap: false,
  isMapWithoutPositionAndNotLocated: false,
}

describe('DumbCategoriesList', () => {
  beforeEach(() =>
    setFeatureFlags([
      RemoteStoreFeatureFlags.WIP_VENUE_MAP,
      RemoteStoreFeatureFlags.WIP_APP_V2_VENUE_MAP_BLOCK,
    ])
  )

  it('should not display venue map block when shouldDisplayVenueMap and isMapWithoutPositionAndNotLocated are false', async () => {
    render(
      <DumbCategoriesList
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
  ])('should  display venue map block', async (props) => {
    render(<DumbCategoriesList {...initialProps} {...props} />)

    expect(screen.getByText('Explore la carte')).toBeOnTheScreen()
  })

  it('should display categories', async () => {
    render(<DumbCategoriesList {...initialProps} />)

    expect(screen.getByText('Cinéma'.toUpperCase())).toBeOnTheScreen()
  })
})
