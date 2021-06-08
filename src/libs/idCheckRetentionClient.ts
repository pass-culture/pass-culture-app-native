import {
  ApiError as IdCheckApiError,
  IdCheckErrors,
  IdCheckRetentionClient,
  UserProfile,
  IdCheckFile,
  LocalStorageService,
} from '@pass-culture/id-check'

import { api } from 'api/api'
import { ActivityEnum, BeneficiaryInformationUpdateRequest } from 'api/gen'
import { ApiError } from 'api/helpers'

export const idCheckRetentionClient: IdCheckRetentionClient = {
  confirmProfile(values?: Partial<UserProfile>) {
    return api.patchnativev1beneficiaryInformation({
      ...(values?.address ? { address: values?.address } : {}),
      ...(values?.city ? { city: values?.city } : {}),
      ...(values?.email ? { email: values?.email } : {}),
      ...(values?.phone ? { phone: values?.phone } : {}),
      ...(values?.postalCode ? { postalCode: values?.postalCode } : {}),
      ...(values?.status ? { activity: values?.status as ActivityEnum } : {}),
    } as BeneficiaryInformationUpdateRequest)
  },
  async uploadDocument(file: IdCheckFile) {
    let error, token
    try {
      token = await LocalStorageService.getLicenceToken()
      await LocalStorageService.resetLicenceToken()
      if (!token) {
        error = new IdCheckApiError('Auth required', 400, {
          code: IdCheckErrors['auth-required'],
        })
      }
    } catch (err) {
      error = err
    }
    if (error) {
      return Promise.reject(error)
    }
    try {
      const data = new FormData()
      data.append('token', token)
      data.append('identityDocumentFile', file as Blob)
      return await api.postnativev1identityDocument({
        body: data,
      })
    } catch (err) {
      error = err
      console.log('RAW error', JSON.stringify(error))
      if (err instanceof ApiError) {
        if (err.content.code === 'EXPIRED_TOKEN') {
          error = new IdCheckApiError(err.content.message, err.statusCode, {
            code: IdCheckErrors['auth-required'],
          })
        } else if (err.content.code === 'INVALID_TOKEN') {
          error = new IdCheckApiError(err.content.message, err.statusCode, {
            code: IdCheckErrors['auth-required'],
          })
        } else if (err.content.code === 'FILE_SIZE_EXCEEDED') {
          error = new IdCheckApiError(err.content.message, err.statusCode, {
            code: IdCheckErrors['file-size-exceeded'],
          })
        } else if (err.content.code === 'SERVICE_UNAVAILABLE') {
          error = new IdCheckApiError(err.content.message, err.statusCode, {
            code: IdCheckErrors['validation-unavailable'],
          })
        }
      }
      console.log('Final error', JSON.stringify(error))
      return Promise.reject(error)
    }
  },
}
