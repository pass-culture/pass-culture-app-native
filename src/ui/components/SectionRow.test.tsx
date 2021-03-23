import { render } from '@testing-library/react-native'
import React from 'react'

import { Close } from 'ui/svg/icons/Close'

import { SectionRow } from './SectionRow'

describe('SectionRow', () => {
  describe('onPress', () => {
    it('should call onPress when "clickable"', () => {
      const method = jest.fn()
      const { getByTestId } = render(
        <SectionRow type="clickable" title="just clickable" icon={Close} onPress={method} />
      )
      const touchable = getByTestId('section-row-touchable')

      touchable.props.onClick()
      expect(method).toBeCalled()
    })
  })

  describe('type', () => {
    it('should render the next arrow icon when type is "navigable"', () => {
      const method = jest.fn()
      const { getByTestId } = render(
        <SectionRow type="navigable" title="navigable" icon={Close} onPress={method} />
      )
      getByTestId('section-row-navigable-icon')
    })
    it('should render the given cta when type is "clickable"', () => {
      const { getByTestId, queryByTestId } = render(
        <SectionRow
          type="clickable"
          title="just clickable"
          icon={Close}
          cta={<Close testID="cta-close-icon" />}
        />
      )
      getByTestId('cta-close-icon')

      const navigationIcon = queryByTestId('section-row-navigable-icon')
      expect(navigationIcon).toBeNull()
    })
  })
})
