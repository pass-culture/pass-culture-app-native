import React from 'react'
import { Controller } from 'react-hook-form'
import styled from 'styled-components/native'

import { CitySearchInput } from 'features/profile/components/CitySearchInput/CitySearchInput'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { Typo } from 'ui/theme'
import { setTextSemantic } from 'ui/theme/typographyAttrs/setTextSemantic'

import { useSubmitChangeCity } from './useSubmitChangeCity'

export const ChangeCity = () => {
  const {
    control,
    handleSubmit,
    onSubmit,
    isValid,
    buttonWording,
    isPending,
    tertiaryButton,
    title,
  } = useSubmitChangeCity()

  const submitButton = (
    <Button
      type="submit"
      onPress={handleSubmit(onSubmit)}
      wording={buttonWording}
      disabled={!isValid}
      isLoading={isPending}
    />
  )
  return (
    <PageWithHeader
      shouldLimitWidth
      title={title}
      scrollChildren={
        <React.Fragment>
          <Container>
            <Typo.Title3 {...setTextSemantic('h2')}>Renseigne ta ville de résidence</Typo.Title3>
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
        tertiaryButton ? (
          <ViewGap gap={4}>
            <Button
              variant="tertiary"
              color="neutral"
              onPress={tertiaryButton.onPress}
              wording={tertiaryButton.wording}
              icon={tertiaryButton.icon}
            />
            {submitButton}
          </ViewGap>
        ) : (
          submitButton
        )
      }
    />
  )
}

const Container = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.xl,
}))
