import React, { useRef, useState } from 'react'
import { TextInput as RNTextInput } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { ButtonContainerFlexStart } from 'ui/components/buttons/ButtonContainerFlexStart'
import { TextInputProps, RequiredIndicator } from 'ui/components/inputs/types'
import { Touchable } from 'ui/components/touchable/Touchable'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { TextInput } from 'ui/designSystem/TextInput/TextInput'
import { PlainMore } from 'ui/svg/icons/PlainMore'
import { Trash } from 'ui/svg/icons/Trash'

type InputItem = {
  label: string
  value?: string
} & Partial<TextInputProps>

type DynamicInputListProps = {
  inputs: InputItem[]
  addMoreInputWording: string
  requiredIndicator?: RequiredIndicator
  initialValues?: string[]
  onValuesChange?: (values: string[]) => void
  errors?: (string | undefined)[]
  autocomplete?: TextInputProps['autoComplete']
}

type VisibleInput = {
  id: number
  label: string
  value: string
} & Partial<TextInputProps>

export const DynamicInputList = ({
  inputs,
  addMoreInputWording,
  requiredIndicator,
  initialValues,
  onValuesChange,
  errors,
  autocomplete,
}: DynamicInputListProps) => {
  const inputRefs = useRef<Array<RNTextInput | null>>([])

  const { icons, designSystem } = useTheme()

  const [visibleInputs, setVisibleInputs] = useState<VisibleInput[]>(() => {
    const firstInputIndex = 0
    if (initialValues && initialValues.length > 0) {
      return initialValues
        .map((value, index) => {
          const inputConfig = inputs[index]
          if (!inputConfig) {
            return null
          }
          return {
            id: index,
            value: value || '',
            ...inputConfig,
          }
        })
        .filter((input): input is VisibleInput => input !== null)
    }

    const firstInput = inputs[firstInputIndex]
    if (!firstInput) return []
    return [{ id: firstInputIndex, value: '', ...firstInput }]
  })

  const maxInputsLength = inputs.length
  const maxVisibleInputsLength = visibleInputs.length
  const canAddMoreInputs = maxVisibleInputsLength < maxInputsLength

  const handleAddInput = () => {
    if (!canAddMoreInputs) return

    const nextInput = inputs[maxVisibleInputsLength]
    if (!nextInput) return

    const updated = [
      ...visibleInputs,
      {
        id: maxVisibleInputsLength,
        value: initialValues?.[maxVisibleInputsLength]?.trim() || '',
        ...nextInput,
      },
    ]

    setVisibleInputs(updated)

    onValuesChange?.(updated.map((i) => i.value.trim()).filter((v) => v !== ''))

    requestAnimationFrame(() => inputRefs.current[maxVisibleInputsLength]?.focus())
  }

  const handleRemoveInput = (id: number) => {
    setVisibleInputs((prev) => {
      const updated = prev.filter((input) => input.id !== id)
      inputRefs.current = inputRefs.current.slice(0, updated.length)
      onValuesChange?.(updated.map((i) => i.value.trim()).filter((v) => v !== ''))
      return updated
    })
  }

  const handleChangeText = (id: number, text: string) => {
    setVisibleInputs((prev) => {
      const updated = prev.map((input) => (input.id === id ? { ...input, value: text } : input))
      onValuesChange?.(updated.map((i) => i.value.trim()).filter((v) => v !== ''))
      return updated
    })
  }

  const displayCanAddMoreButton = addMoreInputWording && canAddMoreInputs

  return (
    <Container gap={4}>
      {visibleInputs.map((input, index) => (
        <InputWrapper key={input.label}>
          <InputFieldContainer>
            <TextInput
              ref={(ref) => {
                inputRefs.current[index] = ref
              }}
              onChangeText={(text) => handleChangeText(input.id, text)}
              requiredIndicator={index === 0 ? requiredIndicator : undefined}
              errorMessage={input.value ? errors?.[index] : undefined}
              accessibilityHint={input.value ? errors?.[index] : undefined}
              {...input}
              autoComplete={autocomplete}
            />
          </InputFieldContainer>
          {index > 0 ? (
            <DeleteButton
              accessibilityLabel={`Supprimer le champ ${input.label}`}
              onPress={() => handleRemoveInput(input.id)}>
              <Trash size={icons.sizes.small} color={designSystem.color.icon.brandPrimary} />
            </DeleteButton>
          ) : null}
        </InputWrapper>
      ))}
      {displayCanAddMoreButton ? (
        <ButtonContainerFlexStart>
          <Button
            variant="secondary"
            size="small"
            icon={PlainMore}
            wording={addMoreInputWording}
            onPress={handleAddInput}
          />
        </ButtonContainerFlexStart>
      ) : null}
    </Container>
  )
}

const Container = styled(ViewGap)({
  width: '100%',
})

const InputWrapper = styled.View({
  flexDirection: 'row',
  alignItems: 'flex-end',
  width: '100%',
})

const InputFieldContainer = styled.View({
  flex: 1,
})

const DeleteButton = styled(Touchable)(({ theme }) => ({
  minWidth: theme.inputs.height.small,
  minHeight: theme.inputs.height.small,
  justifyContent: 'center',
  alignItems: 'center',
}))
