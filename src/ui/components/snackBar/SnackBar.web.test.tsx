import React from 'react'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { render } from 'tests/utils/web'
import { theme } from 'theme'
import { Check } from 'ui/svg/icons/Check'

import { SnackBar } from './SnackBar'
import { SnackBarHelperSettings } from './types'

describe('SnackBar Component', () => {
  it('should render the content container when visible=true', async () => {
    const { queryByTestId, queryByRole } = render(
      renderHelperSnackBar(true, { message: 'message' })
    )
    expect(queryByRole(AccessibilityRole.STATUS)).toBeTruthy()
    expect(queryByTestId('snackbar-container')).toBeTruthy()
  })
  it('should render the content container when visible=false (for accessibility updates)', async () => {
    const { queryByTestId, queryByRole } = render(
      renderHelperSnackBar(false, { message: 'message' })
    )
    expect(queryByRole(AccessibilityRole.STATUS)).toBeTruthy()
    expect(queryByTestId('snackbar-container')).toBeTruthy()
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
      backgroundColor={theme.colors.primary}
      progressBarColor={theme.colors.secondary}
      color={theme.colors.white}
      refresher={refresher}
      animationDuration={props.animationDuration}
    />
  )
}
