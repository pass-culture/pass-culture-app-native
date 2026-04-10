import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation } from '@react-navigation/native'
import { useForm } from 'react-hook-form'

import { useAuthContext } from 'features/auth/context/AuthContext'
import {
  COUNTRIES,
  METROPOLITAN_FRANCE,
} from 'features/identityCheck/components/countryPicker/constants'
import { findCountry } from 'features/identityCheck/pages/phoneValidation/helpers/findCountry'
import { formatPhoneNumberWithPrefix } from 'features/identityCheck/pages/phoneValidation/helpers/formatPhoneNumber'
import {
  PhoneNumberFormValues,
  phoneNumberSchema,
} from 'features/identityCheck/pages/phoneValidation/helpers/phoneNumberSchema'
import { getProfileHookConfig } from 'features/navigation/ProfileStackNavigator/getProfileHookConfig'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { usePatchProfileMutation } from 'queries/profile/usePatchProfileMutation'
import { showErrorSnackBar, showSuccessSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'

const getLastNineDigits = (phoneNumber: string) => phoneNumber.slice(-9)

const getCountryIdFromPhoneNumber = (phoneNumber: string): string => {
  const countryId = phoneNumber.slice(0, -9)
  const cleanCode = countryId.replace(/^\+/, '')
  const country = COUNTRIES.find((c) => c.callingCode === cleanCode)
  return country?.id ?? METROPOLITAN_FRANCE.id
}

export const useSubmitChangePhoneNumber = () => {
  const { user } = useAuthContext()
  const { replace } = useNavigation<UseNavigationType>()
  const phoneNumber = user?.phoneNumber ? getLastNineDigits(user.phoneNumber) : ''
  const countryId = user?.phoneNumber
    ? getCountryIdFromPhoneNumber(user.phoneNumber)
    : METROPOLITAN_FRANCE.id
  const {
    control,
    formState: { isValid },
    handleSubmit,
  } = useForm<PhoneNumberFormValues>({
    resolver: yupResolver(phoneNumberSchema),
    defaultValues: {
      phoneNumber,
      countryId,
    },
    mode: 'onChange',
  })
  const { mutate: patchProfile, isPending } = usePatchProfileMutation({
    onSuccess: () => {
      replace(...getProfileHookConfig('PersonalData'))
      showSuccessSnackBar('Ton numéro de téléphone a bien été modifié\u00a0!')
      void analytics.logHasChangedPhoneNumber()
    },
    onError: () => {
      showErrorSnackBar('Une erreur est survenue')
    },
  })

  const onSubmit = ({ phoneNumber, countryId }: PhoneNumberFormValues) => {
    const country = findCountry(countryId)
    if (!country) {
      return
    }
    const phoneNumberWithPrefix = formatPhoneNumberWithPrefix(
      getLastNineDigits(phoneNumber),
      country.callingCode
    )
    patchProfile({ phoneNumber: phoneNumberWithPrefix })
  }

  return {
    control,
    isValid,
    handleSubmit,
    onSubmit,
    buttonWording: 'Continuer',
    isPending,
  }
}
