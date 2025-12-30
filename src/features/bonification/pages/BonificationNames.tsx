import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { styled } from 'styled-components'

import { BonificationNamesSchema } from 'features/bonification/schemas/BonificationNamesSchema'
import {
  legalRepresentativeActions,
  useLegalRepresentative,
} from 'features/bonification/store/legalRepresentativeStore'
import { openUrl } from 'features/navigation/helpers/openUrl'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getSubscriptionHookConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionHookConfig'
import { env } from 'libs/environment/env'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryPrimary } from 'ui/components/buttons/ButtonTertiaryPrimary'
import { Form } from 'ui/components/Form'
import { DynamicInputList } from 'ui/components/inputs/DynamicInputList/DynamicInputList'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { InputText } from 'ui/designSystem/InputText/InputText'
import { useEnterKeyAction } from 'ui/hooks/useEnterKeyAction'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { InfoPlain } from 'ui/svg/icons/InfoPlain'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type FormValues = {
  firstNames: string[]
  givenName: string
  commonName?: string
}

export const BonificationNames = () => {
  const { navigate } = useNavigation<UseNavigationType>()

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
    delayError: 1000,
  })

  const firstNameErrors = formState.errors.firstNames?.map?.((e) => e?.message)

  const disabled = !formState.isValid

  async function saveNameAndNavigate({ firstNames, givenName, commonName }: FormValues) {
    if (disabled) return
    setFirstNames(firstNames)
    setGivenName(givenName)
    if (commonName) setCommonName(commonName)
    navigate(...getSubscriptionHookConfig('BonificationTitle'))
  }

  useEnterKeyAction(disabled ? undefined : () => handleSubmit(saveNameAndNavigate))

  return (
    <PageWithHeader
      title="Informations Personnelles"
      scrollChildren={
        <Form.MaxWidth>
          <StyledBodyXsSteps>Étape 1 sur 5</StyledBodyXsSteps>
          <ViewGap gap={4}>
            <Typo.Title3 {...getHeadingAttrs(2)}>
              Quels sont les noms et prénoms de ton représentant légal&nbsp;?
            </Typo.Title3>
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
                />
              )}
            />
            <Controller
              control={control}
              name="givenName"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <InputText
                  label="Nom de naissance"
                  description="Le nom avant tout changement"
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
                  description="Le nom utilisé au quotidien"
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
            <ButtonTertiaryPrimary
              icon={InfoPlain}
              wording="Je ne connais pas son nom de naissance"
              onPress={async () => {
                await openUrl(env.FAQ_BONIFICATION)
              }}
              justifyContent="flex-start"
              inline
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

export const StyledBodyXsSteps = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.disabled,
}))
