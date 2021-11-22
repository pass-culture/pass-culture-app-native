import React from 'react'
import waitForExpect from 'wait-for-expect'

import { CityModal } from 'features/identityCheck/pages/profile/CityModal'
import { mockedCitiesResult } from 'libs/place/fixtures/mockedSuggestedCities'
import { fireEvent, render } from 'tests/utils'

const onSubmit = jest.fn()
const onClose = jest.fn()

describe('<CityModal/>', () => {
  it('should render correctly', () => {
    const renderAPI = render(
      <CityModal cities={mockedCitiesResult} isVisible={true} onSubmit={onSubmit} close={onClose} />
    )
    expect(renderAPI).toMatchSnapshot()
  })

  it('should called onSubmit with the city informations when clicking on a city name', async () => {
    const { getByText } = render(
      <CityModal cities={mockedCitiesResult} isVisible={true} onSubmit={onSubmit} close={onClose} />
    )
    fireEvent.press(getByText('Paris'))
    await waitForExpect(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1)
      expect(onSubmit).toHaveBeenCalledWith({ code: '75000', name: 'Paris', postalCode: '75000' })
    })
  })

  it('should close modal when clicking on backdrop', () => {
    const { getByText } = render(
      <CityModal cities={mockedCitiesResult} isVisible={true} onSubmit={onSubmit} close={onClose} />
    )
    fireEvent.press(getByText('Annuler'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
