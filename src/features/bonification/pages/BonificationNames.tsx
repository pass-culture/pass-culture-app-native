import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
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
import { DynamicInputList } from 'ui/components/inputs/DynamicInputList/DynamicInputList'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Banner } from 'ui/designSystem/Banner/Banner'
import { InputText } from 'ui/designSystem/InputText/InputText'
import { useEnterKeyAction } from 'ui/hooks/useEnterKeyAction'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { IdCard } from 'ui/svg/icons/IdCard'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type FormValues = {
  firstNames: string[]
  givenName: string
  commonName?: string
}

export const BonificationNames = () => {
  const { navigate } = useNavigation<StackNavigationProp<SubscriptionStackParamList>>()

  const storedLegalRepresentative = useLegalRepresentative()
  const { setFirstNames, setCommonName, setGivenName } = legalRepresentativeActions

  const { control, formState, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      firstNames: storedLegalRepresentative.firstNames ?? [],
      givenName: storedLegalRepresentative.givenName ?? '',
      commonName: storedLegalRepresentative.commonName ?? '',
    },
    resolver: yupResolver(BonificationNamesSchema),
    mode: 'all',
  })

  const firstNameErrors = formState.errors.firstNames?.map?.((e) => e?.message)

  const disabled = !formState.isValid

  async function saveNameAndNavigate({ firstNames, givenName, commonName }: FormValues) {
    if (disabled) return
    setFirstNames(firstNames)
    setGivenName(givenName)
    if (commonName) setCommonName(commonName)
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
              name="firstNames"
              render={({ field: { onChange, value } }) => (
                <DynamicInputList
                  inputs={[
                    { label: 'Prénom', testID: 'Entrée pour le prénom' },
                    { label: 'Deuxième prénom', testID: 'Entrée pour le deuxieme prénom' },
                    { label: 'Troisième prénom', testID: 'Entrée pour le troisième prénom' },
                    { label: 'Quatrième prénom', testID: 'Entrée pour le quatrième prénom' },
                  ]}
                  addMoreInputWording="Ajouter un prénom"
                  requiredIndicator="explicit"
                  initialValues={value}
                  onValuesChange={onChange}
                  errors={firstNameErrors}
                  autoFocus
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
