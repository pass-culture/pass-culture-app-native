import React from 'react'

import { fireEvent, render, screen, userEvent } from 'tests/utils'

import { DynamicInputList } from './DynamicInputList'

const user = userEvent.setup()

describe('<DynamicInputList />', () => {
  const baseInputs = [
    { label: 'Prénom', testID: 'input-1' },
    { label: 'Deuxième prénom', testID: 'input-2' },
    { label: 'Troisième prénom', testID: 'input-3' },
  ]

  it('should render only one input initially', () => {
    render(<DynamicInputList inputs={baseInputs} addMoreInputWording="Ajouter un prénom" />)

    expect(screen.getByLabelText('Champs de texte - Prénom')).toBeTruthy()
    expect(screen.queryByLabelText('Champs de texte - Deuxième prénom')).toBeNull()
  })

  it('should add a new input when pressing "Ajouter un prénom"', async () => {
    render(<DynamicInputList inputs={baseInputs} addMoreInputWording="Ajouter un prénom" />)

    const addButton = screen.getByText('Ajouter un prénom')
    await user.press(addButton)

    expect(screen.getByLabelText('Champs de texte - Deuxième prénom')).toBeTruthy()
  })

  it('should remove an input when pressing the trash button', async () => {
    render(
      <DynamicInputList
        inputs={baseInputs}
        addMoreInputWording="Ajouter un prénom"
        initialValues={['Jean', 'Pierre']}
      />
    )

    await user.press(screen.getByText('Ajouter un prénom'))

    const deleteButton = screen.getByLabelText('Supprimer le champ Deuxième prénom')
    await user.press(deleteButton)

    expect(screen.queryByLabelText('Champs de texte - Deuxième prénom')).toBeNull()
  })

  it('should call onValuesChange when text changes', () => {
    const onValuesChange = jest.fn()
    render(
      <DynamicInputList
        inputs={baseInputs}
        addMoreInputWording="Ajouter un prénom"
        onValuesChange={onValuesChange}
      />
    )

    const input = screen.getByLabelText('Champs de texte - Prénom')
    fireEvent.changeText(input, 'Marie')

    expect(onValuesChange).toHaveBeenCalledWith(['Marie'])
  })

  it('should display error messages when provided', () => {
    render(
      <DynamicInputList
        inputs={baseInputs}
        addMoreInputWording="Ajouter un prénom"
        errors={['Le prénom est invalide']}
        initialValues={['123']}
      />
    )

    expect(screen.getByText('Le prénom est invalide')).toBeTruthy()
  })

  it('should not display the add button when all possible inputs are already provided', async () => {
    render(
      <DynamicInputList
        inputs={baseInputs}
        addMoreInputWording="Ajouter un prénom"
        initialValues={['Jean']}
      />
    )

    const firstAddButton = screen.getByText('Ajouter un prénom')
    await user.press(firstAddButton)

    const secondAddButton = screen.getByText('Ajouter un prénom')
    await user.press(secondAddButton)

    const addButtonAfterMaxReached = screen.queryByText('Ajouter un prénom')

    expect(addButtonAfterMaxReached).toBeNull()
  })
})
