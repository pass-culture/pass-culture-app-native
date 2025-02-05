import React from 'react'
import { Button } from 'react-native'

import { mockSettings } from 'features/auth/context/mockSettings'
import { render, screen } from 'tests/utils/web'

import { ChronicleOfferInfo } from './ChronicleOfferInfo.web'

mockSettings()

describe('ChronicleOfferInfo', () => {
  it('should render correctly', () => {
    render(<ChronicleOfferInfo imageUrl="http://image.jpeg" price="12€" title="lorem ipsum" />)

    expect(screen.getByText('12€')).toBeInTheDocument()
    expect(screen.getByText('lorem ipsum')).toBeInTheDocument()
    expect(screen.getByTestId('imagePlaceholder')).toBeInTheDocument()
  })

  it('should render correctly with custom children', () => {
    render(
      <ChronicleOfferInfo imageUrl="http://image.jpeg" price="12€" title="lorem ipsum">
        <Button testID="button" title="button" />
      </ChronicleOfferInfo>
    )

    expect(screen.getByText('12€')).toBeInTheDocument()
    expect(screen.getByText('lorem ipsum')).toBeInTheDocument()
    expect(screen.getByTestId('button')).toBeInTheDocument()
    expect(screen.getByTestId('imagePlaceholder')).toBeInTheDocument()
  })
})
