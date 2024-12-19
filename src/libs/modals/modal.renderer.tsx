import React, { FC } from 'react'

import { useModalStore } from './modal.store'
import { ModalFactory } from './modals.factory'

type Props = { modalFactory: ModalFactory }

export const ModalRenderer: FC<Props> = ({ modalFactory }) => {
  const { modalOpened, closeModal } = useModalStore((state) => ({
    modalOpened: state.modalOpened,
    closeModal: state.actions.closeModal,
  }))

  if (!modalOpened) {
    return null
  }

  const ModalRenderer = modalFactory.get(modalOpened)

  return <ModalRenderer params={modalOpened.params} close={closeModal} />
}
