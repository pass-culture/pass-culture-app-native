import React from 'react'

import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { fireEvent, render, screen } from 'tests/utils/web'

import { SearchListFooter, SearchListFooterProps } from './SearchListFooter.web'

const defaultProps: SearchListFooterProps = {
  isFetchingNextPage: false,
  nbLoadedHits: mockedAlgoliaResponse.hits.length,
  nbHits: mockedAlgoliaResponse.nbHits,
  autoScrollEnabled: false,
  onPress: jest.fn(),
}

describe('SearchListFooter', () => {
  it('should render without "Afficher plus de résultats" button when autoScrollEnabled is true', () => {
    render(<SearchListFooter {...defaultProps} autoScrollEnabled />)

    expect(screen.queryByText('Afficher plus de résultats')).not.toBeInTheDocument()
  })

  it('should render with "Afficher plus de résultats" button when autoScrollEnabled is false and hits are less than nbHits', () => {
    const props: SearchListFooterProps = {
      ...defaultProps,
      autoScrollEnabled: false,
      nbHits: 5,
    }

    render(<SearchListFooter {...props} />)

    expect(screen.getByText('Afficher plus de résultats')).toBeInTheDocument()
  })

  it('should call onEndReached when "Afficher plus de résultats" button is pressed', () => {
    const onPressMock = jest.fn()

    const props: SearchListFooterProps = {
      ...defaultProps,
      autoScrollEnabled: false,
      nbHits: 5,
      onPress: onPressMock,
    }

    render(<SearchListFooter {...props} />)

    fireEvent.click(screen.getByText('Afficher plus de résultats'))

    expect(onPressMock).toBeTruthy()
  })

  it('should not render "Afficher plus de résultats" button when hits are equal to nbHits', () => {
    const props: SearchListFooterProps = {
      ...defaultProps,
      autoScrollEnabled: false,
      nbHits: 4,
    }

    render(<SearchListFooter {...props} />)

    expect(screen.queryByText('Afficher plus de résultats')).not.toBeInTheDocument()
  })

  it('should render the activity indicator and footer when isFetchingNextPage is true and hits are less than nbHits', () => {
    const props: SearchListFooterProps = {
      ...defaultProps,
      isFetchingNextPage: true,
      nbHits: 5,
    }

    render(<SearchListFooter {...props} />)

    expect(screen.getByTestId('activity-indicator')).toBeInTheDocument()
    expect(screen.getByTestId('footer')).toBeInTheDocument()
  })

  it('should not render the activity indicator and footer when isFetchingNextPage is true and hits are equal to nbHits', () => {
    const props: SearchListFooterProps = {
      ...defaultProps,
      isFetchingNextPage: true,
      nbHits: 4,
    }

    render(<SearchListFooter {...props} />)

    expect(screen.queryByTestId('activity-indicator')).not.toBeInTheDocument()
  })
})
