/* eslint-disable max-classes-per-file */
import { ComponentType } from 'react'

/*
 * Here all errors returned by edu connect or pass culture api
 */
export enum EduConnectErrors {
  'not-eligible' = 'not-eligible',
}

export type EduConnectErrorCode = keyof EduConnectErrors

export class EduConnectError extends Error {
  public errorCode: EduConnectErrors

  public initialError: Error | undefined

  constructor(errorCode: EduConnectErrors, messageOrInitialError?: Error | string) {
    super(errorCode)
    this.errorCode = errorCode
    if (messageOrInitialError) {
      if (typeof messageOrInitialError === 'string') {
        this.message = messageOrInitialError
      } else {
        this.stack = messageOrInitialError.stack
        this.message = messageOrInitialError.message
        this.initialError = messageOrInitialError
      }
    }
  }
}

EduConnectError.prototype.name = 'EduConnectError'

export interface EduConnectErrorProps {
  error: EduConnectError | Error
}

export type EduConnectErrorPage = Record<
  EduConnectErrors,
  ComponentType<EduConnectErrorProps | undefined>
>
