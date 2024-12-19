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

type RelativeModal<T> = {
  creator: ModalCreator<T>
  check: () => Modal<T> | undefined
}

// Je n'arrive pas a faire en sorte que le type de retour soit le bon. Sans le any, le type de retour est incompatible
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createRelativeModals = <T extends RelativeModal<any>[]>(...modals: T) => {
  for (const modal of modals) {
    const check = modal.check()
    if (check) {
      return check as ReturnType<T[number]['check']>
    }
  }
  return
}
