import { CommonActions, useNavigation, useRoute } from '@react-navigation/native'
import { debounce } from 'lodash'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Keyboard } from 'react-native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { IdentityCheckError } from 'features/identityCheck/pages/profile/errors'
import { addressActions, useAddress } from 'features/identityCheck/pages/profile/store/addressStore'
import { cityActions, useCity } from 'features/identityCheck/pages/profile/store/cityStore'
import { PersonalDataTypes } from 'features/navigation/navigators/ProfileStackNavigator/enums'
import { getProfileHookConfig } from 'features/navigation/navigators/ProfileStackNavigator/getProfileHookConfig'
import { UseNavigationType, UseRouteType } from 'features/navigation/navigators/RootNavigator/types'
import { getSubscriptionPropConfig } from 'features/navigation/navigators/SubscriptionStackNavigator/getSubscriptionPropConfig'
import { analytics } from 'libs/analytics/provider'
import { eventMonitoring } from 'libs/monitoring/services'
import { useAddressesQuery } from 'libs/place/queries/useAddressesQuery'
import { usePatchProfileMutation } from 'queries/profile/usePatchProfileMutation'
import { useIdCheckAddressAutocompletion } from 'queries/settings/useSettings'
import { isAddressValid } from 'ui/components/inputs/addressCheck'
import { showErrorSnackBar, showSuccessSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'
import { useEnterKeyAction } from 'ui/hooks/useEnterKeyAction'

const snackbarMessage =
  'Nous avons eu un problème pour trouver l’adresse associée à ton code postal. Réessaie plus tard.'
const exception = 'Failed to fetch data from API: https://data.geopf.fr/geocodage/search'

type AddressForm = {
  address: string
}

export const useSubmitChangeAddress = () => {
  const { params } = useRoute<UseRouteType<'ChangeAddress'>>()
  const type = params?.type

  const isMandatoryUpdatePersonalData = type === PersonalDataTypes.MANDATORY_UPDATE_PERSONAL_DATA
  const isCheckAddress = type === PersonalDataTypes.CHECK_ADDRESS_DATA
  const buttonWording = isMandatoryUpdatePersonalData ? 'Continuer' : 'Valider mon adresse'

  const { user } = useAuthContext()
  const { data: idCheckAddressAutocompletion } = useIdCheckAddressAutocompletion()
  const { setAddress: setStoreAddress } = addressActions
  const storedCity = useCity()

  const city = params?.city ?? storedCity
  const hasCityChanged =
    !!params?.city && !!storedCity && storedCity.postalCode !== params.city.postalCode
  const { setCity } = cityActions
  const storedAddress = useAddress()
  const initialAddress =
    storedAddress === null || hasCityChanged ? '' : (storedAddress ?? user?.street ?? '')

  const { navigate, dispatch } = useNavigation<UseNavigationType>()

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isValid },
  } = useForm<AddressForm>({
    mode: 'onChange',
    defaultValues: { address: initialAddress },
  })

  const query = watch('address')
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null)

  const debouncedSetQuery = useRef(
    debounce((value: string) => setDebouncedQuery(value), 500)
  ).current
  const [debouncedQuery, setDebouncedQuery] = useState(query)

  const shouldShowAddressResults = !!idCheckAddressAutocompletion && debouncedQuery.length > 0

  const {
    data: addresses = [],
    isLoading,
    isError,
  } = useAddressesQuery({
    query: debouncedQuery,
    cityCode: city?.code ?? '',
    postalCode: city?.postalCode ?? '',
    enabled: shouldShowAddressResults,
    limit: 10,
  })

  useEffect(() => {
    if (isError) {
      showErrorSnackBar(snackbarMessage)
      eventMonitoring.captureException(new IdentityCheckError(exception))
    }
  }, [isError])

  const onChangeAddress = (value: string) => {
    setSelectedAddress(null)
    setValue('address', value)
    debouncedSetQuery(value)
  }

  const onAddressSelection = (address: string) => {
    setSelectedAddress(address)
    setValue('address', address)
    Keyboard.dismiss()
  }

  const resetSearch = () => {
    setSelectedAddress(null)
    setValue('address', '')
    debouncedSetQuery('')
  }

  const removePrecedentScreen = () => {
    dispatch((state) => {
      const routesToDelete = new Set(['ChangeAddress', 'ChangeCity'])
      const routes = state.routes.filter((r) => !routesToDelete.has(r.name))

      return CommonActions.reset({
        ...state,
        routes,
        index: routes.length - 1,
      })
    })
  }

  const { mutate: patchProfile } = usePatchProfileMutation({
    onSuccess: async (_, variables) => {
      if (isMandatoryUpdatePersonalData) {
        navigate(...getProfileHookConfig('ChangeStatus', { type }))
      } else if (isCheckAddress) {
        const subscriptionConfig = getSubscriptionPropConfig('CheckAddress', {
          fromChangeAddress: true,
        })
        navigate(subscriptionConfig.screen, subscriptionConfig.params)
      } else {
        navigate(...getProfileHookConfig('PersonalData'))
        removePrecedentScreen()
        showSuccessSnackBar('Ton adresse de résidence a bien été modifiée\u00a0!')
      }
      await analytics.logUpdateAddress({
        newAddress: variables.address ?? '',
        oldAddress: user?.street ?? '',
      })
      await analytics.logUpdatePostalCode({
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

  const onSubmit = ({ address }: AddressForm) => {
    const finalAddress = selectedAddress ?? address
    if (params?.city) setCity(params.city)
    setStoreAddress(finalAddress)
    patchProfile({
      address: finalAddress,
      city: city?.name,
      postalCode: city?.postalCode,
    })
  }

  useEnterKeyAction(isValid ? handleSubmit(onSubmit) : undefined)

  const hasNonEmptyQuery = query.trim().length > 0
  const isValidAndNotEmpty = isValid && hasNonEmptyQuery
  const hasSameAddress = storedAddress === query
  const isValidAddress = selectedAddress !== null || isAddressValid(query) || hasSameAddress
  const label = idCheckAddressAutocompletion
    ? 'Recherche et sélectionne ton adresse'
    : 'Entre ton adresse'
  const hasError = !isValidAddress && hasNonEmptyQuery

  return {
    control,
    handleSubmit,
    onSubmit,
    isValid: isValidAndNotEmpty,
    label,
    onChangeAddress,
    resetSearch,
    addresses,
    isLoading,
    shouldShowAddressResults,
    onAddressSelection,
    selectedAddress,
    hasError,
    buttonWording,
  }
}
