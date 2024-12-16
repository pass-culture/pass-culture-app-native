import { Modal } from './modal.store'

export type ModalCreator<T> = ReturnType<typeof createModal<T>>

export const createModal = <T>(key: string) => {
  const creator = (params: T): Modal<T> => {
    return {
      key,
      params,
    }
  }
  creator.key = key
  return creator
}
