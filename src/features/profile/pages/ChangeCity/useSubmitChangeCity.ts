import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useForm } from 'react-hook-form'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { CityForm, cityResolver } from 'features/identityCheck/pages/profile/SetCity'
import { useCity } from 'features/identityCheck/pages/profile/store/cityStore'
import { getProfileHookConfig } from 'features/navigation/navigators/ProfileStackNavigator/getProfileHookConfig'
import { UseNavigationType, UseRouteType } from 'features/navigation/navigators/RootNavigator/types'

export const useSubmitChangeCity = () => {
  const { user } = useAuthContext()
  const { navigate } = useNavigation<UseNavigationType>()
  const { params } = useRoute<UseRouteType<'ChangeCity'>>()
  const type = params?.type
  const storedCity = useCity()
  const userCity = {
    name: user?.city ?? undefined,
    postalCode: user?.postalCode ?? undefined,
    code: undefined,
  }

  const {
    control,
    formState: { isValid },
    handleSubmit,
  } = useForm<CityForm>({
    mode: 'onChange',
    resolver: yupResolver(cityResolver),
    defaultValues: { city: storedCity ?? userCity },
  })

  const onSubmit = ({ city }: CityForm) => {
    if (type) return navigate(...getProfileHookConfig('ChangeAddress', { type, city }))
  }

  return {
    control,
    isValid,
    handleSubmit,
    onSubmit,
  }
}
