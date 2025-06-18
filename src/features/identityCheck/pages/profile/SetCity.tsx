import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { object, string } from 'yup'

import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'
import { cityActions, useCity } from 'features/identityCheck/pages/profile/store/cityStore'
import {
  SubscriptionRootStackParamList,
  UseNavigationType,
} from 'features/navigation/RootNavigator/types'
import { CitySearchInput } from 'features/profile/components/CitySearchInput/CitySearchInput'
import { SuggestedCity } from 'libs/place/types'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export type CityForm = { city: SuggestedCity }

export const cityResolver = object().shape({
  city: object()
    .shape({
      name: string().required(),
      code: string().required(),
      postalCode: string().required(),
    })
    .required(),
})

type Props = StackScreenProps<SubscriptionRootStackParamList, 'SetCity'>

export const SetCity: FunctionComponent<Props> = ({ route }: Props) => {
  const type = route.params.type
  const isIdentityCheck = type === ProfileTypes.IDENTITY_CHECK
  const pageInfos = isIdentityCheck
    ? {
        headerTitle: 'Profil',
        navigateParamsType: ProfileTypes.IDENTITY_CHECK,
      }
    : {
        headerTitle: 'Informations personnelles',
        navigateParamsType: ProfileTypes.BOOKING_FREE_OFFER_15_16,
      }

  const { navigate } = useNavigation<UseNavigationType>()
  const storedCity = useCity()
  const { setCity: setStoreCity } = cityActions
  const {
    control,
    formState: { isValid },
    handleSubmit,
  } = useForm<CityForm>({
    mode: 'onChange',
    resolver: yupResolver(cityResolver),
    defaultValues: { city: storedCity ?? undefined },
  })

  const onSubmit = ({ city }: CityForm) => {
    setStoreCity(city)
    navigate('SetAddress', { type: pageInfos.navigateParamsType })
  }

  return (
    <PageWithHeader
      title={pageInfos.headerTitle}
      scrollChildren={
        <ViewGap gap={5}>
          <Typo.Title3 {...getHeadingAttrs(2)}>Renseigne ta ville de résidence</Typo.Title3>
          <Controller
            control={control}
            name="city"
            render={({ field: { value, onChange } }) => (
              <CitySearchInput city={value} onCitySelected={onChange} />
            )}
          />
        </ViewGap>
      }
      fixedBottomChildren={
        <ButtonPrimary
          type="submit"
          onPress={handleSubmit(onSubmit)}
          wording="Continuer"
          accessibilityLabel="Continuer vers l’adresse"
          disabled={!isValid}
        />
      }
    />
  )
}
