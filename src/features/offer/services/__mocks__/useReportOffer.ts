interface Props {
  offerId: number
  onSuccess: () => void
  onError: (error: unknown) => void
}

export function useReportOfferMutation({ offerId, onSuccess, onError }: Props) {
  return { mutate: onSuccess }
}
