import React from 'react'

import { render, screen } from 'tests/utils'

import { PageNotFound } from './PageNotFound'

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('<PageNotFound/>', () => {
  it('should render correctly', () => {
    render(<PageNotFound />)

    expect(screen).toMatchSnapshot()
  })
})
