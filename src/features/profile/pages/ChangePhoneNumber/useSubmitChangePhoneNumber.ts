import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation } from '@react-navigation/native'
import { useForm } from 'react-hook-form'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { METROPOLITAN_FRANCE } from 'features/identityCheck/components/countryPicker/constants'
import { findCountry } from 'features/identityCheck/pages/phoneValidation/helpers/findCountry'
import { formatPhoneNumberWithPrefix } from 'features/identityCheck/pages/phoneValidation/helpers/formatPhoneNumber'
import {
  PhoneNumberFormValues,
  phoneNumberSchema,
} from 'features/identityCheck/pages/phoneValidation/helpers/phoneNumberSchema'
import { getProfileHookConfig } from 'features/navigation/ProfileStackNavigator/getProfileHookConfig'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import {
  getCountryIdFromPhoneNumber,
  getLastNineDigits,
} from 'features/profile/helpers/helperPhoneNumber'
import { analytics } from 'libs/analytics/provider'
import { usePatchProfileMutation } from 'queries/profile/usePatchProfileMutation'
import { showErrorSnackBar, showSuccessSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'

export const useSubmitChangePhoneNumber = () => {
  const { user } = useAuthContext()
  const { replace } = useNavigation<UseNavigationType>()
  const phoneNumber = user?.phoneNumber ? getLastNineDigits(user.phoneNumber) : ''
  const countryId = getCountryIdFromPhoneNumber(user?.phoneNumber) ?? METROPOLITAN_FRANCE.id
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
