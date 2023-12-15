import React from 'react'

import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { fireEvent, render, screen } from 'tests/utils/web'

import { ContactBlock } from './ContactBlockNew'

const openUrlSpy = jest.spyOn(NavigationHelpers, 'openUrl')

describe('<ContactBlock/>', () => {
  it('should match snapshot', () => {
    const { container } = render(<ContactBlock venue={venueResponseSnap} />)

    expect(container).toMatchSnapshot()
  })

  it('should navigate to mail when clicking on email', () => {
    render(<ContactBlock venue={venueResponseSnap} />)

    fireEvent.click(screen.getByText('contact@venue.com'))

    expect(openUrlSpy).toHaveBeenCalledWith('mailto:contact@venue.com', undefined, true)
  })

  it('should navigate to tel when clicking on phoneNumber', () => {
    render(<ContactBlock venue={venueResponseSnap} />)

    fireEvent.click(screen.getByText('+33102030405'))

    expect(openUrlSpy).toHaveBeenCalledWith('tel:+33102030405', undefined, true)
  })

  it('should navigate to website when clicking on website adress', () => {
    render(<ContactBlock venue={venueResponseSnap} />)

    fireEvent.click(screen.getByText('https://my@website.com'))

    expect(openUrlSpy).toHaveBeenCalledWith('https://my@website.com', undefined, true)
  })
})
