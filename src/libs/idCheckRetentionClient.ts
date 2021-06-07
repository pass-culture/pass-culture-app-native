import { UserProfile, IdCheckRetentionClient } from '@pass-culture/id-check'

import { api } from 'api/api'
import { ActivityEnum, BeneficiaryInformationUpdateRequest } from 'api/gen'
import { errorMonitoring } from 'libs/errorMonitoring'

export const idCheckRetentionClient: IdCheckRetentionClient = {
  confirmProfile: async (values?: Partial<UserProfile>) => {
    try {
      const res = await api.patchnativev1beneficiaryInformation({
        ...(values?.address ? { address: values?.address } : {}),
        ...(values?.city ? { city: values?.city } : {}),
        ...(values?.email ? { email: values?.email } : {}),
        ...(values?.phone ? { phone: values?.phone } : {}),
        ...(values?.postalCode ? { postalCode: values?.postalCode } : {}),
        ...(values?.status ? { activity: values?.status as ActivityEnum } : {}),
      } as BeneficiaryInformationUpdateRequest)
      console.log('success', res)
      return res
    } catch (err) {
      errorMonitoring.captureException(err)
      return Promise.reject(err)
    }
  },
}
