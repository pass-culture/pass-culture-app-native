import React from 'react'

import {
  AccessibilityActionPlanSection,
  AccessibilityActionPlanSectionProps,
} from 'features/profile/components/AccessibilityActionPlanSection/AccessibilityActionPlanSection'
import { render, screen } from 'tests/utils'
import { TagVariant } from 'ui/components/Tag/types'
import { Typo } from 'ui/theme'

describe('<AccessibilityActionPlanSection />', () => {
  const defaultProps: AccessibilityActionPlanSectionProps = {
    title: 'Plan d’accessibilité',
    items: [
      {
        text: 'Toto',
        tag: { label: 'Réalisé', variant: TagVariant.SUCCESS },
      },
      {
        text: 'Tutu',
        tag: { label: 'En cours', variant: TagVariant.WARNING },
        customContent: <Typo.Body testID="custom-content">Lien externe</Typo.Body>,
      },
    ],
  }

  it('should render the section title', () => {
    render(<AccessibilityActionPlanSection {...defaultProps} />)

    expect(screen.getByText(defaultProps.title)).toBeOnTheScreen()
  })

  it('should render all list items with correct text and tags', () => {
    render(<AccessibilityActionPlanSection {...defaultProps} />)

    expect(screen.getByText(/Toto/)).toBeOnTheScreen()
    expect(screen.getByText(/Tutu/)).toBeOnTheScreen()
    expect(screen.getByText('Réalisé')).toBeOnTheScreen()
    expect(screen.getByText('En cours')).toBeOnTheScreen()
  })

  it('should render customContent when provided', () => {
    render(<AccessibilityActionPlanSection {...defaultProps} />)

    expect(screen.getByTestId('custom-content')).toBeOnTheScreen()
    expect(screen.getByText('Lien externe')).toBeOnTheScreen()
  })
})
