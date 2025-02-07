import { InferType, object, string } from 'yup'

const remoteBannerSchema = object({
  title: string().required(),
  subtitleWeb: string().nullable(),
  subtitleMobile: string().nullable(),
  redirectionUrl: string().url().nullable(),
  redirectionType: string().oneOf(['external', 'store']).required(),
})

export type RemoteBannerType = InferType<typeof remoteBannerSchema>

export enum RemoteBannerRedirectionType {
  STORE = 'store',
  EXTERNAL = 'external',
}

export const validateRemoteBanner = (objectToValidate: unknown): RemoteBannerType | null => {
  try {
    return remoteBannerSchema.validateSync(objectToValidate)
  } catch {
    return null // Should handle case when null in calling component
  }
}
