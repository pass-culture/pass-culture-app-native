import React from 'react'

import { StepButton } from 'features/identityCheck/atoms/StepButton'
import { StepConfig } from 'features/identityCheck/types'
import { render } from 'tests/utils/web'
import { Profile } from 'ui/svg/icons/Profile'
import { IconInterface } from 'ui/svg/icons/types'

const label = 'Profil'
const icon: React.FC<IconInterface> = () => <Profile opacity={0.5} />
const step = { label, icon } as StepConfig

describe('StepButton', () => {
  describe('button is enabled/disabled', () => {
    it('should be disabled if step is "completed"', () => {
      const { getByTestId } = render(<StepButton step={step} state="completed" />)
      expect(getByTestId(label).getAttribute('aria-disabled')).toBe('true')
    })

    it('should be disabled if step is "disabled"', () => {
      const { getByTestId } = render(<StepButton step={step} state="disabled" />)
      expect(getByTestId(label).getAttribute('aria-disabled')).toBe('true')
    })

    it('should be active if step is "current"', () => {
      const { getByTestId } = render(<StepButton step={step} state="current" />)
      expect(getByTestId(label).getAttribute('aria-disabled')).toBe(null)
    })
  })

  describe('icon check is present/absent', () => {
    it('should be present if step is "completed"', () => {
      render(<StepButton step={step} state="completed" />).findByTestId('StepCompleted')
    })

    it('should be absent if step is "disabled"', () => {
      render(<StepButton step={step} state="disabled" />).findByTestId('StepNotCompleted')
    })

    it('should be absent if step is "current"', () => {
      render(<StepButton step={step} state="current" />).findByTestId('StepNotCompleted')
    })
  })
})
