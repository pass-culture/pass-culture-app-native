import React from 'react'

import { TechnicalProblemBanner } from 'features/technicalProblemBanner/components/TechnicalProblemBanner'
import { TechnicalProblemBannerType } from 'features/technicalProblemBanner/utils/technicalProblemBannerSchema'
import { eventMonitoring } from 'libs/monitoring/services'
import { render, screen } from 'tests/utils'

const mockOptions: TechnicalProblemBannerType = {
  severity: 'error',
  label: 'Problème technique',
  message: 'Nous rencontrons actuellement des difficultés techniques.',
}

describe('<TechnicalProblemBanner/>', () => {
  it('should display banner with correct label and message', () => {
    render(<TechnicalProblemBanner options={mockOptions} />)

    expect(screen.getByText('Problème technique')).toBeOnTheScreen()
    expect(
      screen.getByText('Nous rencontrons actuellement des difficultés techniques.')
    ).toBeOnTheScreen()
  })

  it('should not display banner when options are invalid', () => {
    const invalidOptions = {
      severity: 'invalid_severity',
      label: 'Test',
      message: 'Test message',
    }

    render(<TechnicalProblemBanner options={invalidOptions} />)

    expect(screen.queryByText('Test')).not.toBeOnTheScreen()
  })

  it('should log sentry when validation fails', () => {
    const invalidOptions = {
      severity: 'invalid_severity',
      label: 'Test',
      message: 'Test message',
    }

    render(<TechnicalProblemBanner options={invalidOptions} />)

    expect(eventMonitoring.captureException).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining('TechnicalProblemBanner validation issue'),
      }),
      expect.objectContaining({
        extra: { objectToValidate: invalidOptions },
      })
    )
  })

  it('should display banner with default severity when severity is default', () => {
    const defaultOptions: TechnicalProblemBannerType = {
      severity: 'default',
      label: 'Information',
      message: 'Message informatif',
    }

    render(<TechnicalProblemBanner options={defaultOptions} />)

    expect(screen.getByText('Information')).toBeOnTheScreen()
    expect(screen.getByText('Message informatif')).toBeOnTheScreen()
  })

  it('should display banner with success severity', () => {
    const successOptions: TechnicalProblemBannerType = {
      severity: 'success',
      label: 'Succès',
      message: 'Opération réussie',
    }

    render(<TechnicalProblemBanner options={successOptions} />)

    expect(screen.getByText('Succès')).toBeOnTheScreen()
    expect(screen.getByText('Opération réussie')).toBeOnTheScreen()
  })

  it('should display banner with alert severity', () => {
    const alertOptions: TechnicalProblemBannerType = {
      severity: 'alert',
      label: 'Attention',
      message: 'Message d’avertissement',
    }

    render(<TechnicalProblemBanner options={alertOptions} />)

    expect(screen.getByText('Attention')).toBeOnTheScreen()
    expect(screen.getByText("Message d'avertissement")).toBeOnTheScreen()
  })
})
