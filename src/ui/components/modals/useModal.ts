import { useCallback, useState } from 'react'

export type ModalSettings = {
  visible: boolean
  showModal: () => void
  hideModal: () => void
  toggleModal: () => void
}

export function useModal(defaultVisibility = false): ModalSettings {
  const [visible, setVisible] = useState(defaultVisibility)

  const showModal = useCallback(() => setVisible(true), [])
  const hideModal = useCallback(() => setVisible(false), [])
  const toggleModal = useCallback(
    () => setVisible((previousVisibleState) => !previousVisibleState),
    []
  )

  return { visible, showModal, hideModal, toggleModal }
}
