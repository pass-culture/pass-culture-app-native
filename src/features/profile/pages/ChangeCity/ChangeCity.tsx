import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { CityForm, cityResolver } from 'features/identityCheck/pages/profile/SetCity'
import { cityActions, useCity } from 'features/identityCheck/pages/profile/store/cityStore'
import { getProfileStackConfig } from 'features/navigation/ProfileStackNavigator/getProfileStackConfig'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { CitySearchInput } from 'features/profile/components/CitySearchInput/CitySearchInput'
import { analytics } from 'libs/analytics/provider'
import { usePatchProfileMutation } from 'queries/profile/usePatchProfileMutation'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { Typo, getSpacing } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const ChangeCity = () => {
  const { user } = useAuthContext()
  const { navigate } = useNavigation<UseNavigationType>()
  const { showSuccessSnackBar, showErrorSnackBar } = useSnackBarContext()
  const storedCity = useCity()
  const { setCity } = cityActions
  const {
    control,
    formState: { isValid },
    handleSubmit,
  } = useForm<CityForm>({
    mode: 'onChange',
    resolver: yupResolver(cityResolver),
    defaultValues: { city: storedCity ?? undefined },
  })
  const { mutate: patchProfile } = usePatchProfileMutation({
    onSuccess: (_, variables) => {
      analytics.logUpdatePostalCode({
        newCity: variables.city ?? '',
        oldCity: user?.city ?? '',
        newPostalCode: variables.postalCode ?? '',
        oldPostalCode: user?.postalCode ?? '',
      })
      showSuccessSnackBar({
        message: 'Ta ville de résidence a bien été modifiée\u00a0!',
        timeout: SNACK_BAR_TIME_OUT,
      })
    },
    onError: () => {
      showErrorSnackBar({
        message: 'Une erreur est survenue',
        timeout: SNACK_BAR_TIME_OUT,
      })
    },
  })

  const onSubmit = ({ city }: CityForm) => {
    setCity(city)
    patchProfile({ city: city.name, postalCode: city.postalCode })
    navigate(...getProfileStackConfig('PersonalData'))
  }

  return (
    <PageWithHeader
      title="Modifier ma ville de résidence"
      scrollChildren={
        <React.Fragment>
          <Container>
            <Typo.Title3 {...getHeadingAttrs(1)}>Renseigne ta ville de résidence</Typo.Title3>
          </Container>
          <Controller
            control={control}
            name="city"
            render={({ field: { value, onChange } }) => (
              <CitySearchInput city={value} onCitySelected={onChange} />
            )}
          />
        </React.Fragment>
      }
      fixedBottomChildren={
        <ButtonPrimary
          type="submit"
          onPress={handleSubmit(onSubmit)}
          wording="Valider ma ville de résidence"
          disabled={!isValid}
        />
      }
    />
  )
}

const Container = styled.View({ marginBottom: getSpacing(5) })
