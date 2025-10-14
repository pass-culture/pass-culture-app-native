import React from 'react'
import { Controller } from 'react-hook-form'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { AddressOption } from 'features/identityCheck/components/AddressOption'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Form } from 'ui/components/Form'
import { InputError } from 'ui/components/inputs/InputError'
import { SearchInput } from 'ui/components/inputs/SearchInput'
import { Spinner } from 'ui/components/Spinner'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { Typo, getSpacing } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

import { useSubmitChangeAddress } from './useSubmitChangeAddress'

export const ChangeAddress = () => {
  const {
    control,
    handleSubmit,
    onSubmit,
    isValid,
    label,
    onChangeAddress,
    resetSearch,
    addresses,
    isLoading,
    shouldShowAddressResults,
    onAddressSelection,
    selectedAddress,
    hasError,
    buttonWording,
  } = useSubmitChangeAddress()

  const errorMessage =
    'Ton adresse ne doit pas contenir de caractères spéciaux ou n’être composée que d’espaces.'

  return (
    <PageWithHeader
      title="Modifier mon adresse"
      scrollChildren={
        <React.Fragment>
          <Form.MaxWidth>
            <Typo.Title3 {...getHeadingAttrs(2)}>Renseigne ton adresse</Typo.Title3>
            <Container>
              <Controller
                control={control}
                name="address"
                render={({ field: { value, onChange } }) => (
                  <SearchInput
                    onChangeText={(text) => {
                      onChangeAddress(text)
                      onChange(text)
                    }}
                    value={value}
                    label={label}
                    format="34 avenue de l’Opéra"
                    autoComplete="street-address"
                    textContentType="fullStreetAddress"
                    accessibilityHint={errorMessage}
                    onPressRightIcon={resetSearch}
                    returnKeyType="next"
                    testID="Entrée pour l’adresse"
                    searchInputID="street-address-input"
                  />
                )}
              />
              <InputError visible={hasError} errorMessage={errorMessage} numberOfSpacesTop={2} />
            </Container>
          </Form.MaxWidth>
          {shouldShowAddressResults ? (
            <React.Fragment>
              {isLoading ? <Spinner /> : null}
              <AdressesContainer accessibilityRole={AccessibilityRole.RADIOGROUP}>
                {addresses.map((address, index) => (
                  <AddressOption
                    label={address}
                    selected={address === selectedAddress}
                    onPressOption={onAddressSelection}
                    optionKey={address}
                    key={address}
                    accessibilityLabel={`Proposition d’adresse ${index + 1}\u00a0: ${address}`}
                  />
                ))}
              </AdressesContainer>
            </React.Fragment>
          ) : null}
        </React.Fragment>
      }
      fixedBottomChildren={
        <ButtonPrimary
          type="submit"
          onPress={handleSubmit(onSubmit)}
          wording={buttonWording}
          disabled={!isValid}
        />
      }
    />
  )
}

const AdressesContainer = styled.View({
  flexGrow: 1,
  overflowY: 'scroll',
  ...(Platform.OS === 'web' ? { boxSizing: 'content-box' } : {}),
})

const Container = styled.View({
  marginTop: getSpacing(5),
  marginBottom: getSpacing(2),
})
