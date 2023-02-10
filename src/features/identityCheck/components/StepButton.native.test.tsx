import React from 'react'

import { StepButton } from 'features/identityCheck/components/StepButton'
import { StepConfig } from 'features/identityCheck/types'
import { render } from 'tests/utils'
import { theme } from 'theme'
import { BicolorProfile } from 'ui/svg/icons/BicolorProfile'
import { IconInterface } from 'ui/svg/icons/types'

const label = 'Profil'
const icon: React.FC<IconInterface> = () => (
  <BicolorProfile opacity={0.5} color={theme.colors.black} color2={theme.colors.black} />
)
const step = { label, icon } as StepConfig

describe('StepButton', () => {
  describe('button is enabled/disabled', () => {
    it('should be disabled if step is "completed"', () => {
      const { getByTestId } = render(<StepButton step={step} state="completed" />)
      expect(getByTestId(`${label} Complété`).props.accessibilityState.disabled).toBe(true)
    })

    it('should be disabled if step is "disabled"', () => {
      const { getByTestId } = render(<StepButton step={step} state="disabled" />)
      expect(getByTestId(`${label} Non complété`).props.accessibilityState.disabled).toBe(true)
    })

    it('should be active if step is "current"', () => {
      const { getByTestId } = render(<StepButton step={step} state="current" />)
      expect(getByTestId(`${label} Non complété`).props.accessibilityState.disabled).toBe(false)
    })
  })

  describe('icons', () => {
    it('icon check is displaying when step is completed', () => {
      const { queryByTestId } = render(<StepButton step={step} state="completed" />)

      expect(queryByTestId('Complété')).toBeTruthy()
      expect(queryByTestId('Non complété')).toBeFalsy()
    })

    it('icon check is not displaying when step is disabled', () => {
      const { queryByTestId } = render(<StepButton step={step} state="disabled" />)

      expect(queryByTestId('Complété')).toBeFalsy()
      expect(queryByTestId('Non complété')).toBeTruthy()
    })

    it('icon check is not displaying when step is current', () => {
      const { queryByTestId } = render(<StepButton step={step} state="current" />)

      expect(queryByTestId('Complété')).toBeFalsy()
      expect(queryByTestId('Non complété')).toBeTruthy()
    })
  })
})
