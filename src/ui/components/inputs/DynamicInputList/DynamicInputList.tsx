import React, { useState } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { ButtonTertiaryPrimary } from 'ui/components/buttons/ButtonTertiaryPrimary'
import { InputTextProps, RequiredIndicator } from 'ui/components/inputs/types'
import { Touchable } from 'ui/components/touchable/Touchable'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { InputText } from 'ui/designSystem/InputText/InputText'
import { PlainMore } from 'ui/svg/icons/PlainMore'
import { Trash } from 'ui/svg/icons/Trash'

type InputItem = {
  label: string
  value?: string
} & Partial<InputTextProps>

type DynamicInputListProps = {
  inputs: InputItem[]
  addMoreInputWording: string
  requiredIndicator?: RequiredIndicator
  initialValues?: string[]
  onValuesChange?: (values: string[]) => void
  autoFocus?: boolean
  errors?: (string | undefined)[]
}

type VisibleInput = {
  id: number
  label: string
  value: string
} & Partial<InputTextProps>

export const DynamicInputList = ({
  inputs,
  addMoreInputWording,
  requiredIndicator,
  initialValues,
  onValuesChange,
  autoFocus,
  errors,
}: DynamicInputListProps) => {
  const { icons, designSystem } = useTheme()

  const [visibleInputs, setVisibleInputs] = useState<VisibleInput[]>(() => {
    const firstInputIndex = 0
    const firstInput = inputs[firstInputIndex]
    if (!firstInput) return []
    return [{ id: firstInputIndex, value: initialValues?.[firstInputIndex] || '', ...firstInput }]
  })

  const maxInputsLength = inputs.length
  const maxVisibleInputsLenght = visibleInputs.length
  const canAddMoreInputs = maxVisibleInputsLenght < maxInputsLength

  const handleAddInput = () => {
    if (canAddMoreInputs) {
      const nextInput = inputs[maxVisibleInputsLenght]
      if (!nextInput) return
      const updated = [
        ...visibleInputs,
        {
          id: maxVisibleInputsLenght,
          value: initialValues?.[maxVisibleInputsLenght]?.trim() || '',
          ...nextInput,
        },
      ]
      setVisibleInputs(updated)
      onValuesChange?.(updated.map((i) => i.value.trim()).filter((v) => v !== ''))
    }
  }

  const handleRemoveInput = (id: number) => {
    setVisibleInputs((prev) => {
      const updated = prev.filter((input) => input.id !== id)
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
            <InputText
              onChangeText={(text) => handleChangeText(input.id, text)}
              requiredIndicator={index === 0 ? requiredIndicator : undefined}
              autoFocus={index === 0 ? autoFocus : false}
              errorMessage={input.value ? errors?.[index] : undefined}
              accessibilityHint={input.value ? errors?.[index] : undefined}
              {...input}
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
        <ButtonTertiaryPrimary
          icon={PlainMore}
          wording={addMoreInputWording}
          onPress={handleAddInput}
          justifyContent="flex-start"
          inline
        />
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
