import React from 'react'

import { render, fireEvent } from 'tests/utils/web'
import { Close } from 'ui/svg/icons/Close'

import { SectionRow } from './SectionRow'

describe('SectionRow', () => {
  describe('onPress', () => {
    it('should call onPress when "clickable"', () => {
      const method = jest.fn()
      const { getByText } = render(
        <SectionRow type="clickable" title="just clickable" icon={Close} onPress={method} />
      )
      const touchable = getByText('just clickable')

      fireEvent.click(touchable)
      expect(method).toHaveBeenCalledTimes(1)
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
