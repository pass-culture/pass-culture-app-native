import React from 'react'

import { FILTERS_VENUE_TYPE_MAPPING } from 'features/venueMap/constant'
import { render, screen, userEvent } from 'tests/utils'

import { FilterCategoriesBannerContainer } from './FilterCategoriesBannerContainer'

describe('FilterCategoriesBannerContainer', () => {
  const user = userEvent.setup()

  it('should render correctly', async () => {
    render(<FilterCategoriesBannerContainer />)

    await screen.findAllByTestId(/[A-Z]+Label/)

    Object.keys(FILTERS_VENUE_TYPE_MAPPING).forEach((id) => {
      expect(screen.getByTestId(`${id}Label`)).toBeOnTheScreen()
    })
  })

  it.each([
    { id: 'OUTINGS', label: 'Sorties : Filtre sélectionné' },
    { id: 'SHOPS', label: 'Boutiques : Filtre sélectionné' },
    { id: 'OTHERS', label: 'Autres : Filtre sélectionné' },
  ])(`should select $id group`, async ({ id, label }) => {
    jest.useFakeTimers()
    render(<FilterCategoriesBannerContainer />)

    await user.press(screen.getByTestId(`${id}Label`))

    expect(screen.getByLabelText(label)).toBeOnTheScreen()

    jest.useRealTimers()
  })

  it('should deselect selected group', async () => {
    jest.useFakeTimers()
    render(<FilterCategoriesBannerContainer />)

    await user.press(screen.getByTestId('OUTINGSLabel'))

    await user.press(await screen.findByLabelText('Sorties : Filtre sélectionné'))

    expect(screen.queryByLabelText('Sorties : Filtre sélectionné')).not.toBeOnTheScreen()

    jest.useRealTimers()
  })
})
