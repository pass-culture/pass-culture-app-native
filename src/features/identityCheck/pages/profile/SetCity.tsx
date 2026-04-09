import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation, useRoute } from '@react-navigation/native'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { object, string } from 'yup'

import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'
import { cityActions, useCity } from 'features/identityCheck/pages/profile/store/cityStore'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { getSubscriptionHookConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionHookConfig'
import { CitySearchInput } from 'features/profile/components/CitySearchInput/CitySearchInput'
import { SuggestedCity } from 'libs/place/types'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
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

export const SetCity = () => {
  const { params } = useRoute<UseRouteType<'SetCity'>>()
  const type = params?.type ?? ProfileTypes.IDENTITY_CHECK // Fallback to most common scenario

  const identityCheckAndRecapExistingDataConfig = { headerTitle: 'Profil' }
  const pageConfigByType = {
    [ProfileTypes.IDENTITY_CHECK]: identityCheckAndRecapExistingDataConfig,
    [ProfileTypes.BOOKING_FREE_OFFER_15_16]: { headerTitle: 'Informations personnelles' },
    [ProfileTypes.RECAP_EXISTING_DATA]: identityCheckAndRecapExistingDataConfig,
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
    navigate(...getSubscriptionHookConfig('SetAddress', { type }))
  }

  return (
    <PageWithHeader
      title={pageConfigByType[type].headerTitle}
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
        <Button
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
