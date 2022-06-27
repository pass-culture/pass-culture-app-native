import React from 'react'

import { render } from 'tests/utils'

import { CategoriesButtons } from './CategoriesButtons'

describe('CategoriesButtons', () => {
  it('should display categories', () => {
    const { queryAllByRole } = render(<CategoriesButtons />)

    expect(queryAllByRole('button').length).toEqual(13)
  })
})
