import { UseValidateEmailChangeMutationProps } from 'features/profile/mutations'

export const useValidateEmailChangeMutation = jest.fn(
  ({ onSuccess }: UseValidateEmailChangeMutationProps) => ({
    mutate: () => onSuccess(),
  })
)
