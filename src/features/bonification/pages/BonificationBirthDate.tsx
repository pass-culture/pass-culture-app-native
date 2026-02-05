import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'
import styled from 'styled-components/native'

import { MINIMUM_DATE } from 'features/auth/constants'
import { setBirthdaySchema } from 'features/auth/pages/signup/SetBirthday/schema/setBirthdaySchema'
import { StyledBodyXsSteps } from 'features/bonification/pages/BonificationNames'
import {
  legalRepresentativeActions,
  useLegalRepresentative,
} from 'features/bonification/store/legalRepresentativeStore'
import { openUrl } from 'features/navigation/helpers/openUrl'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getSubscriptionHookConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionHookConfig'
import { env } from 'libs/environment/env'
import { formatDateToISOStringWithoutTime } from 'libs/parsers/formatDates'
import { Form } from 'ui/components/Form'
import { DateInput } from 'ui/components/inputs/DateInput/DateInput'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { InfoPlain } from 'ui/svg/icons/InfoPlain'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type BirthdayForm = {
  birthdate: Date
}

export const BonificationBirthDate = () => {
  const { navigate } = useNavigation<UseNavigationType>()

  const storedLegalRepresentative = useLegalRepresentative()
  const { setBirthDate } = legalRepresentativeActions

  const currentYear = new Date().getFullYear()
  const maximumSpinnerDate = new Date(currentYear - 17, 11, 31)
  const defaultDate = storedLegalRepresentative.birthDate
    ? new Date(storedLegalRepresentative.birthDate)
    : new Date(new Date().setFullYear(currentYear - 17))

  const {
    control,
    formState: { isValid },
    handleSubmit,
  } = useForm<BirthdayForm>({
    resolver: yupResolver(setBirthdaySchema),
    defaultValues: { birthdate: defaultDate },
    mode: 'onChange',
  })

  const navigateToBirthPlace = useCallback(
    ({ birthdate }: BirthdayForm) => {
      if (birthdate) {
        setBirthDate(birthdate)
        navigate(...getSubscriptionHookConfig('BonificationBirthPlace'))
      }
    },
    [navigate, setBirthDate]
  )

  return (
    <PageWithHeader
      title="Informations"
      scrollChildren={
        <Form.MaxWidth>
          <StyledBodyXsSteps>Étape 3 sur 5</StyledBodyXsSteps>
          <ViewGap gap={4}>
            <Typo.Title3 {...getHeadingAttrs(2)}>
              Quelle est la date de naissance de ton représentant légal&nbsp;?
            </Typo.Title3>

            <Controller
              control={control}
              name="birthdate"
              render={({ field: { value, onChange }, formState: { errors } }) => (
                <DateInput
                  onChange={onChange}
                  date={value}
                  errorMessage={
                    formatDateToISOStringWithoutTime(value) ===
                    formatDateToISOStringWithoutTime(defaultDate)
                      ? undefined
                      : errors.birthdate?.message
                  }
                  maximumDate={maximumSpinnerDate}
                  minimumDate={MINIMUM_DATE}
                />
              )}
            />
            <ButtonContainer>
              <Button
                variant="tertiary"
                icon={InfoPlain}
                wording="Je ne connais pas sa date de naissance"
                onPress={async () => {
                  await openUrl(env.FAQ_BONIFICATION)
                }}
              />
            </ButtonContainer>
          </ViewGap>
        </Form.MaxWidth>
      }
      fixedBottomChildren={
        <Button
          variant="primary"
          fullWidth
          type="submit"
          wording="Continuer"
          accessibilityLabel="Continuer vers le lieu de naissance"
          onPress={handleSubmit(navigateToBirthPlace)}
          disabled={!isValid}
        />
      }
    />
  )
}

const ButtonContainer = styled.View({
  alignSelf: 'flex-start',
})
