import React from 'react'

import { render, screen } from 'tests/utils'

import { NoSearchResult } from './NoSearchResult'

describe('NoSearchResult', () => {
  it('should render properly', () => {
    renderNoSearchResult({})

    expect(screen.getByText('Pas de résultat')).toBeOnTheScreen()
  })
})

const renderNoSearchResult = ({
  title = 'Pas de résultat',
  subtitle = 'subtitle',
  errorDescription = 'error description',
  ctaWording = 'cta wording',
  onPress = jest.fn(),
}) => {
  render(
    <NoSearchResult
      title={title}
      subtitle={subtitle}
      errorDescription={errorDescription}
      ctaWording={ctaWording}
      onPress={onPress}
    />
  )
}
