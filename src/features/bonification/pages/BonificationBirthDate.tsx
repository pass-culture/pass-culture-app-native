import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { MINIMUM_DATE } from 'features/auth/constants'
import { setBirthdaySchema } from 'features/auth/pages/signup/SetBirthday/schema/setBirthdaySchema'
import { StyledBodyXsSteps } from 'features/bonification/pages/BonificationNames'
import {
  legalRepresentativeActions,
  useLegalRepresentative,
} from 'features/bonification/store/legalRepresentativeStore'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getSubscriptionHookConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionHookConfig'
import { formatDateToISOStringWithoutTime } from 'libs/parsers/formatDates'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { DateInput } from 'ui/components/inputs/DateInput/DateInput'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
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
      title="Informations Personnelles"
      scrollChildren={
        <Form.MaxWidth>
          <StyledBodyXsSteps>Étape 3 sur 5</StyledBodyXsSteps>
          <ViewGap gap={4}>
            <Typo.Title3 {...getHeadingAttrs(2)}>
              Quelle est sa date de naissance&nbsp;?
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
          </ViewGap>
        </Form.MaxWidth>
      }
      fixedBottomChildren={
        <ButtonPrimary
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
