import React from 'react'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'

import { InputLabel } from 'ui/components/InputLabel.web'
import { InputContainer } from 'ui/components/inputs/InputContainer'
import { ArrowDown } from 'ui/svg/icons/ArrowDown'
import { getSpacingString, Spacer } from 'ui/theme'
import { Option } from 'ui/web/form/Option.web'
import { Select } from 'ui/web/form/Select.web'

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
        <StyledSelect
          data-testid="select"
          role="listbox"
          id={dropDownInputID}
          onChange={onChangeDate}
          noBorderRadiusRight={noBorderRadiusRight}
          noBorderRadiusLeft={noBorderRadiusLeft}>
          <Option role="option" value="">
            {placeholder}
          </Option>
          {options.map((option) => (
            <Option role="option" key={option} value={option} data-testid="select-option">
              {option}
            </Option>
          ))}
        </StyledSelect>
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

const noBorderRadius = getSpacingString(1)
const StyledSelect = styled(Select)<{ noBorderRadiusRight: boolean; noBorderRadiusLeft: boolean }>`
  ${({ theme, noBorderRadiusRight, noBorderRadiusLeft }) => {
    const borderRadiusLeft = noBorderRadiusLeft ? noBorderRadius : `${theme.borderRadius.button}px`
    const borderRadiusRight = noBorderRadiusRight
      ? noBorderRadius
      : `${theme.borderRadius.button}px`
    return `
    font-family: ${theme.fontFamily.regular};
    font-size: ${getSpacingString(3.75)};
    color: ${theme.colors.black};
    width: 100%;
    padding-right: ${getSpacingString(4)};
    padding-left: ${getSpacingString(4)};
    height: ${getSpacingString(10)};
    border-top-left-radius: ${borderRadiusLeft};
    border-bottom-left-radius: ${borderRadiusLeft};
    border-top-right-radius: ${borderRadiusRight};
    border-bottom-right-radius: ${borderRadiusRight};
    border: solid 1px ${theme.colors.greyMedium};
    cursor: pointer;
    background-color: ${theme.colors.white};
    appearance: none;

    &:focus, :active {
      border-color: ${theme.colors.primary};
    }
  `
  }}
`
