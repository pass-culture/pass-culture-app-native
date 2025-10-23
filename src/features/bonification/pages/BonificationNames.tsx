import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'

import { BonificationNamesSchema } from 'features/bonification/schemas/BonificationNamesSchema'
import {
  legalRepresentativeActions,
  useLegalRepresentative,
} from 'features/bonification/store/legalRepresentativeStore'
import { SubscriptionStackParamList } from 'features/navigation/SubscriptionStackNavigator/SubscriptionStackTypes'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Banner } from 'ui/designSystem/Banner/Banner'
import { InputText } from 'ui/designSystem/InputText/InputText'
import { useEnterKeyAction } from 'ui/hooks/useEnterKeyAction'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { IdCard } from 'ui/svg/icons/IdCard'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type FormValues = {
  firstName: string
  givenName: string
  commonName?: string
}

export const BonificationNames = () => {
  const { navigate } = useNavigation<NativeStackNavigationProp<SubscriptionStackParamList>>()

  const storedLegalRepresentative = useLegalRepresentative()
  const { setFirstName, setCommonName, setGivenName } = legalRepresentativeActions

  const { control, formState, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      firstName: storedLegalRepresentative.firstName ?? '',
      givenName: storedLegalRepresentative.givenName ?? '',
      commonName: storedLegalRepresentative.commonName ?? '',
    },
    resolver: yupResolver(BonificationNamesSchema),
    mode: 'all',
  })

  const disabled = !formState.isValid

  async function saveNameAndNavigate({ firstName, givenName, commonName }: FormValues) {
    if (disabled) return
    // eslint-disable-next-line no-console
    console.log({ firstName, givenName, commonName })
    setFirstName(firstName)
    if (commonName) setCommonName(commonName)
    setGivenName(givenName)
    navigate('BonificationTitle')
  }

  useEnterKeyAction(disabled ? undefined : () => handleSubmit(saveNameAndNavigate))

  return (
    <PageWithHeader
      title="Informations Personnelles"
      scrollChildren={
        <Form.MaxWidth>
          <ViewGap gap={4}>
            <Typo.Title3 {...getHeadingAttrs(2)}>Quel est son nom et prénom&nbsp;?</Typo.Title3>
            <Banner
              Icon={IdCard}
              label="Plus tu seras précis sur ces informations, plus on aura de chances de trouver la personne en question."
            />
            <Controller
              control={control}
              name="firstName"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <InputText
                  label="Prénom"
                  value={value}
                  autoFocus
                  onChangeText={onChange}
                  requiredIndicator="explicit"
                  accessibilityHint={error?.message}
                  testID="Entrée pour le prénom"
                  textContentType="givenName"
                  autoComplete="given-name"
                  errorMessage={error?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="givenName"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <InputText
                  label="Nom de naissance"
                  value={value}
                  onChangeText={onChange}
                  requiredIndicator="explicit"
                  accessibilityHint={error?.message}
                  testID="Entrée pour le nom"
                  textContentType="familyName"
                  autoComplete="family-name"
                  errorMessage={error?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="commonName"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <InputText
                  label="Nom d’usage"
                  value={value}
                  onChangeText={onChange}
                  accessibilityHint={error?.message}
                  testID="Entrée pour le nom d’usage"
                  textContentType="familyName"
                  autoComplete="family-name"
                  errorMessage={error?.message}
                />
              )}
            />
          </ViewGap>
        </Form.MaxWidth>
      }
      fixedBottomChildren={
        <ButtonPrimary
          type="submit"
          wording="Continuer"
          accessibilityLabel="Continuer vers la civilité"
          onPress={handleSubmit(saveNameAndNavigate)}
          disabled={disabled}
        />
      }
    />
  )
}
