import { yupResolver } from '@hookform/resolvers/yup'
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import styled from 'styled-components/native'

import { MINIMUM_DATE, UNDER_YOUNGEST_AGE } from 'features/auth/constants'
import { setBirthdaySchema } from 'features/auth/pages/signup/SetBirthday/schema/setBirthdaySchema'
import { PreValidationSignupNormalStepProps } from 'features/auth/types'
import { formatDateToISOStringWithoutTime } from 'libs/parsers'
import { storage } from 'libs/storage'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { DateInput } from 'ui/components/inputs/DateInput/DateInput'
import { BicolorIdCard } from 'ui/svg/icons/BicolorIdCard'
import { Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type BirthdayForm = {
  birthdate: Date
}

export const SetBirthday: FunctionComponent<PreValidationSignupNormalStepProps> = ({
  goToNextStep,
  accessibilityLabelForNextStep,
  previousSignupData,
}) => {
  const currentYear = new Date().getFullYear()
  const previousBirthdateProvided = previousSignupData.birthdate
  const maximumSpinnerDate = new Date(currentYear - UNDER_YOUNGEST_AGE, 11, 31)
  const underYoungestDate = new Date(new Date().setFullYear(currentYear - UNDER_YOUNGEST_AGE))

  const initialDate = previousBirthdateProvided
    ? new Date(previousBirthdateProvided)
    : underYoungestDate

  const [defaultSelectedDate, setDefaultSelectedDate] = useState(initialDate)

  const {
    control,
    formState: { isValid },
    handleSubmit,
    setValue,
  } = useForm<BirthdayForm>({
    resolver: yupResolver(setBirthdaySchema),
    defaultValues: { birthdate: initialDate },
    mode: 'onChange',
  })

  useEffect(() => {
    const setDate = async () => {
      const userAge = await storage.readObject<number | string>('user_age')
      if (!previousBirthdateProvided && typeof userAge === 'number') {
        const userAgeDate = new Date(new Date().setFullYear(currentYear - userAge))
        setValue('birthdate', userAgeDate)
        setDefaultSelectedDate(userAgeDate)
      }
    }

    setDate()
  }, [currentYear, previousBirthdateProvided, setValue])

  const onGoToNextStep = useCallback(
    ({ birthdate }: BirthdayForm) => {
      if (birthdate) {
        goToNextStep({ birthdate: formatDateToISOStringWithoutTime(birthdate) })
      }
    },
    [goToNextStep]
  )

  return (
    <Form.MaxWidth>
      <Typo.Title3 {...getHeadingAttrs(2)}>Renseigne ton âge</Typo.Title3>
      <Spacer.Column numberOfSpaces={4} />
      <InnerContainer>
        <InfoBanner
          message="Assure-toi que ton âge est exact. Il ne pourra plus être modifié par la suite et nous vérifions tes informations."
          icon={BicolorIdCard}
        />
        <Spacer.Column numberOfSpaces={10} />
        <Controller
          control={control}
          name="birthdate"
          render={({ field: { value, onChange }, formState: { errors } }) => (
            <DateInput
              onChange={onChange}
              date={value}
              errorMessage={
                formatDateToISOStringWithoutTime(value) ===
                formatDateToISOStringWithoutTime(underYoungestDate)
                  ? undefined
                  : errors.birthdate?.message
              }
              defaultSelectedDate={defaultSelectedDate}
              maximumDate={maximumSpinnerDate}
              minimumDate={MINIMUM_DATE}
            />
          )}
        />

        <Spacer.Column numberOfSpaces={10} />
        <ButtonPrimary
          wording="Continuer"
          accessibilityLabel={accessibilityLabelForNextStep}
          disabled={!isValid}
          onPress={handleSubmit(onGoToNextStep)}
        />
        <Spacer.Column numberOfSpaces={5} />
      </InnerContainer>
    </Form.MaxWidth>
  )
}

const InnerContainer = styled.View({
  width: '100%',
  alignItems: 'center',
})
