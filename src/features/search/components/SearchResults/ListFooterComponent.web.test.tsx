import React from 'react'

import { mockedAlgoliaResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { fireEvent, render, screen } from 'tests/utils/web'

import { ListFooterComponent, ListFooterComponentProps } from './ListFooterComponent'

const defaultProps: ListFooterComponentProps = {
  isFetchingNextPage: false,
  hits: mockedAlgoliaResponse.hits,
  nbHits: mockedAlgoliaResponse.nbHits,
  autoScrollEnabled: false,
  onPress: jest.fn(),
}

describe('ListFooterComponent', () => {
  it('should render without "Afficher plus de résultats" button when autoScrollEnabled is true', () => {
    render(<ListFooterComponent {...defaultProps} autoScrollEnabled />)

    expect(screen.queryByText('Afficher plus de résultats')).toBeNull()
  })

  it('should render with "Afficher plus de résultats" button when autoScrollEnabled is false and hits are less than nbHits', () => {
    const props: ListFooterComponentProps = {
      ...defaultProps,
      autoScrollEnabled: false,
      nbHits: 5,
    }

    render(<ListFooterComponent {...props} />)

    expect(screen.getByText('Afficher plus de résultats')).toBeTruthy()
  })

  it('should call onEndReached when "Afficher plus de résultats" button is pressed', () => {
    const onPressMock = jest.fn()

    const props: ListFooterComponentProps = {
      ...defaultProps,
      autoScrollEnabled: false,
      nbHits: 5,
      onPress: onPressMock,
    }

    render(<ListFooterComponent {...props} />)

    fireEvent.click(screen.getByText('Afficher plus de résultats'))

    expect(onPressMock).toBeTruthy()
  })

  it('should not render "Afficher plus de résultats" button when hits are equal to nbHits', () => {
    const props: ListFooterComponentProps = {
      ...defaultProps,
      autoScrollEnabled: false,
      nbHits: 4,
    }

    render(<ListFooterComponent {...props} />)

    expect(screen.queryByText('Afficher plus de résultats')).toBeNull()
  })

  it('should render the activity indicator and footer when isFetchingNextPage is true and hits are less than nbHits', () => {
    const props: ListFooterComponentProps = {
      ...defaultProps,
      isFetchingNextPage: true,
      nbHits: 5,
    }

    render(<ListFooterComponent {...props} />)

    expect(screen.getByTestId('activity-indicator')).toBeTruthy()
    expect(screen.getByTestId('footer')).toBeTruthy()
  })

  it('should not render the activity indicator and footer when isFetchingNextPage is true and hits are equal to nbHits', () => {
    const props: ListFooterComponentProps = {
      ...defaultProps,
      isFetchingNextPage: true,
      nbHits: 4,
    }

    render(<ListFooterComponent {...props} />)

    expect(screen.queryByTestId('activity-indicator')).toBeNull()
  })
})
