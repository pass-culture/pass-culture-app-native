import { UseChangeEmailMutationProps } from 'features/profile/mutations'

export const useChangeEmailMutation = jest.fn(({ onSuccess }: UseChangeEmailMutationProps) => ({
  mutate: () => onSuccess(),
}))
