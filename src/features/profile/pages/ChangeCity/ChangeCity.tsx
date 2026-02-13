import React from 'react'
import { Controller } from 'react-hook-form'
import styled from 'styled-components/native'

import { CitySearchInput } from 'features/profile/components/CitySearchInput/CitySearchInput'
import { Button } from 'ui/designSystem/Button/Button'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

import { useSubmitChangeCity } from './useSubmitChangeCity'

export const ChangeCity = () => {
  const { control, handleSubmit, onSubmit, isValid, buttonWording, isPending } =
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
        <Button
          type="submit"
          onPress={handleSubmit(onSubmit)}
          wording={buttonWording}
          disabled={!isValid}
          isLoading={isPending}
        />
      }
    />
  )
}

const Container = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.xl,
}))
