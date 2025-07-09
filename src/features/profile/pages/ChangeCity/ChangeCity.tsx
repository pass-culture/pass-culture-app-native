import React from 'react'
import { Controller } from 'react-hook-form'
import styled from 'styled-components/native'

import { CitySearchInput } from 'features/profile/components/CitySearchInput/CitySearchInput'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { Typo, getSpacing } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

import { useSubmitChangeCity } from './useSubmitChangeCity'

export const ChangeCity = () => {
  const { control, handleSubmit, onSubmit, isValid, buttonWording, isLoading } =
    useSubmitChangeCity()

  return (
    <PageWithHeader
      title="Modifier ma ville de résidence"
      scrollChildren={
        <React.Fragment>
          <Container>
            <Typo.Title3 {...getHeadingAttrs(2)}>Renseigne ta ville de résidence</Typo.Title3>
          </Container>
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
          wording={buttonWording}
          disabled={!isValid}
          isLoading={isLoading}
        />
      }
    />
  )
}

const Container = styled.View({
  marginBottom: getSpacing(5),
})
