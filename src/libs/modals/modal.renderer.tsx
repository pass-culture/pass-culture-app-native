import React, { FC } from 'react'

import { useModalStore } from './modal.store'
import { ModalFactory } from './modals.factory'

type Props = { modalFactory: ModalFactory }

export const ModalRenderer: FC<Props> = ({ modalFactory }) => {
  const modalOpened = useModalStore((state) => state.modalOpened)

  if (!modalOpened) {
    return null
  }

  const ModalRenderer = modalFactory.get(modalOpened)

  return <ModalRenderer params={modalOpened.params} />
}
