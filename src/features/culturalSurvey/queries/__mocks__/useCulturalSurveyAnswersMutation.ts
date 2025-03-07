interface Props {
  onSuccess: () => void
}

export const useCulturalSurveyAnswersMutation = jest.fn(({ onSuccess }: Props) => {
  return { mutate: onSuccess }
})
