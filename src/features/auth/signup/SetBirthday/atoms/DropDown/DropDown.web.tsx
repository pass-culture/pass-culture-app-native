import React from 'react'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'

import { InputLabel } from 'ui/components/InputLabel.web'
import { InputContainer } from 'ui/components/inputs/InputContainer'
import { ArrowDown } from 'ui/svg/icons/ArrowDown'
import { getSpacingString, Spacer } from 'ui/theme'

type Props = {
  label: string
  placeholder: string
  options: string[]
  onChange: (value: string) => void
  children?: never
  noBorderRadiusRight?: boolean
  noBorderRadiusLeft?: boolean
}

export function DropDown({
  label,
  placeholder,
  options,
  onChange,
  noBorderRadiusRight = false,
  noBorderRadiusLeft = false,
}: Props) {
  const onChangeDate: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    onChange(event.target.value)
  }

  const dropDownInputID = uuidv4()

  return (
    <InputContainer>
      <InputLabel htmlFor={dropDownInputID}>{label}</InputLabel>
      <Spacer.Column numberOfSpaces={2} />
      <SelectContainer>
        <Select
          role="listbox"
          id={dropDownInputID}
          onChange={onChangeDate}
          noBorderRadiusRight={noBorderRadiusRight}
          noBorderRadiusLeft={noBorderRadiusLeft}>
          <Option value="">{placeholder}</Option>
          {options.map((option) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>
        <IconContainer>
          <ArrowDown />
        </IconContainer>
      </SelectContainer>
    </InputContainer>
  )
}

const SelectContainer = styled.div`
  width: 100%;
  position: relative;
`

const IconContainer = styled.div`
  ${({ theme }) => `
    padding-right: ${getSpacingString(4)};
    display: flex;
    align-items: center;
    height: 100%;
    right: 0;
    top: 0;
    position: absolute;
    width: ${theme.icons.sizes.extraSmall}px;
    pointer-events: none;
  `}
`

const Select = styled.select<{ noBorderRadiusRight: boolean; noBorderRadiusLeft: boolean }>`
  ${({ theme, noBorderRadiusRight, noBorderRadiusLeft }) => `
    width: 100%;
    padding-right: ${getSpacingString(4)};
    padding-left: ${getSpacingString(4)};
    height: ${getSpacingString(10)};
    border-top-left-radius: ${
      noBorderRadiusLeft ? `${getSpacingString(1)};` : `${theme.borderRadius.button}px;`
    }
    border-bottom-left-radius: ${
      noBorderRadiusLeft ? `${getSpacingString(1)};` : `${theme.borderRadius.button}px;`
    }
    border-top-right-radius: ${
      noBorderRadiusRight ? `${getSpacingString(1)};` : `${theme.borderRadius.button}px;`
    }
    border-bottom-right-radius: ${
      noBorderRadiusRight ? `${getSpacingString(1)};` : `${theme.borderRadius.button}px;`
    }
    border: solid 1px ${theme.colors.greyMedium};
    cursor: pointer;
    background-color: ${theme.colors.white};
    appearance: none;

    &:focus, :active {
      border-color: ${theme.colors.primary};
    }

    &:invalid {
      color: green;
    }
  `}
`

const Option = styled.option``
