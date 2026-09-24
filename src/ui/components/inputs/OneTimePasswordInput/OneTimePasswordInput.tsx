import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { Platform, TextInput as RNTextInput } from 'react-native'
import styled, { DefaultTheme } from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { hiddenFromScreenReader } from 'shared/accessibility/helpers/hiddenFromScreenReader'
import { useMobileFontScaleToDisplay } from 'shared/accessibility/helpers/zoomHelpers'
import { FlexInputLabel } from 'ui/components/InputLabel/FlexInputLabel'
import { BaseTextInput } from 'ui/components/inputs/BaseTextInput'
import { LabelContainer } from 'ui/components/inputs/LabelContainer'
import {
  getCustomTextInputProps,
  getRNTextInputProps,
  TextInputProps,
} from 'ui/components/inputs/types'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { TextInputContainer } from 'ui/designSystem/TextInput/TextInputContainer'
import { ErrorFilled } from 'ui/svg/icons/ErrorFilled'
import { Typo } from 'ui/theme'

const hiddenFromScreenReaderMobile = Platform.OS === 'web' ? {} : hiddenFromScreenReader()
const FORMAT_EXAMPLE_BASE = '538299'

const SIZE_TO_HEIGHT = (theme: DefaultTheme) => ({
  small: theme.inputs.height.small,
  regular: theme.inputs.height.regular,
  tall: theme.inputs.height.tall,
})

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
  const inputRefs = useRef<Array<RNTextInput | null>>([])
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)

  const nativeProps = getRNTextInputProps(props)
  const customProps = getCustomTextInputProps(props)

  const values = Array.from({ length: numberOfInputs }, (_, index) => code[index] ?? '')
  const valuesRef = useRef(values)

  const syncValuesRef = () => {
    valuesRef.current = values
  }

  useEffect(syncValuesRef, [values])

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

  const handlePaste = (inputValue: string) => {
    const characters = inputValue.toUpperCase().slice(0, numberOfInputs).split('')
    const nextValues = Array.from({ length: numberOfInputs }, (_, index) => characters[index] ?? '')
    valuesRef.current = nextValues
    onCodeChange(nextValues)
    const lastFilledIndex = characters.length - 1
    if (lastFilledIndex >= 0) inputRefs.current[lastFilledIndex]?.focus()
  }

  const handleChangeText = (inputValue: string, index: number) => {
    const normalizedValue = inputValue.toUpperCase()

    if (normalizedValue.length > 1) {
      handlePaste(normalizedValue)
      return
    }

    if (!normalizedValue) return

    const nextValues = [...valuesRef.current]
    nextValues[index] = normalizedValue
    valuesRef.current = nextValues
    onCodeChange(nextValues)

    const nextIndex = (index + 1) % numberOfInputs
    inputRefs.current[nextIndex]?.focus()
  }

  const handleKeyPress = (index: number) => {
    const currentValues = valuesRef.current

    if (currentValues[index]) {
      const nextValues = [...currentValues]
      nextValues[index] = ''
      valuesRef.current = nextValues
      onCodeChange(nextValues)
      return
    }

    if (index > 0) {
      const previousIndex = index - 1
      const nextValues = [...currentValues]
      nextValues[previousIndex] = ''
      valuesRef.current = nextValues
      onCodeChange(nextValues)
      inputRefs.current[previousIndex]?.focus()
    }
  }

  const hasInvalidInput = values.some((value) => value !== '' && !/^\d$/.test(value))
  const errorMessage = hasInvalidInput ? 'Le code saisi est invalide.' : customProps.errorMessage
  const hasGenericError = !!customProps.errorMessage

  return (
    <Container>
      <FlexInputLabel htmlFor={textInputID}>
        <LabelContainer {...hiddenFromScreenReaderMobile}>{labels}</LabelContainer>
      </FlexInputLabel>
      <InputsContainer gap={2}>
        {Array.from({ length: numberOfInputs }).map((_, index) => {
          const value = values[index] ?? ''
          const isInvalidInput = value !== '' && !/^\d$/.test(value)
          const isError = hasGenericError || isInvalidInput
          return (
            <StyledTextInputContainer
              key={`${textInputID}-${index}`}
              size={size}
              isError={isError}
              isDisabled={!!customProps.disabled}
              isFocused={focusedIndex === index}>
              <StyledBaseTextInput
                {...nativeProps}
                nativeID={`${textInputID}-${index}`}
                accessibilityLabel={`${customProps.label} - caractère ${index + 1} sur ${numberOfInputs}`}
                ref={(ref) => {
                  inputRefs.current[index] = ref
                  if (index === 0) {
                    if (typeof forwardedRef === 'function') forwardedRef(ref)
                    else if (forwardedRef) forwardedRef.current = ref
                  }
                }}
                value={value}
                disabled={customProps.disabled}
                keyboardType="number-pad"
                maxLength={numberOfInputs}
                selectTextOnFocus
                onChangeText={(inputValue) => handleChangeText(inputValue, index)}
                onKeyPress={(event) => {
                  if (event.nativeEvent.key !== 'Backspace') return
                  handleKeyPress(index)
                }}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(null)}
              />
            </StyledTextInputContainer>
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

const StyledTextInputContainer = styled(TextInputContainer)<{
  size: keyof ReturnType<typeof SIZE_TO_HEIGHT>
}>(({ theme, size }) => ({
  width: SIZE_TO_HEIGHT(theme)[size],
  height: SIZE_TO_HEIGHT(theme)[size],
  justifyContent: 'center',
}))

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

const StyledBaseTextInput = styled(BaseTextInput)({
  textAlign: 'center',
})
