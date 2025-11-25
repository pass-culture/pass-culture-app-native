import { useNavigation, useRoute } from '@react-navigation/native'
import { debounce } from 'lodash'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Keyboard } from 'react-native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { IdentityCheckError } from 'features/identityCheck/pages/profile/errors'
import { addressActions, useAddress } from 'features/identityCheck/pages/profile/store/addressStore'
import { useCity } from 'features/identityCheck/pages/profile/store/cityStore'
import { PersonalDataTypes } from 'features/navigation/navigators/ProfileStackNavigator/enums'
import { getProfileHookConfig } from 'features/navigation/navigators/ProfileStackNavigator/getProfileHookConfig'
import { UseNavigationType, UseRouteType } from 'features/navigation/navigators/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { eventMonitoring } from 'libs/monitoring/services'
import { useAddressesQuery } from 'libs/place/queries/useAddressesQuery'
import { usePatchProfileMutation } from 'queries/profile/usePatchProfileMutation'
import { useIdCheckAddressAutocompletion } from 'queries/settings/useSettings'
import { isAddressValid } from 'ui/components/inputs/addressCheck'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
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
  const buttonWording = isMandatoryUpdatePersonalData ? 'Continuer' : 'Valider mon adresse'

  const { user } = useAuthContext()
  const { data: idCheckAddressAutocompletion } = useIdCheckAddressAutocompletion()
  const { showErrorSnackBar, showSuccessSnackBar } = useSnackBarContext()
  const { setAddress: setStoreAddress } = addressActions
  const storedCity = useCity()
  const storedAddress = useAddress()
  const initialCity = storedAddress === null ? '' : (storedAddress ?? user?.street ?? '')

  const { navigate } = useNavigation<UseNavigationType>()

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isValid },
  } = useForm<AddressForm>({
    mode: 'onChange',
    defaultValues: { address: initialCity },
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
    cityCode: storedCity?.code ?? '',
    postalCode: storedCity?.postalCode ?? '',
    enabled: shouldShowAddressResults,
    limit: 10,
  })

  useEffect(() => {
    if (isError) {
      showErrorSnackBar({ message: snackbarMessage, timeout: SNACK_BAR_TIME_OUT })
      eventMonitoring.captureException(new IdentityCheckError(exception))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const { mutate: patchProfile } = usePatchProfileMutation({
    onSuccess: (_, variables) => {
      if (isMandatoryUpdatePersonalData) {
        navigate(...getProfileHookConfig('ChangeStatus', { type }))
      } else {
        navigate(...getProfileHookConfig('PersonalData'))
        showSuccessSnackBar({
          message: 'Ton adresse de résidence a bien été modifiée\u00a0!',
          timeout: SNACK_BAR_TIME_OUT,
        })
      }
      analytics.logUpdateAddress({
        newAddress: variables.address ?? '',
        oldAddress: user?.street ?? '',
      })
    },
    onError: () => {
      showErrorSnackBar({
        message: 'Une erreur est survenue',
        timeout: SNACK_BAR_TIME_OUT,
      })
    },
  })

  const onSubmit = ({ address }: AddressForm) => {
    const finalAddress = selectedAddress ?? address
    setStoreAddress(finalAddress)
    patchProfile({ address: finalAddress })
  }

  useEnterKeyAction(isValid ? handleSubmit(onSubmit) : undefined)

  const hasNonEmptyQuery = query.trim().length > 0
  const isValidAndNotEmpty = isValid && hasNonEmptyQuery

  const isValidAddress = isAddressValid(query)
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
