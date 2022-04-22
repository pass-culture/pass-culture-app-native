import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { env } from 'libs/environment'
import { eventMonitoring } from 'libs/monitoring'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { padding, Spacer } from 'ui/theme'

export function Navigation(): JSX.Element {
  const { goBack } = useNavigation<UseNavigationType>()

  const { showInfoSnackBar } = useSnackBarContext()

  return (
    <ScrollView>
      <Spacer.TopScreen />
      <ModalHeader
        title="Navigation"
        leftIconAccessibilityLabel={`Revenir en arrière`}
        leftIcon={ArrowPrevious}
        onLeftIconPress={goBack}
        rightIconAccessibilityLabel={undefined}
        rightIcon={undefined}
        onRightIconPress={undefined}
      />
      <StyledContainer>
        <Row half>
          <ButtonPrimary
            wording={'Sentry'}
            onPress={() => {
              const message = `SENTRY_${env.ENV}_TEST_${uuidv4().slice(0, 5)}`.toUpperCase()
              eventMonitoring.captureException(new Error(message))
              showInfoSnackBar({
                message: `L'erreur ${message} a été envoyé sur Sentry`,
                timeout: SNACK_BAR_TIME_OUT,
              })
            }}
          />
        </Row>
      </StyledContainer>
      <Spacer.BottomScreen />
    </ScrollView>
  )
}

const ScrollView = styled.ScrollView.attrs(({ theme }) => ({
  contentContainerStyle: {
    backgroundColor: theme.colors.white,
  },
}))``

const StyledContainer = styled.View({
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'row',
})

const Row = styled.View<{ half?: boolean }>(({ half = false }) => ({
  width: half ? '50%' : '100%',
  ...padding(2, 0.5),
}))
