import React from 'react'

import { render, screen } from 'tests/utils'

import { SelectableAsset } from './SelectableAsset'

describe('SelectableAsset', () => {
  it('renders text variant', () => {
    const textAsset = '32\u00a0€'
    render(<SelectableAsset variant="text" text={textAsset} />)

    expect(screen.getByText(textAsset)).toBeOnTheScreen()
  })

  it('renders tag variant', () => {
    render(<SelectableAsset variant="tag" tag={{ label: 'TagLabel', testID: 'tag' }} />)

    expect(screen.getByText('TagLabel')).toBeOnTheScreen()
  })
})
