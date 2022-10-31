interface Props {
  offerId: number
  onSuccess: () => void
  onError: (error: unknown) => void
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useReportOfferMutation({ offerId, onSuccess, onError }: Props) {
  return { mutate: onSuccess }
}
