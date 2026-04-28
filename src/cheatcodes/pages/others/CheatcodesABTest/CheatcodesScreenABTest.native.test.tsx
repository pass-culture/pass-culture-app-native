import React from 'react'

import { abTestOverridesActions } from 'shared/useABSegment/abTestOverrideStore'
import { AB_TESTS_REGISTRY } from 'shared/useABSegment/abTestRegistry'
import { render, screen, userEvent } from 'tests/utils'

import { CheatcodesScreenABTest } from './CheatcodesScreenABTest'

const user = userEvent.setup()

describe('<CheatcodesScreenABTest/>', () => {
  beforeEach(() => {
    abTestOverridesActions.resetAll()
  })

  it('should render the registry entries', () => {
    render(<CheatcodesScreenABTest />)

    AB_TESTS_REGISTRY.forEach((test) => {
      expect(screen.getAllByText(test.label).length).toBeGreaterThan(0)
    })
  })

  it('should show "Aucun forçage" in the header when no override is set', () => {
    render(<CheatcodesScreenABTest />)

    expect(
      screen.getByText(`Aucun forçage — ${AB_TESTS_REGISTRY.length} au total`)
    ).toBeOnTheScreen()
  })

  it('should show forced count and reset button when overrides exist', () => {
    const firstTest = AB_TESTS_REGISTRY[0]
    if (!firstTest) return
    const firstSegment = firstTest.segments[0] ?? 'A'

    abTestOverridesActions.setOverride(firstTest.id, firstSegment)

    render(<CheatcodesScreenABTest />)

    expect(
      screen.getByText(`1 test forcé — ${AB_TESTS_REGISTRY.length} au total`)
    ).toBeOnTheScreen()
    expect(screen.getByText('Tout réinitialiser')).toBeOnTheScreen()
  })

  it('should force a segment in the store when pressing a variant radio', async () => {
    const firstTest = AB_TESTS_REGISTRY[0]
    if (!firstTest) return
    const variantLabel = firstTest.segments[0]
    if (!variantLabel) return

    render(<CheatcodesScreenABTest />)

    const variantElement = screen.getAllByText(variantLabel)[0]
    if (!variantElement) return
    await user.press(variantElement)

    expect(
      screen.getByText(`1 test forcé — ${AB_TESTS_REGISTRY.length} au total`)
    ).toBeOnTheScreen()
  })

  it('should reset every override when pressing the reset button', async () => {
    const firstTest = AB_TESTS_REGISTRY[0]
    if (!firstTest) return
    const firstSegment = firstTest.segments[0] ?? 'A'

    abTestOverridesActions.setOverride(firstTest.id, firstSegment)

    render(<CheatcodesScreenABTest />)
    await user.press(screen.getByText('Tout réinitialiser'))

    expect(
      screen.getByText(`Aucun forçage — ${AB_TESTS_REGISTRY.length} au total`)
    ).toBeOnTheScreen()
  })
})
