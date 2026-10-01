import React, { forwardRef } from 'react'
import { Platform, TextInput as RNTextInput } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { hiddenFromScreenReader } from 'shared/accessibility/helpers/hiddenFromScreenReader'
import { useMobileFontScaleToDisplay } from 'shared/accessibility/helpers/zoomHelpers'
import { FlexInputLabel } from 'ui/components/InputLabel/FlexInputLabel'
import { LabelContainer } from 'ui/components/inputs/LabelContainer'
import {
  OneTimePasswordInputField,
  SIZE_TO_HEIGHT,
} from 'ui/components/inputs/OneTimePasswordInput/OneTimePasswordInputField'
import { useOneTimePasswordInput } from 'ui/components/inputs/OneTimePasswordInput/useOneTimePasswordInput'
import {
  getCustomTextInputProps,
  getRNTextInputProps,
  TextInputProps,
} from 'ui/components/inputs/types'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { ErrorFilled } from 'ui/svg/icons/ErrorFilled'
import { Typo } from 'ui/theme'

const hiddenFromScreenReaderMobile = Platform.OS === 'web' ? {} : hiddenFromScreenReader()
const FORMAT_EXAMPLE_BASE = '538299'

export interface OneTimePasswordInputProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  code: string[]
  onCodeChange: (code: string[]) => void
  numberOfInputs?: number
  size?: keyof ReturnType<typeof SIZE_TO_HEIGHT>
}

const WithRefOneTimePasswordInput: React.ForwardRefRenderFunction<
  RNTextInput,
  OneTimePasswordInputProps
> = ({ code, onCodeChange, numberOfInputs = 6, size = 'regular', ...props }, forwardedRef) => {
  const {
    values,
    invalidIndexes,
    focusedIndex,
    setFocusedIndex,
    setInputRef,
    handleChangeText,
    handleBackspace,
  } = useOneTimePasswordInput({
    code,
    numberOfInputs,
    onCodeChange,
  })

  const nativeProps = getRNTextInputProps(props)
  const customProps = getCustomTextInputProps(props)

  const textInputID = nativeProps.testID ?? uuidv4()

  const inputLabel =
    customProps.requiredIndicator === 'symbol' ? `${customProps.label}\u00A0*` : customProps.label

  const formatExample = Array.from(
    { length: numberOfInputs },
    (_, index) => FORMAT_EXAMPLE_BASE[index % FORMAT_EXAMPLE_BASE.length]
  ).join('')

  const description = `Format\u00a0: ${formatExample}`

  const descriptionAndRequired = (
    <React.Fragment>
      <LabelTextContainer>
        <Typo.Body style={props.labelStyle}>{inputLabel}</Typo.Body>
        <Description>{description}</Description>
      </LabelTextContainer>
      {customProps.requiredIndicator === 'explicit' ? (
        <StyledBodyAccentXs>Obligatoire</StyledBodyAccentXs>
      ) : null}
    </React.Fragment>
  )

  const labels = useMobileFontScaleToDisplay({
    default: descriptionAndRequired,
    at200PercentZoom: <FlexViewColumn>{descriptionAndRequired}</FlexViewColumn>,
  })

  const errorMessage =
    invalidIndexes.length > 0 ? 'Le code saisi est invalide.' : customProps.errorMessage

  const hasGenericError = !!customProps.errorMessage

  const handleInputRef = (index: number, ref: RNTextInput | null) => {
    setInputRef(index, ref)
    if (index === 0) {
      if (typeof forwardedRef === 'function') forwardedRef(ref)
      else if (forwardedRef) forwardedRef.current = ref
    }
  }

  return (
    <Container>
      <FlexInputLabel htmlFor={textInputID}>
        <LabelContainer {...hiddenFromScreenReaderMobile}>{labels}</LabelContainer>
      </FlexInputLabel>
      <InputsContainer gap={2}>
        {Array.from({ length: numberOfInputs }).map((_, index) => {
          const value = values[index] ?? ''
          const isInvalidInput = invalidIndexes.includes(index)
          const isError = hasGenericError || isInvalidInput
          return (
            <OneTimePasswordInputField
              key={index}
              index={index} // Safe to use index as key: inputs are fixed and never reordered.
              value={value}
              numberOfInputs={numberOfInputs}
              size={size}
              label={customProps.label}
              isError={isError}
              isDisabled={!!customProps.disabled}
              isFocused={focusedIndex === index}
              textInputID={textInputID}
              textInputProps={nativeProps}
              setInputRef={handleInputRef}
              handleChangeText={handleChangeText}
              handleBackspace={handleBackspace}
              setFocusedIndex={setFocusedIndex}
            />
          )
        })}
      </InputsContainer>
      {errorMessage ? (
        <ErrorContainer {...hiddenFromScreenReaderMobile}>
          <ErrorIcon />
          <ErrorText>{errorMessage}</ErrorText>
        </ErrorContainer>
      ) : null}
    </Container>
  )
}

export const OneTimePasswordInput = forwardRef<RNTextInput, OneTimePasswordInputProps>(
  WithRefOneTimePasswordInput
)

const Container = styled.View({
  alignItems: 'flex-start',
  width: '100%',
})

const InputsContainer = styled(ViewGap)({
  flexDirection: 'row',
  flexWrap: 'wrap',
})

const StyledBodyAccentXs = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const FlexViewColumn = styled.View({
  flexDirection: 'column',
})

const Description = styled(StyledBodyAccentXs)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.xxs,
}))

const LabelTextContainer = styled.View({
  flex: 1,
  minWidth: 0,
})

const ErrorContainer = styled.View(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: theme.designSystem.size.spacing.xs,
}))

const ErrorText = styled(Typo.BodyAccentS)(({ theme }) => ({
  color: theme.designSystem.color.text.error,
  marginLeft: theme.designSystem.size.spacing.xs,
}))

const ErrorIcon = styled(ErrorFilled).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.error,
  size: theme.designSystem.size.icon.s,
}))({ flexShrink: 0 })
