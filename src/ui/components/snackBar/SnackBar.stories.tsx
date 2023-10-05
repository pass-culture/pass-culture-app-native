import { ComponentStory, ComponentMeta } from '@storybook/react'
import React, { FunctionComponent } from 'react'
import { Button } from 'react-native'

import { computedTheme } from 'tests/computedTheme'

import { mapSnackBarTypeToStyle } from './mapSnackBarTypeToStyle'
import { SnackBar, SnackBarProps } from './SnackBar'
import { SnackBarProvider, useSnackBarContext } from './SnackBarContext'
import { SnackBarType } from './types'

const meta: ComponentMeta<typeof SnackBar> = {
  title: 'ui/SnackBar',
  component: SnackBar,
}
export default meta

const Template: ComponentStory<typeof SnackBar> = (props) => <SnackBar {...props} />

export const Simple = Template.bind({})
Simple.args = {
  visible: true,
  message: 'Une petite snackbar standard',
  backgroundColor: computedTheme.colors.primary,
  progressBarColor: computedTheme.colors.white,
  color: computedTheme.colors.white,
}

export const Success = Template.bind({})
Success.args = {
  ...mapSnackBarTypeToStyle(computedTheme, SnackBarType.SUCCESS),
  visible: true,
  message: 'Une petite snackbar de succès',
}

export const Info = Template.bind({})
Info.args = {
  ...mapSnackBarTypeToStyle(computedTheme, SnackBarType.INFO),
  visible: true,
  message: 'Une petite snackbar d’info',
}

export const InError = Template.bind({})
InError.args = {
  ...mapSnackBarTypeToStyle(computedTheme, SnackBarType.ERROR),
  visible: true,
  message: 'Une petite snackbar d’erreur',
}

const SnackBarButton: FunctionComponent<SnackBarProps> = (props) => {
  const { showSuccessSnackBar, hideSnackBar } = useSnackBarContext()
  return (
    <Button
      title="Press here"
      onPress={() => showSuccessSnackBar({ ...props, onClose: hideSnackBar })}
      color="green"
    />
  )
}
export const SuccessWithTimeout: ComponentStory<typeof SnackBar> = (props) => (
  <SnackBarProvider>
    <SnackBarButton {...props} />
  </SnackBarProvider>
)

SuccessWithTimeout.args = {
  message: 'You pressed me',
  timeout: 3000,
}
