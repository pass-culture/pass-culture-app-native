import { yupResolver } from '@hookform/resolvers/yup'
import React from 'react'
import { useForm } from 'react-hook-form'

import { newEmailSelectionSchema } from 'features/profile/pages/NewEmailSelection/schema/newEmailSelectionSchema'
import { EmailInputController } from 'shared/forms/controllers/EmailInputController'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { SUGGESTION_DELAY_IN_MS } from 'ui/components/inputs/EmailInputWithSpellingHelp/useEmailSpellingHelp'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { Info } from 'ui/svg/icons/Info'
import { Spacer } from 'ui/theme'

type FormValues = {
  newEmail: string
}

export const NewEmailSelection = () => {
  const {
    control,
    formState: { isValid },
  } = useForm<FormValues>({
    defaultValues: {
      newEmail: '',
    },
    resolver: yupResolver(newEmailSelectionSchema),
    delayError: SUGGESTION_DELAY_IN_MS,
    mode: 'all',
  })

  return (
    <SecondaryPageWithBlurHeader headerTitle="Modifier mon adresse e-mail">
      <Spacer.Column numberOfSpaces={6} />
      <Form.MaxWidth flex={1}>
        <EmailInputController
          control={control}
          name="newEmail"
          label="Nouvelle adresse e-mail"
          placeholder="email@exemple.com"
          autoFocus
        />
        <Spacer.Column numberOfSpaces={4} />
        <InfoBanner
          icon={Info}
          message="Tu vas recevoir un lien de confirmation sur ton adresse e-mail actuelle. Ce lien est valable 24h."
        />
        <Spacer.Column numberOfSpaces={10} />
        <ButtonPrimary wording="Modifier mon adresse e-mail" disabled={!isValid} />
      </Form.MaxWidth>
    </SecondaryPageWithBlurHeader>
  )
}
