interface Props {
  onSuccess: () => void
  onError: (error: unknown) => void
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useCulturalSurveyAnswersMutation = jest.fn(({ onSuccess, onError }: Props) => {
  return { mutate: onSuccess }
})
