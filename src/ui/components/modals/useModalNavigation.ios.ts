import { useCallback } from 'react'

// TODO(PC-9487) find a better workaround to show next modal (issue (ios only): https://github.com/react-native-modal/react-native-modal/issues/484)
export function useModalNavigation(hideFirstModal: () => void, showNextModal: () => void) {
  return useCallback(() => {
    hideFirstModal()
    setTimeout(() => showNextModal(), 500)
  }, [hideFirstModal, showNextModal])
}
