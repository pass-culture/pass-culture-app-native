import React from 'react'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'

import { InputLabel } from 'ui/components/InputLabel.web'
import { InputContainer } from 'ui/components/inputs/InputContainer'
import { getSpacingString, Spacer } from 'ui/theme'

type Props = {
  label: string
  placeholder: string
  options: string[] | number[]
}

export function DropDownWithInputList({ label, placeholder, options }: Props) {
  const dropDownInputID = uuidv4()
  const listName = uuidv4()

  return (
    <InputContainer>
      <InputLabel htmlFor={dropDownInputID}>{label}</InputLabel>
      <Spacer.Column numberOfSpaces={2} />
      <InputList
        role="combobox"
        list={listName}
        id={dropDownInputID}
        name={dropDownInputID}
        placeholder={placeholder}
      />
      <DataList id={listName} role="listbox">
        {options.map((option: string | number) => (
          <Option key={option} value={option} />
        ))}
      </DataList>
    </InputContainer>
  )
}

const horizontalPadding = 4

const InputList = styled.input`
  ${({ theme }) => `
    width: calc(100% - ${getSpacingString(horizontalPadding * 2)});
    padding-right: ${getSpacingString(horizontalPadding)};
    padding-left: ${getSpacingString(horizontalPadding)};
    color: ${theme.colors.black};
    font-family: ${theme.fontFamily.regular};
    font-size: ${getSpacingString(3.75)};
    height: ${getSpacingString(10)};
    border-radius: ${theme.borderRadius.button}px;
    border: solid 1px ${theme.colors.greyMedium};
    background-color: ${theme.colors.white};
    cursor: pointer;

    &::-webkit-calendar-picker-indicator {
      display: none;/* remove default arrow */
    }

    &:after {
      content: url(https://i.stack.imgur.com/i9WFO.png);
      margin-left: -20px; 
      padding: .1em;
      pointer-events:none;
  }

    &:focus {
      border-color: ${theme.colors.primary};
    }
  `}
`

const DataList = styled.datalist``

const Option = styled.option``
