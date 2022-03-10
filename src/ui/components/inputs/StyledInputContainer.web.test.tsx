import React from 'react'

import { render } from 'tests/utils/web'
import { StyledInputContainer } from 'ui/components/inputs/StyledInputContainer'
import { getSpacingString } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

const borderRadius = (value: number) => ({
  borderTopLeftRadius: `${value}px`,
  borderTopRightRadius: `${value}px`,
  borderBottomLeftRadius: `${value}px`,
  borderBottomRightRadius: `${value}px`,
})

describe('<StyledInputContainer/>', () => {
  describe('inputHeight', () => {
    it('should render correctly if is small height', () => {
      const { getByTestId } = render(<StyledInputContainer inputHeight="small" />)
      const InputContainer = getByTestId('styled-input-container')
      expect(InputContainer).toHaveStyle({
        height: getSpacingString(10),
        alignItems: 'center',
        ...borderRadius(22),
      })
    })

    it('should render correctly if is regular height', () => {
      const { getByTestId } = render(<StyledInputContainer inputHeight="regular" />)
      const InputContainer = getByTestId('styled-input-container')
      expect(InputContainer).toHaveStyle({
        height: getSpacingString(12),
        alignItems: 'center',
        ...borderRadius(22),
      })
    })

    it('should render correctly if is tall height', () => {
      const { getByTestId } = render(<StyledInputContainer inputHeight="tall" />)
      const InputContainer = getByTestId('styled-input-container')
      expect(InputContainer).toHaveStyle({
        height: getSpacingString(23.5),
        alignItems: 'flex-start',
        ...borderRadius(16),
      })
    })
  })

  it('should render correctly if isInputDisabled', () => {
    const { getByTestId } = render(<StyledInputContainer isInputDisabled={true} />)
    const InputContainer = getByTestId('styled-input-container')
    expect(InputContainer).toHaveStyle({
      backgroundColor: ColorsEnum.GREY_LIGHT,
      borderColor: undefined,
    })
  })

  it('should render correctly if isError', () => {
    const { getByTestId } = render(<StyledInputContainer isError={true} />)
    const InputContainer = getByTestId('styled-input-container')
    expect(InputContainer).toHaveStyle({
      backgroundColor: ColorsEnum.WHITE,
    })
  })

  it('should render correctly if isFocus', () => {
    const { getByTestId } = render(<StyledInputContainer isFocus={true} />)
    const InputContainer = getByTestId('styled-input-container')
    expect(InputContainer).toHaveStyle({
      backgroundColor: ColorsEnum.WHITE,
    })
  })
})
