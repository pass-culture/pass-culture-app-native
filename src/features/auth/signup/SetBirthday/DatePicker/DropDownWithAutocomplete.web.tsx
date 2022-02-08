import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'

import { InputLabel } from 'ui/components/InputLabel.web'
import { InputContainer } from 'ui/components/inputs/InputContainer'
import { StyledInputContainer } from 'ui/components/inputs/StyledInputContainer'
import { getSpacingString, Spacer } from 'ui/theme'
import { Li } from 'ui/web/list/Li'

type Props = {
  label: string
  placeholder: string
  options: string[]
}

// TODO (LucasBeneston) : This is a test
export function DropDownWithAutocomplete({ label, placeholder, options }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [searchResults, setSearchResults] = useState<string[]>([])
  const [selectedOption, setSelectedOption] = useState<string | number | null>(null)

  const toggling = () => setIsOpen(!isOpen)

  const handleChange = (e: { target: { value: React.SetStateAction<string> } }) => {
    setSearchValue(e.target.value)
  }

  const onOptionClicked = (value: string) => {
    setSelectedOption(value)
    setSearchValue('')
    setIsOpen(false)
  }

  const onKeyDown = (e: { key: string }) => {
    if (!isOpen && e.key === 'Enter') {
      setIsOpen(true)
    }
  }

  useEffect(() => {
    const results = options.filter((option) =>
      option.toString().toLowerCase().includes(searchValue)
    )
    setSearchResults(results)
  }, [searchValue])

  const dropDownInputID = uuidv4()

  return (
    <InputContainer>
      <InputLabel htmlFor={dropDownInputID}>{label}</InputLabel>
      <Spacer.Column numberOfSpaces={2} />
      <StyledInputContainer isFocus={isOpen}>
        <SearchInput
          id={dropDownInputID}
          type="text"
          placeholder={placeholder}
          value={selectedOption || searchValue}
          onChange={handleChange}
          onClick={toggling}
          onKeyDown={onKeyDown}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
        />
      </StyledInputContainer>
      {isOpen || searchValue ? (
        <Ul>
          {searchResults.map((option) => (
            <Li key={option}>
              <Button onMouseDown={() => onOptionClicked(option)}>{option}</Button>
            </Li>
          ))}
        </Ul>
      ) : null}
    </InputContainer>
  )
}

const SearchInput = styled.input`
  ${({ theme }) => ` 
    width: 100%;
    padding: 0;
    color: ${theme.colors.black};
    font-family: ${theme.fontFamily.regular};
    font-size: ${getSpacingString(3.75)};
    height: 100%;
    border: none;
  `}
`

const Ul = styled.ul`
  ${({ theme }) => ` 
    width: 100%;
    display: block;
    position: absolute;
    left: 0;
    top: 100%;
    background-color: ${theme.colors.white};
    border: 1px solid ${theme.colors.greyLight};
    border-radius: ${getSpacingString(1)};
    max-height: ${getSpacingString(50)};
    overflow: scroll;
    margin-top: ${getSpacingString(2)};
    -webkit-overflow-scrolling: touch;
    overflow-y: scroll;
  `}
`

const Button = styled.button`
  ${({ theme }) => `
    width: 100%;
    padding-right: ${getSpacingString(4)};
    padding-left: ${getSpacingString(4)};
    padding-top: ${getSpacingString(2)};
    padding-bottom: ${getSpacingString(2)};
    background-color: ${theme.colors.white};
    text-align: start;
    border: none;
    cursor: pointer;

    &:hover {
      background-color: ${theme.colors.greyLight};
    }

    &:focus {
      background-color: ${theme.colors.greyLight};
    }
  `}
`
