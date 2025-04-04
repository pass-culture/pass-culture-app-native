import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { object, string } from 'yup'

import { CenteredTitle } from 'features/identityCheck/components/CenteredTitle'
import { cityActions, useCity } from 'features/identityCheck/pages/profile/store/cityStore'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { CitySearchInput } from 'features/profile/components/CitySearchInput/CitySearchInput'
import { analytics } from 'libs/analytics/provider'
import { SuggestedCity } from 'libs/place/types'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { Spacer } from 'ui/theme'

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
  const { navigate } = useNavigation<UseNavigationType>()
  const storedCity = useCity()
  const { setCity } = cityActions
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
    setCity(city)
    analytics.logSetPostalCodeClicked()
    navigate('SetAddress')
  }

  return (
    <PageWithHeader
      title="Profil"
      scrollChildren={
        <React.Fragment>
          <CenteredTitle title="Renseigne ta ville de résidence" />
          <Spacer.Column numberOfSpaces={5} />

          <Controller
            control={control}
            name="city"
            render={({ field: { value, onChange } }) => (
              <CitySearchInput city={value} onCitySelected={onChange} />
            )}
          />
        </React.Fragment>
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
