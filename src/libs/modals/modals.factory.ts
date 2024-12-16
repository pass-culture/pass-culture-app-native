import React from 'react'

import { ModalCreator } from './modal.creator'
import { Modal } from './modal.store'

export type ModalFactory = ReturnType<typeof createModalFactory>

export const createModalFactory = () => {
  const modals: Map<string, React.FC<{ params: unknown }>> = new Map()

  return {
    add: <T>(modalCreator: ModalCreator<T>, element: React.FC<{ params: T }>) => {
      if (modals.has(modalCreator.key)) {
        throw new Error(`Modal with key\u00a0: ${modalCreator.key} Already exist`)
      }
      modals.set(modalCreator.key, element as React.FC<{ params: unknown }>)
    },
    get: (modal: Modal<unknown>) => {
      const modalElement = modals.get(modal.key)
      if (!modalElement) {
        throw new Error(`Modal with key\u00a0: ${modal.key} Not found`)
      }
      return modalElement
    },
  }
}
