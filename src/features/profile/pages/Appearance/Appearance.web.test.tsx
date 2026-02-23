import React from 'react'

import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { checkAccessibilityFor, render, screen } from 'tests/utils/web'

import { Appearance } from './Appearance'

jest.mock('ui/theme/customFocusOutline/customFocusOutline')

describe('Appearance', () => {
  it('should not have basic accessibility issues', async () => {
    const { container } = renderAppearance()
    const results = await checkAccessibilityFor(container)

    expect(results).toHaveNoViolations()
  })

  it('should not display orientation toggle', () => {
    renderAppearance()

    const rotationTitle = screen.queryByText('Permettre l’orientation')

    expect(rotationTitle).not.toBeInTheDocument()
  })
})

const renderAppearance = () => render(reactQueryProviderHOC(<Appearance />))
