import React from 'react'

import { TypoDS } from 'ui/theme'

import { createModal } from './modal.creator'
import { createModalFactory } from './modals.factory'

describe('Feature: Modals render factory', () => {
  test('Modal is added', () => {
    const modalFactory = createModalFactory()
    const modal = createModal('modal-key')
    const render = () => <TypoDS.Body>Modal</TypoDS.Body>
    modalFactory.add(modal, render)

    expect(modalFactory.get(modal(undefined))).toEqual(render)
  })

  test('Already exist error is thrown when modal already exist', () => {
    const modalFactory = createModalFactory()
    const modal = createModal('modal-key')
    modalFactory.add(modal, () => <TypoDS.Body>Modal</TypoDS.Body>)

    expect(() => modalFactory.add(modal, () => <TypoDS.Body>Modal</TypoDS.Body>)).toThrowError(
      `Modal with key\u00a0: ${modal.key} Already exist`
    )
  })

  test('Throw error when modal is not found', () => {
    const modalFactory = createModalFactory()
    const modal = createModal('modal-key')
    expect(() => modalFactory.get(modal(undefined))).toThrowError(
      `Modal with key\u00a0: ${modal.key} Not found`
    )
  })
})
