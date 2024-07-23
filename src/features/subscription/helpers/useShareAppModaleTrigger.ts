import { ShareAppTrigger } from 'libs/firebase/remoteConfig/remoteConfig.types'

type Params = {
  openModal: () => void
  lastBookingConsumed: boolean
}
export const useShareAppModaleTrigger = (
  variant: ShareAppTrigger,
  { openModal, lastBookingConsumed }: Params
) => {
  if (lastBookingConsumed) openModal()
}
