import React from 'react'
import styled from 'styled-components'

import { TabLayout } from 'features/venue/components/TabLayout/TabLayout'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole.web'
import { fireEvent, render, screen } from 'tests/utils/web'
import { Typo } from 'ui/theme'

const ExampleText = styled(Typo.Body)``
const tabPanels = {
  'Offres disponibles': <ExampleText>Offres disponibles content</ExampleText>,
  'Infos pratiques': <ExampleText>Infos pratiques content</ExampleText>,
}

describe('TabLayout', () => {
  it('should navigate from first tab to second tab when hitting right arrow', () => {
    render(<TabLayout tabPanels={tabPanels} />)
    const firstTab = screen.getByRole(AccessibilityRole.TAB, { name: 'Offres disponibles' })
    const secondTab = screen.getByRole(AccessibilityRole.TAB, { name: 'Infos pratiques' })

    fireEvent.keyDown(firstTab, { key: 'ArrowRight' })

    expect(secondTab).toHaveAttribute('aria-selected', 'true')
    expect(secondTab).toHaveFocus()
    expect(firstTab).toHaveAttribute('aria-selected', 'false')
  })

  it('should navigate from second tab to first tab when hitting left arrow', () => {
    render(<TabLayout tabPanels={tabPanels} />)
    // focus second tab
    const firstTab = screen.getByRole(AccessibilityRole.TAB, { name: 'Offres disponibles' })
    fireEvent.keyDown(firstTab, { key: 'ArrowRight' })

    const secondTab = screen.getByRole(AccessibilityRole.TAB, { name: 'Infos pratiques' })
    fireEvent.keyDown(secondTab, { key: 'ArrowLeft' })

    expect(firstTab).toHaveAttribute('aria-selected', 'true')
    expect(firstTab).toHaveFocus()
    expect(secondTab).toHaveAttribute('aria-selected', 'false')
  })

  it('should navigate from first tab to last tab when hitting left arrow', () => {
    render(<TabLayout tabPanels={tabPanels} />)
    const firstTab = screen.getByRole(AccessibilityRole.TAB, { name: 'Offres disponibles' })
    const secondTab = screen.getByRole(AccessibilityRole.TAB, { name: 'Infos pratiques' })

    fireEvent.keyDown(firstTab, { key: 'ArrowLeft' })

    expect(secondTab).toHaveAttribute('aria-selected', 'true')
    expect(secondTab).toHaveFocus()
    expect(firstTab).toHaveAttribute('aria-selected', 'false')
  })

  it('should navigate from last tab to first tab when hitting right arrow', () => {
    render(<TabLayout tabPanels={tabPanels} />)
    // focus last tab
    const firstTab = screen.getByRole(AccessibilityRole.TAB, { name: 'Offres disponibles' })
    fireEvent.keyDown(firstTab, { key: 'ArrowLeft' })

    const secondTab = screen.getByRole(AccessibilityRole.TAB, { name: 'Infos pratiques' })
    fireEvent.keyDown(secondTab, { key: 'ArrowRight' })

    expect(firstTab).toHaveAttribute('aria-selected', 'true')
    expect(firstTab).toHaveFocus()
    expect(secondTab).toHaveAttribute('aria-selected', 'false')
  })
})
