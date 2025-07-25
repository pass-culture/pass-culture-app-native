import { QueryKeys } from 'libs/queryKeys'
import { queryClient } from 'libs/react-query/queryClient'

export const invalidateStepperInfoQueries = async () => {
  await queryClient.invalidateQueries([QueryKeys.STEPPER_INFO])
}
