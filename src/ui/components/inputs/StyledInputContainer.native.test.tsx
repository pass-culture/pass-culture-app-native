import React from 'react'

import { render } from 'tests/utils'
import { StyledInputContainer } from 'ui/components/inputs/StyledInputContainer'
import { getSpacing } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

describe('<StyledInputContainer/>', () => {
  describe('inputHeight', () => {
    it('should render correctly if is small height', () => {
      const { getByTestId } = render(<StyledInputContainer inputHeight="small" />)
      const InputContainer = getByTestId('styled-input-container')
      expect(InputContainer.props.style[0].height).toEqual(getSpacing(10))
      expect(InputContainer.props.style[0].alignItems).toEqual('center')
      expect(InputContainer.props.style[0].borderRadius).toEqual(22)
    })

    it('should render correctly if is regular height', () => {
      const { getByTestId } = render(<StyledInputContainer inputHeight="regular" />)
      const InputContainer = getByTestId('styled-input-container')
      expect(InputContainer.props.style[0].height).toEqual(getSpacing(12))
      expect(InputContainer.props.style[0].alignItems).toEqual('center')
      expect(InputContainer.props.style[0].borderRadius).toEqual(22)
    })

    it('should render correctly if is tall height', () => {
      const { getByTestId } = render(<StyledInputContainer inputHeight="tall" />)
      const InputContainer = getByTestId('styled-input-container')
      expect(InputContainer.props.style[0].height).toEqual(getSpacing(23.5))
      expect(InputContainer.props.style[0].alignItems).toEqual('flex-start')
      expect(InputContainer.props.style[0].borderRadius).toEqual(16)
    })
  })

  it('should render correctly if isInputDisabled', () => {
    const { getByTestId } = render(<StyledInputContainer isInputDisabled={true} />)
    const InputContainer = getByTestId('styled-input-container')
    expect(InputContainer.props.style[0].backgroundColor).toEqual(ColorsEnum.GREY_LIGHT)
    expect(InputContainer.props.style[0].borderColor).toEqual(undefined)
  })

  it('should render correctly if isError', () => {
    const { getByTestId } = render(<StyledInputContainer isError={true} />)
    const InputContainer = getByTestId('styled-input-container')
    expect(InputContainer.props.style[0].backgroundColor).toEqual(ColorsEnum.WHITE)
    expect(InputContainer.props.style[0].borderColor).toEqual(ColorsEnum.ERROR)
  })

  it('should render correctly if isFocus', () => {
    const { getByTestId } = render(<StyledInputContainer isFocus={true} />)
    const InputContainer = getByTestId('styled-input-container')
    expect(InputContainer.props.style[0].backgroundColor).toEqual(ColorsEnum.WHITE)
    expect(InputContainer.props.style[0].borderColor).toEqual(ColorsEnum.PRIMARY)
  })
})
