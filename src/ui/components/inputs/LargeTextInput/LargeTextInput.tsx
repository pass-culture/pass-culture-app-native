import React, { forwardRef } from 'react'
import { TextInput as RNTextInput } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { InputError } from 'ui/components/inputs/InputError'
import { TextInput } from 'ui/components/inputs/TextInput'
import { TextInputProps } from 'ui/components/inputs/types'
import { Typo, getSpacing } from 'ui/theme'

interface LargeTextInputProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  label: string
  value: string
  onChangeText: (suggestion: string) => void
  showErrorMessage: boolean
  errorMessage?: string
  containerHeight?: number
  maxValueLength?: number
}

const WithRefLargeTextInput: React.ForwardRefRenderFunction<RNTextInput, LargeTextInputProps> = (
  {
    label,
    value,
    onChangeText,
    containerHeight,
    maxLength,
    showErrorMessage,
    errorMessage,
    ...inputProps
  },
  forwardedRef
) => {
  const feedbackInAppInputErrorId = uuidv4()

  const maxValueLength = maxLength ?? 800

  return (
    <React.Fragment>
      <TextInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        containerStyle={{ height: containerHeight ?? getSpacing(50) }}
        multiline
        accessibilityDescribedBy={feedbackInAppInputErrorId}
        maxLength={maxValueLength + 25}
        ref={forwardedRef}
        {...inputProps}
      />
      <FooterContainer>
        <InputErrorContainer>
          <InputError
            visible={!!showErrorMessage}
            errorMessage={errorMessage ?? 'Tu as atteint le nombre de caractères maximal.'}
            relatedInputId={feedbackInAppInputErrorId}
            numberOfSpacesTop={0}
          />
        </InputErrorContainer>
        <CountContainer>
          <CaptionNeutralInfo>
            {value ? value.length : 0} / {maxValueLength}
          </CaptionNeutralInfo>
        </CountContainer>
      </FooterContainer>
    </React.Fragment>
  )
}

export const LargeTextInput = forwardRef<RNTextInput, LargeTextInputProps>(WithRefLargeTextInput)

const FooterContainer = styled.View(({ theme }) => ({
  maxWidth: theme.contentPage.maxWidth,
  marginVertical: getSpacing(2),
  flexDirection: 'row',
}))

const InputErrorContainer = styled.View({
  flex: 1,
})

const CountContainer = styled.View({
  textAlign: 'end',
  width: getSpacing(18),
})

const CaptionNeutralInfo = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))
