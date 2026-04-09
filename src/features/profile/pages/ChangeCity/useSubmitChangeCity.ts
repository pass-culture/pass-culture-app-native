import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useForm } from 'react-hook-form'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { CityForm, cityResolver } from 'features/identityCheck/pages/profile/SetCity'
import { addressActions } from 'features/identityCheck/pages/profile/store/addressStore'
import { cityActions, useCity } from 'features/identityCheck/pages/profile/store/cityStore'
import { PersonalDataTypes } from 'features/navigation/ProfileStackNavigator/enums'
import { getProfileHookConfig } from 'features/navigation/ProfileStackNavigator/getProfileHookConfig'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { usePatchProfileMutation } from 'queries/profile/usePatchProfileMutation'
import { showErrorSnackBar, showSuccessSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'

export const useSubmitChangeCity = () => {
  const { user } = useAuthContext()
  const userCity = {
    name: user?.city ?? undefined,
    postalCode: user?.postalCode ?? undefined,
    code: undefined,
  }

  const storedCity = useCity()
  const { setCity } = cityActions
  const { resetAddress } = addressActions

  const { navigate } = useNavigation<UseNavigationType>()
  const { params } = useRoute<UseRouteType<'ChangeCity'>>()
  const type = params?.type

  const isFromProfileUpdateFlow =
    type === PersonalDataTypes.PROFIL_PERSONAL_DATA ||
    type === PersonalDataTypes.MANDATORY_UPDATE_PERSONAL_DATA

  const {
    control,
    formState: { isValid },
    handleSubmit,
  } = useForm<CityForm>({
    mode: 'onChange',
    resolver: yupResolver(cityResolver),
    defaultValues: { city: storedCity ?? userCity },
  })

  const { mutate: patchProfile, isPending } = usePatchProfileMutation({
    onSuccess: (_, variables) => {
      if (isFromProfileUpdateFlow) {
        navigate(...getProfileHookConfig('ChangeAddress', { type }))
      } else {
        navigate(...getProfileHookConfig('PersonalData'))
        showSuccessSnackBar('Ta ville de résidence a bien été modifiée\u00a0!')
      }

      analytics.logUpdatePostalCode({
        newCity: variables.city ?? '',
        oldCity: user?.city ?? '',
        newPostalCode: variables.postalCode ?? '',
        oldPostalCode: user?.postalCode ?? '',
      })
    },
    onError: () => {
      showErrorSnackBar('Une erreur est survenue')
    },
  })

  const onSubmit = ({ city }: CityForm) => {
    const hasCityChanged = !!storedCity && storedCity.postalCode !== city.postalCode
    if (isFromProfileUpdateFlow && hasCityChanged) resetAddress()

    setCity(city)
    patchProfile({ city: city.name, postalCode: city.postalCode })
  }

  const buttonWording = isFromProfileUpdateFlow ? 'Continuer' : 'Valider ma ville de résidence'

  return {
    control,
    isValid,
    handleSubmit,
    onSubmit,
    buttonWording,
    isPending,
  }
}
