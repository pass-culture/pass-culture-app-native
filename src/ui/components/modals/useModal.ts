import { useCallback, useState } from 'react'

export function useModal(defaultVisibility = false) {
  const [visible, setVisible] = useState(defaultVisibility)

  const showModal = useCallback(() => setVisible(true), [])
  const hideModal = useCallback(() => setVisible(false), [])
  const toggleModal = useCallback(() => setVisible((visible) => !visible), [])

  return { visible, showModal, hideModal, toggleModal }
}
