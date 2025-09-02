import React from 'react'
import { useForm, ErrorOption } from 'react-hook-form'

import { render, screen, userEvent } from 'tests/utils'

import { PriceInputController } from './PriceInputController'

type PriceForm = {
  price: string
}

const user = userEvent.setup()

describe('<PriceInputController />', () => {
  it('should not show error when form input is valid', () => {
    renderPriceInputController({})

    expect(screen.queryByText('error')).not.toBeOnTheScreen()
  })

  it('should show error when form input is invalid', () => {
    renderPriceInputController({
      error: { type: 'custom', message: 'error' },
    })

    expect(screen.getByText('error', { hidden: true })).toBeOnTheScreen()
  })

  it('should display custom error message when error is set', async () => {
    renderPriceInputController({
      error: { type: 'custom', message: 'Prix invalide' },
    })

    const input = screen.getByPlaceholderText('Prix')
    await user.type(input, 'abc')

    expect(screen.getByText('Prix invalide', { hidden: true })).toBeOnTheScreen()
  })
})

const renderPriceInputController = ({
  error,
  isDisabled,
}: {
  error?: ErrorOption
  isDisabled?: boolean
}) => {
  const PriceForm = () => {
    const { control, setError } = useForm<PriceForm>({
      defaultValues: { price: '' },
    })

    error && setError('price', error)
    return (
      <PriceInputController
        control={control}
        name="price"
        label="Prix"
        placeholder="Prix"
        isDisabled={isDisabled}
      />
    )
  }
  render(<PriceForm />)
}
