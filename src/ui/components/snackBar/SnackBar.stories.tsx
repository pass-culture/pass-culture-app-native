import { ComponentStory, ComponentMeta } from '@storybook/react'
import React, { FunctionComponent } from 'react'
import { Button } from 'react-native'

// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

import { mapSnackBarTypeToStyle } from './mapSnackBarTypeToStyle'
import { SnackBar, SnackBarProps } from './SnackBar'
import { SnackBarProvider, useSnackBarContext } from './SnackBarContext'
import { SnackBarType } from './types'

export default {
  title: 'ui/SnackBar',
  component: SnackBar,
} as ComponentMeta<typeof SnackBar>

const Template: ComponentStory<typeof SnackBar> = (props) => <SnackBar {...props} />

export const Simple = Template.bind({})
Simple.args = {
  visible: true,
  message: 'Une petite snackbar standard',
  backgroundColor: ColorsEnum.PRIMARY,
  progressBarColor: ColorsEnum.WHITE,
  color: ColorsEnum.WHITE,
}

export const Success = Template.bind({})
Success.args = {
  ...mapSnackBarTypeToStyle(SnackBarType.SUCCESS),
  visible: true,
  message: 'Une petite snackbar de succès',
}

export const Info = Template.bind({})
Info.args = {
  ...mapSnackBarTypeToStyle(SnackBarType.INFO),
  visible: true,
  message: "Une petite snackbar d'info",
}

export const InError = Template.bind({})
InError.args = {
  ...mapSnackBarTypeToStyle(SnackBarType.ERROR),
  visible: true,
  message: "Une petite snackbar d'erreur",
}

const SnackBarButton: FunctionComponent<SnackBarProps> = (props) => {
  const { showSuccessSnackBar, hideSnackBar } = useSnackBarContext()
  return (
    <Button
      title={'Press here'}
      onPress={() => showSuccessSnackBar({ ...props, onClose: hideSnackBar })}
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
