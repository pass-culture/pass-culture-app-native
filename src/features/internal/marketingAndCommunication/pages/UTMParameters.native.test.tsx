import React from 'react'

import { UTMParameters } from 'features/internal/marketingAndCommunication/pages/UTMParameters'
import { render, screen } from 'tests/utils'

describe('<UTMParameters />', () => {
  it('should render correctly', async () => {
    render(<UTMParameters />)
    await screen.findByText('UTM parameters')
    expect(screen).toMatchSnapshot()
  })
})
