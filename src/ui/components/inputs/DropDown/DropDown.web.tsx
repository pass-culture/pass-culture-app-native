import React, { useState } from 'react'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'

import { InputLabel } from 'ui/components/InputLabel/InputLabel'
import { ContainerWithMaxWidth } from 'ui/components/inputs/ContainerWithMaxWidth'
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
  accessibilityLabel?: string
  isError?: boolean
}

export function DropDown({
  label,
  placeholder,
  options,
  onChange,
  noBorderRadiusRight = false,
  noBorderRadiusLeft = false,
  accessibilityLabel,
  isError = false,
}: Props) {
  const [isEmpty, setIsEmpty] = useState(true)
  const onChangeDate: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    onChange(event.target.value)
    setIsEmpty(!event.target.value)
  }

  const dropDownInputID = uuidv4()

  return (
    <ContainerWithMaxWidth>
      <InputLabel htmlFor={dropDownInputID}>{label}</InputLabel>
      <Spacer.Column numberOfSpaces={2} />
      <SelectContainer>
        <StyledSelect
          aria-label={accessibilityLabel}
          data-testid={`select-${label}`}
          id={dropDownInputID}
          onChange={onChangeDate}
          isEmpty={isEmpty}
          noBorderRadiusRight={noBorderRadiusRight}
          noBorderRadiusLeft={noBorderRadiusLeft}
          isError={isError}>
          <StyledOption value="">{placeholder}</StyledOption>
          {options.map((option) => (
            <StyledOption key={option} value={option} data-testid="select-option">
              {option}
            </StyledOption>
          ))}
        </StyledSelect>
        <IconContainer>
          <ArrowDown />
        </IconContainer>
      </SelectContainer>
    </ContainerWithMaxWidth>
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
type SelectProps = {
  noBorderRadiusRight: boolean
  noBorderRadiusLeft: boolean
  isEmpty: boolean
  isError: boolean
}

const StyledSelect = styled.select<SelectProps>`
  ${({ theme, noBorderRadiusRight, noBorderRadiusLeft, isEmpty, isError }) => {
    const borderRadiusLeft = noBorderRadiusLeft ? noBorderRadius : `${theme.borderRadius.button}px`
    const borderRadiusRight = noBorderRadiusRight
      ? noBorderRadius
      : `${theme.borderRadius.button}px`
    const { fontFamily, fontSize, color, lineHeight } = isEmpty
      ? theme.typography.placeholder
      : theme.typography.body
    return `
    font-family: ${fontFamily};
    font-size: ${fontSize}px;
    line-height: ${lineHeight};
    color: ${color};
    width: 100%;
    padding-right: ${getSpacingString(4)};
    padding-left: ${getSpacingString(4)};
    height: ${getSpacingString(10)};
    border-top-left-radius: ${borderRadiusLeft};
    border-bottom-left-radius: ${borderRadiusLeft};
    border-top-right-radius: ${borderRadiusRight};
    border-bottom-right-radius: ${borderRadiusRight};
    border: solid 1px ${isError ? theme.colors.error : theme.colors.greyDark};
    cursor: pointer;
    background-color: ${theme.colors.white};
    appearance: none;
    &:focus-visible, &:active {
      border-color: ${theme.colors.primary};
    }
  `
  }}
`

/*
The fonts supported by <option/> are native browser fonts.
That's why we can't use our theme's font.
Note: Font-Family is only used by Firefox.
*/
const StyledOption = styled.option`
  font-family: 'Arial', sans-serif;
`
