import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation, useRoute } from '@react-navigation/native'
import React from 'react'
import { useForm } from 'react-hook-form'
import styled from 'styled-components/native'

import { getProfileStackConfig } from 'features/navigation/ProfileStackNavigator/getProfileStackConfig'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { useNewEmailSelectionMutation } from 'features/profile/helpers/useNewEmailSelectionMutation'
import { newEmailSelectionSchema } from 'features/profile/pages/NewEmailSelection/schema/newEmailSelectionSchema'
import { eventMonitoring } from 'libs/monitoring/services'
import { EmailInputController } from 'shared/forms/controllers/EmailInputController'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { SUGGESTION_DELAY_IN_MS } from 'ui/components/inputs/EmailInputWithSpellingHelp/useEmailSpellingHelp'
import {
  SNACK_BAR_TIME_OUT,
  SNACK_BAR_TIME_OUT_LONG,
  useSnackBarContext,
} from 'ui/components/snackBar/SnackBarContext'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { Info } from 'ui/svg/icons/Info'
import { getSpacing } from 'ui/theme'

type FormValues = {
  newEmail: string
}

export const NewEmailSelection = () => {
  const { replace } = useNavigation<UseNavigationType>()
  const { params } = useRoute<UseRouteType<'NewEmailSelection'>>()
  const { showSuccessSnackBar, showErrorSnackBar } = useSnackBarContext()

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<FormValues>({
    defaultValues: {
      newEmail: '',
    },
    resolver: yupResolver(newEmailSelectionSchema),
    delayError: SUGGESTION_DELAY_IN_MS,
    mode: 'all',
  })

  const { mutate: selectNewEmail, isLoading } = useNewEmailSelectionMutation({
    onSuccess: () => {
      showSuccessSnackBar({
        message:
          'E-mail envoyé sur ta nouvelle adresse\u00a0! Tu as 24h pour valider ta demande. Si tu ne le trouves pas, pense à vérifier tes spams.',
        timeout: SNACK_BAR_TIME_OUT_LONG,
      })
      replace(...getProfileStackConfig('TrackEmailChange'))
    },
    onError: () =>
      showErrorSnackBar({
        message: 'Une erreur s’est produite lors du choix de l’adresse e-mail. Réessaie plus tard.',
        timeout: SNACK_BAR_TIME_OUT,
      }),
  })

  const onSubmit = handleSubmit(({ newEmail }) => {
    if (!params?.token || typeof params?.token !== 'string') {
      eventMonitoring.captureException(
        new Error(`Expected a string, but received ${typeof params?.token}`)
      )
      return
    }
    selectNewEmail({ newEmail, token: params.token })
  })

  return (
    <SecondaryPageWithBlurHeader title="Modifier mon adresse e-mail">
      <Form.MaxWidth flex={1}>
        <EmailInputController
          control={control}
          name="newEmail"
          label="Nouvelle adresse e-mail"
          placeholder="email@exemple.com"
          autoFocus
        />
        <Container>
          <InfoBanner
            icon={Info}
            message="Tu vas recevoir un lien de confirmation sur ton adresse e-mail actuelle. Ce lien est valable 24h."
          />
        </Container>
        <ButtonPrimary
          wording="Modifier mon adresse e-mail"
          disabled={!isValid || isLoading}
          onPress={onSubmit}
        />
      </Form.MaxWidth>
    </SecondaryPageWithBlurHeader>
  )
}

const Container = styled.View({ marginTop: getSpacing(4), marginBottom: getSpacing(10) })
