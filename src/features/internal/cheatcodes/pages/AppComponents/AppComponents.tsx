import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { DEFAULT_SELECTED_DATE, MAXIMUM_DATE, MINIMUM_DATE } from 'features/auth/fixtures/fixtures'
import { Accordion } from 'ui/components/Accordion'
import { DateInput } from 'ui/components/inputs/DateInput/DateInput'
import { useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { getSpacing, Spacer, TypoDS } from 'ui/theme'

export const AppComponents: FunctionComponent = () => {
  return (
    <SecondaryPageWithBlurHeader title="App components">
      <Accordion title="Inputs">
        <DateInput
          date={DEFAULT_SELECTED_DATE}
          minimumDate={MINIMUM_DATE}
          maximumDate={MAXIMUM_DATE}
          onChange={() => 'doNothing'}
        />
      </Accordion>

      <Divider />

      <Accordion title="SnackBar">
        <SnackBars />
      </Accordion>

      <Divider />

      <Spacer.Column numberOfSpaces={5} />
      <Spacer.BottomScreen />
    </SecondaryPageWithBlurHeader>
  )
}

const Divider = styled.View(({ theme }) => ({
  height: getSpacing(2),
  backgroundColor: theme.colors.greyLight,
}))

const SnackBars = () => {
  const { showInfoSnackBar, showSuccessSnackBar, showErrorSnackBar, hideSnackBar } =
    useSnackBarContext()

  const snackbars = [
    {
      title: '✅ Success SnackBar',
      showSnackBar: showSuccessSnackBar,
      message: 'This was a success\u00a0!!! '.repeat(5),
      timeout: 5000,
    },
    {
      title: '❌ Error SnackBar',
      showSnackBar: showErrorSnackBar,
      message: 'There was an error\u00a0!',
      timeout: 5000,
      onClose: hideSnackBar,
    },
    {
      title: 'ℹ️ Info SnackBar',
      showSnackBar: showInfoSnackBar,
      message: 'Hello, for your information...',
      timeout: 10000,
    },
  ]

  return (
    <React.Fragment>
      {snackbars.map(({ title, showSnackBar, ...settings }) => (
        <React.Fragment key={title}>
          <TouchableOpacity onPress={() => showSnackBar(settings)}>
            <TypoDS.Title4>{title}</TypoDS.Title4>
          </TouchableOpacity>
          <Spacer.Column numberOfSpaces={1} />
        </React.Fragment>
      ))}
    </React.Fragment>
  )
}
