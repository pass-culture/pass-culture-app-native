import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'

import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { CityForm, cityResolver } from 'features/identityCheck/pages/profile/SetCity'
import { useCity, useCityActions } from 'features/identityCheck/pages/profile/store/cityStore'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { useUpdateProfileMutation } from 'features/profile/api/useUpdateProfileMutation'
import { CitySearchInput } from 'features/profile/components/CitySearchInput/CitySearchInput'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'

export const ChangeCity = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { showSuccessSnackBar, showErrorSnackBar } = useSnackBarContext()
  const storedCity = useCity()
  const { setCity } = useCityActions()
  const {
    control,
    formState: { isValid },
    handleSubmit,
  } = useForm<CityForm>({
    mode: 'onChange',
    resolver: yupResolver(cityResolver),
    defaultValues: { city: storedCity ?? undefined },
  })
  const { mutate: updateProfile } = useUpdateProfileMutation(
    () => {
      showSuccessSnackBar({
        message: 'Ta ville de résidence a bien été modifiée\u00a0!',
        timeout: SNACK_BAR_TIME_OUT,
      })
    },
    () => {
      showErrorSnackBar({
        message: 'Une erreur est survenue',
        timeout: SNACK_BAR_TIME_OUT,
      })
    }
  )

  const onSubmit = ({ city }: CityForm) => {
    setCity(city)
    updateProfile({ city: city.name, postalCode: city.postalCode })
    navigate('PersonalData')
  }

  return (
    <PageWithHeader
      title="Profil"
      scrollChildren={
        <Controller
          control={control}
          name="city"
          render={({ field: { value, onChange } }) => (
            <CitySearchInput city={value} onCitySelected={onChange} />
          )}
        />
      }
      fixedBottomChildren={
        <ButtonPrimary
          type="submit"
          onPress={handleSubmit(onSubmit)}
          wording="Continuer"
          accessibilityLabel="Continuer vers l’étape suivante"
          disabled={!isValid}
        />
      }
    />
  )
}
