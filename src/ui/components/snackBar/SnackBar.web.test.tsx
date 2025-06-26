import React from 'react'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { render, screen } from 'tests/utils/web'
import { theme } from 'theme'
import { Check } from 'ui/svg/icons/Check'

import { SnackBar } from './SnackBar'
import { SnackBarHelperSettings } from './types'

describe('SnackBar Component', () => {
  it('should render the content container when visible=true', async () => {
    render(renderHelperSnackBar(true, { message: 'message' }))

    expect(screen.getByRole(AccessibilityRole.STATUS)).toBeInTheDocument()
    expect(screen.getByTestId('snackbar-container')).toBeInTheDocument()
  })

  it('should render the content container when visible=false (for accessibility updates)', async () => {
    render(renderHelperSnackBar(false, { message: 'message' }))

    expect(screen.getByRole(AccessibilityRole.STATUS)).toBeInTheDocument()
    expect(screen.getByTestId('snackbar-container')).toBeInTheDocument()
  })
})

function renderHelperSnackBar(visible: boolean, props: SnackBarHelperSettings, refresher = 1) {
  return (
    <SnackBar
      visible={visible}
      message={props.message}
      icon={Check}
      onClose={props.onClose}
      timeout={props.timeout}
      backgroundColor={theme.designSystem.color.background.brandPrimary}
      progressBarColor={theme.designSystem.color.background.brandSecondary}
      color="inverted"
      refresher={refresher}
      animationDuration={props.animationDuration}
    />
  )
}
