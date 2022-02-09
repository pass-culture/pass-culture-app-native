import React from 'react'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'

import { InputLabel } from 'ui/components/InputLabel.web'
import { InputContainer } from 'ui/components/inputs/InputContainer'
import { getSpacingString, Spacer } from 'ui/theme'

type Props = {
  label: string
  placeholder: string
  options: string[]
  onChange: (value: string) => void
  children?: never
}

export function DropDown({ label, placeholder, options, onChange }: Props) {
  const onChangeDate: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    onChange(event.target.value)
  }

  const dropDownInputID = uuidv4()

  return (
    <InputContainer>
      <InputLabel htmlFor={dropDownInputID}>{label}</InputLabel>
      <Spacer.Column numberOfSpaces={2} />
      <Select onChange={onChangeDate}>
        <Option value="">{placeholder}</Option>
        {options.map((option) => (
          <Option key={option} value={option}>
            {option}
          </Option>
        ))}
      </Select>
    </InputContainer>
  )
}

const Select = styled.select`
  ${({ theme }) => `
  width: 100%;
  padding-right: ${getSpacingString(4)};
  padding-left: ${getSpacingString(4)};
  height: ${getSpacingString(10)};
  padding-top: ${getSpacingString(1)};
  padding-bottom: ${getSpacingString(1)};
  border-radius: ${theme.borderRadius.button}px;
  border: solid 1px ${theme.colors.greyMedium};
  cursor: pointer;

  &:focus, :active {
    border-color: ${theme.colors.primary};
  }
`}
`

const Option = styled.option``
