import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation } from '@react-navigation/native'
import { useForm } from 'react-hook-form'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { findCountry } from 'features/identityCheck/pages/phoneValidation/helpers/findCountry'
import { formatPhoneNumberWithPrefix } from 'features/identityCheck/pages/phoneValidation/helpers/formatPhoneNumber'
import {
  PhoneNumberFormValues,
  phoneNumberSchema,
} from 'features/identityCheck/pages/phoneValidation/helpers/phoneNumberSchema'
import { getProfileHookConfig } from 'features/navigation/navigators/ProfileStackNavigator/getProfileHookConfig'
import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { usePatchProfileMutation } from 'queries/profile/usePatchProfileMutation'
import { METROPOLITAN_FRANCE } from 'shared/countries/constants'
import {
  getCountryIdFromPhoneNumber,
  getNationalNumber,
} from 'shared/phoneNumber/helperPhoneNumber'
import { showErrorSnackBar, showSuccessSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'

export const useSubmitChangePhoneNumber = () => {
  const { user } = useAuthContext()
  const { replace } = useNavigation<UseNavigationType>()
  const phoneNumber = user?.phoneNumber ? getNationalNumber(user.phoneNumber) : ''
  const countryId = getCountryIdFromPhoneNumber(user?.phoneNumber) ?? METROPOLITAN_FRANCE.id
  const {
    control,
    formState: { isValid },
    handleSubmit,
    setValue,
    trigger,
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
      getNationalNumber(phoneNumber),
      country.callingCode
    )
    patchProfile({ phoneNumber: phoneNumberWithPrefix })
  }

  return {
    control,
    isValid,
    handleSubmit,
    setValue,
    trigger,
    onSubmit,
    buttonWording: 'Continuer',
    isPending,
  }
}
