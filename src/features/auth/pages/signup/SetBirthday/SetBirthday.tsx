import { yupResolver } from '@hookform/resolvers/yup'
import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { MINIMUM_DATE, UNDER_YOUNGEST_AGE } from 'features/auth/constants'
import { setBirthdaySchema } from 'features/auth/pages/signup/SetBirthday/schema/setBirthdaySchema'
import { PreValidationSignupNormalStepProps } from 'features/auth/types'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { NonEligible } from 'features/onboarding/enums'
import { formatDateToISOStringWithoutTime } from 'libs/parsers/formatDates'
import { storage } from 'libs/storage'
import { Form } from 'ui/components/Form'
import { DateInput } from 'ui/components/inputs/DateInput/DateInput'
import { Banner } from 'ui/designSystem/Banner/Banner'
import { Button } from 'ui/designSystem/Button/Button'
import { IdCard } from 'ui/svg/icons/IdCard'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type BirthdayForm = {
  birthdate: Date
}

export const SetBirthday: FunctionComponent<PreValidationSignupNormalStepProps> = ({
  isSSOSubscription,
  goToNextStep,
  accessibilityLabelForNextStep,
  previousSignupData,
}) => {
  const { params } = useRoute<UseRouteType<'SignupForm'>>()
  const isSSOSubscriptionFromLogin = isSSOSubscription && !!params?.accountCreationToken

  const currentYear = new Date().getFullYear()
  const previousBirthdateProvided = previousSignupData.birthdate
  const maximumSpinnerDate = new Date(currentYear - UNDER_YOUNGEST_AGE, 11, 31)
  const defaultDate = new Date(new Date().setFullYear(currentYear - UNDER_YOUNGEST_AGE))
  const { isNative } = useTheme()

  const initialDate = previousBirthdateProvided ? new Date(previousBirthdateProvided) : defaultDate

  const [userAge, setUserAge] = useState<number | string | null>(null)

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
    const fetchUserAge = async () => {
      const age = await storage.readObject<number | string>('user_age')
      setUserAge(age)
      if (!previousBirthdateProvided && typeof age === 'number') {
        const userAgeDate = new Date(new Date().setFullYear(currentYear - age))
        setValue('birthdate', userAgeDate)
      }
    }
    if (isNative) {
      fetchUserAge()
    }
  }, [currentYear, previousBirthdateProvided, setValue, isNative])

  const onGoToNextStep = useCallback(
    ({ birthdate }: BirthdayForm) => {
      if (birthdate) {
        goToNextStep({ birthdate: formatDateToISOStringWithoutTime(birthdate) })
      }
    },
    [goToNextStep]
  )

  const pageTitle = isSSOSubscriptionFromLogin
    ? 'Termine ton inscription'
    : 'Renseigne ta date de naissance'

  const bannerMessage =
    userAge === NonEligible.OVER_18
      ? 'Ta date de naissance nous aidera à te proposer des offres adaptées et à personnaliser ton expérience.'
      : 'Assure-toi que ta date de naissance est exacte. Elle ne pourra plus être modifiée par la suite et nous vérifions tes informations.'

  return (
    <Form.MaxWidth>
      <Typo.Title3 {...getHeadingAttrs(2)}>{pageTitle}</Typo.Title3>
      {isSSOSubscriptionFromLogin ? (
        <StyledView>
          <Typo.Body>
            Ton compte Google “{params?.email ?? ''}” n’est pas lié à un compte existant. Pour
            continuer, tu peux créer un compte.
          </Typo.Body>
        </StyledView>
      ) : null}
      <InnerContainer>
        <BannerContainer>
          <Banner label={bannerMessage} Icon={IdCard} />
        </BannerContainer>
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
            wording="Continuer"
            accessibilityLabel={accessibilityLabelForNextStep}
            disabled={!isValid}
            onPress={handleSubmit(onGoToNextStep)}
            fullWidth
            variant="primary"
          />
        </ButtonContainer>
      </InnerContainer>
    </Form.MaxWidth>
  )
}

const StyledView = styled.View(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.l,
}))

const InnerContainer = styled.View(({ theme }) => ({
  marginVertical: theme.designSystem.size.spacing.l,
  width: '100%',
  alignItems: 'center',
}))

const BannerContainer = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.xxxl,
  width: '100%',
}))

const ButtonContainer = styled.View(({ theme }) => ({
  width: '100%',
  paddingTop: theme.designSystem.size.spacing.xxxl,
}))
