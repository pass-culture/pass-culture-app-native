import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { FILTERS_ACTIVITY_MAPPING } from 'features/venueMap/constant'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

import { FilterCategoriesBannerContainer } from './FilterCategoriesBannerContainer'

describe('FilterCategoriesBannerContainer', () => {
  const user = userEvent.setup()

  it('should render correctly', async () => {
    render(reactQueryProviderHOC(<FilterCategoriesBannerContainer />))

    await screen.findAllByTestId(/[A-Z]+Label/)

    Object.keys(FILTERS_ACTIVITY_MAPPING).forEach((id) => {
      expect(screen.getByTestId(`${id}Label`)).toBeOnTheScreen()
    })
  })

  it.each([
    { id: 'OUTINGS', label: 'Sorties : Filtre sélectionné' },
    { id: 'SHOPS', label: 'Boutiques : Filtre sélectionné' },
    { id: 'OTHERS', label: 'Autres : Filtre sélectionné' },
  ])(`should select $id group`, async ({ id, label }) => {
    jest.useFakeTimers()
    render(reactQueryProviderHOC(<FilterCategoriesBannerContainer />))

    await user.press(screen.getByTestId(`${id}Label`))

    expect(screen.getByLabelText(label)).toBeOnTheScreen()

    jest.useRealTimers()
  })

  it('should deselect selected group', async () => {
    jest.useFakeTimers()
    render(reactQueryProviderHOC(<FilterCategoriesBannerContainer />))

    await user.press(screen.getByTestId('OUTINGSLabel'))

    await user.press(await screen.findByLabelText('Sorties : Filtre sélectionné'))

    expect(screen.queryByLabelText('Sorties : Filtre sélectionné')).not.toBeOnTheScreen()

    jest.useRealTimers()
  })

  it('should open venue map filters when pressing filter button', async () => {
    jest.useFakeTimers()
    render(reactQueryProviderHOC(<FilterCategoriesBannerContainer />))

    await user.press(screen.getByLabelText('Voir tous les filtres'))

    expect(navigate).toHaveBeenNthCalledWith(1, 'VenueMapFiltersStackNavigator', undefined)

    jest.useRealTimers()
  })

  it('should not display a badge with number of group filters selected when no group selected', async () => {
    render(reactQueryProviderHOC(<FilterCategoriesBannerContainer />))

    await screen.findAllByTestId(/[A-Z]+Label/)

    expect(screen.getByLabelText('Voir tous les filtres')).toBeOnTheScreen()
  })

  it('should display a badge with number of group filters selected when group selected', async () => {
    jest.useFakeTimers()
    render(reactQueryProviderHOC(<FilterCategoriesBannerContainer />))

    await user.press(screen.getByTestId('OUTINGSLabel'))

    expect(screen.getByLabelText('Voir tous les filtres\u00a0: 1 filtre actif')).toBeOnTheScreen()

    jest.useRealTimers()
  })
})
