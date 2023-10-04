import type {
  DefaultBodyType,
  PathParams,
  ResponseComposition,
  ResponseResolver,
  RestContext,
  RestRequest,
} from 'msw'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

import { AccountState, Reason } from 'api/gen'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { paginatedFavoritesResponseSnap } from 'features/favorites/fixtures/paginatedFavoritesResponseSnap'
import { SubscriptionStepperResponseFixture } from 'features/identityCheck/pages/helpers/stepperInfo.fixture'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { beneficiaryUser } from 'fixtures/user'
import { env } from 'libs/environment'
import { placeholderData } from 'libs/subcategories/placeholderData'
import {
  MockOptions,
  MockReturnType,
  MockServerConstructorOptions,
  MockServerInterface,
  MockServerMode,
  SupportedMethod,
} from 'tests/mockServer'

type DebugOptions = {
  fullUrl: string
  method: SupportedMethod
}

export class MswMockServer
  implements MockServerInterface<DefaultBodyType, string, string | RegExp | Buffer>
{
  baseUrl: string
  mode: MockServerMode
  delay: number
  private mswServer: ReturnType<typeof setupServer>
  private matchingErrors: string[] = []
  private currentRequests: DebugOptions[] = []

  constructor(
    baseUrl: string,
    options?: MockServerConstructorOptions<string, DefaultBodyType, string | RegExp | Buffer>
  ) {
    const { mode, delay, defaultRequests } = options ?? {}
    this.baseUrl = baseUrl
    this.mode = mode ?? 'TEST'

    const baseHandlers = defaultRequests
      ? defaultRequests.map((handler) => {
          const url = `${this.baseUrl}${handler.url}`
          const generatedHandler = this.generateMockHandler(
            `${this.baseUrl}${handler.url}`,
            {
              ...handler.options,
              requestOptions: {
                persist: true,
                ...handler.options?.requestOptions,
              },
            },
            handler.method
          )

          const matching = {
            GET: () => rest.get(url, generatedHandler),
            DELETE: () => rest.delete(url, generatedHandler),
            POST: () => rest.post(url, generatedHandler),
            PUT: () => rest.put(url, generatedHandler),
          }

          const mockByMethod = matching[handler.method]

          if (!mockByMethod) throw new Error(`Unsupported method: ${handler.method}`)

          return mockByMethod()
        }, this)
      : []
    // if you want to setup a default route for all requests, do it here
    this.mswServer = setupServer(...baseHandlers)

    if (this.mode !== 'TEST') {
      this.mswServer.listen()
      this.delay = delay ?? 1000
      return
    }
    this.delay = delay ?? 0

    this.mswServer.listen({
      onUnhandledRequest: 'warn', // Only put "warn", not "error" otherwise it won't trigger our listener below
    })

    let unhandledRequests: string[] = []

    this.mswServer.events.on('request:unhandled', (request) => {
      unhandledRequests.push(request.method + ' ' + request.url.toString())
    })

    afterEach(() => {
      if (this.matchingErrors.length) {
        throw new Error(`Matching errors:\n${this.matchingErrors.join('\n')}`)
      }
      if (unhandledRequests.length) {
        throw new Error(
          `Unhandled requests:\n${unhandledRequests.join(
            '\n'
          )} \nWaiting requests:\n${this.currentRequests
            .map((requete) => `${requete.method} ${requete.fullUrl}`)
            .join('\n')}`
        )
      }
    })

    beforeEach(() => {
      unhandledRequests = []
      this.matchingErrors = []
      this.currentRequests = []
    })

    afterEach(() => {
      this.mswServer.resetHandlers()
    })

    afterAll(() => this.mswServer.close())
  }

  private areParamsMatching = (url: string, req: RestRequest): boolean => {
    const params = url.split('?')[1]
    if (params) {
      const paramsArray = params.split('&')
      const reqParams = req.url.searchParams
      for (const param of paramsArray) {
        if (!param) return false
        const [key, value] = param.split('=')
        if (key === undefined) return false // not sure if this is needed
        const reqParam = reqParams.get(key)
        if (reqParam !== value) return false
      }
    }
    return true
  }

  private areAllHeadersMatching = (headers: Record<string, string>, req: RestRequest): boolean => {
    const reqHeaders = req.headers
    for (const [key, value] of Object.entries(headers)) {
      if (reqHeaders.get(key) !== value) {
        return false
      }
    }
    return true
  }

  private isOneHeaderMatching = (matchHeader: [string, string], req: RestRequest): boolean => {
    const [key, value] = matchHeader
    if (req.headers.get(key) !== value) {
      return false
    }
    return true
  }

  private generateMockHandler = (
    fullUrl: string,
    options: MockOptions<string, DefaultBodyType, string | RegExp | Buffer>,
    method: SupportedMethod
  ): ResponseResolver<
    RestRequest<DefaultBodyType, PathParams<string>>,
    RestContext,
    DefaultBodyType
  > => {
    const {
      persist,
      headers = undefined,
      matchData = undefined,
      matchHeader = undefined,
    } = options?.requestOptions ?? {}

    const {
      statusCode = 200,
      data = undefined,
      delay = this.delay,
    } = options?.responseOptions ?? {}

    const debugObject = {
      fullUrl,
      method,
    }
    if (!persist) this.currentRequests.push(debugObject)

    return async (
      req: RestRequest<DefaultBodyType, PathParams<string>>,
      res: ResponseComposition<DefaultBodyType>,
      ctx: RestContext
    ) => {
      if (statusCode === 'network-error') return res.networkError('Unable to connect')

      if (!this.areParamsMatching(fullUrl, req)) {
        this.matchingErrors.push(
          req.url.toString() + '\nRequested header ' + fullUrl + ' got ' + req.params
        )
        return req.passthrough()
      }

      if (matchHeader && !this.isOneHeaderMatching(matchHeader, req)) {
        this.matchingErrors.push(
          req.url.toString() + '\nRequested header ' + matchHeader + ' got ' + req.headers
        )
        return req.passthrough()
      }

      if (headers && !this.areAllHeadersMatching(headers, req)) {
        this.matchingErrors.push(
          req.url.toString() + '\nRequested headers ' + headers + ' got ' + req.headers
        )
        return req.passthrough()
      }

      if (matchData) {
        const requestData = await req.json()
        if (JSON.stringify(requestData) !== JSON.stringify(matchData)) {
          this.matchingErrors.push(
            req.url.toString() +
              '\nRequested Data ' +
              JSON.stringify(matchData) +
              ' got ' +
              JSON.stringify(requestData)
          )
          return req.passthrough()
        }
      }

      if (persist) {
        return res(ctx.status(statusCode), ctx.json(data), ctx.delay(delay))
      }
      this.currentRequests.splice(this.currentRequests.indexOf(debugObject), 1)
      return res.once(ctx.status(statusCode), ctx.json(data))
    }
  }

  isMockOptions<TResponse extends DefaultBodyType>(
    options: TResponse | MockOptions<string, TResponse, string | RegExp | Buffer>
  ): options is MockOptions<string, TResponse, string | RegExp | Buffer> {
    return (
      (options as MockOptions<string, TResponse, string | RegExp | Buffer>).responseOptions !==
        undefined ||
      (options as MockOptions<string, TResponse, string | RegExp | Buffer>).requestOptions !==
        undefined
    )
  }

  getAPIV1<TResponse extends DefaultBodyType>(
    url: string,
    options: TResponse | MockOptions<string, TResponse, string | RegExp | Buffer>
  ): MockReturnType {
    const fullUrl = `${this.baseUrl}${url}`

    if (this.isMockOptions(options)) {
      const handler = rest.get(fullUrl, this.generateMockHandler(fullUrl, options, 'GET'))
      this.mswServer.use(handler)
    } else {
      const handler = rest.get(
        fullUrl,
        this.generateMockHandler(
          fullUrl,
          { responseOptions: { data: options as TResponse } },
          'GET'
        )
      )
      this.mswServer.use(handler)
    }
  }

  postAPIV1<TResponse extends DefaultBodyType>(
    url: string,
    options: TResponse | MockOptions<string, TResponse, string | RegExp | Buffer>
  ): MockReturnType {
    const fullUrl = `${this.baseUrl}${url}`

    if (this.isMockOptions(options)) {
      const handler = rest.post(fullUrl, this.generateMockHandler(fullUrl, options, 'POST'))
      this.mswServer.use(handler)
    } else {
      const handler = rest.post(
        fullUrl,
        this.generateMockHandler(
          fullUrl,
          { responseOptions: { data: options as TResponse } },
          'POST'
        )
      )
      this.mswServer.use(handler)
    }
  }
  deleteAPIV1<TResponse extends DefaultBodyType>(
    url: string,
    options: TResponse | MockOptions<string, TResponse, string | RegExp | Buffer>
  ): MockReturnType {
    const fullUrl = `${this.baseUrl}${url}`
    if (this.isMockOptions(options)) {
      const handler = rest.delete(fullUrl, this.generateMockHandler(fullUrl, options, 'DELETE'))
      this.mswServer.use(handler)
    } else {
      const handler = rest.delete(
        fullUrl,
        this.generateMockHandler(
          fullUrl,
          { responseOptions: { data: options as TResponse } },
          'DELETE'
        )
      )
      this.mswServer.use(handler)
    }
  }

  putAPIV1<TResponse extends DefaultBodyType>(
    url: string,
    options: TResponse | MockOptions<string, TResponse, string | RegExp | Buffer>
  ): MockReturnType {
    const fullUrl = `${this.baseUrl}${url}`
    if (this.isMockOptions(options)) {
      const handler = rest.put(fullUrl, this.generateMockHandler(fullUrl, options, 'PUT'))
      this.mswServer.use(handler)
    } else {
      const handler = rest.put(
        fullUrl,
        this.generateMockHandler(
          fullUrl,
          { responseOptions: { data: options as TResponse } },
          'PUT'
        )
      )
      this.mswServer.use(handler)
    }
  }
}

export const mockServer = new MswMockServer(env.API_BASE_URL, {
  mode: 'TEST',
  defaultRequests: [
    {
      method: 'POST',
      url: '/native/v1/signin',
      options: {
        responseOptions: {
          statusCode: 200,
          data: {
            accessToken: 'access_token',
            refreshToken: 'refresh_token',
            accountState: AccountState.ACTIVE,
          },
        },
      },
    },
    {
      method: 'POST',
      url: '/native/v1/reset_password',
      options: {
        responseOptions: {
          statusCode: 204,
          data: {},
        },
      },
    },
    {
      method: 'POST',
      url: '/native/v1/request_password_reset',
      options: {
        responseOptions: {
          statusCode: 204,
          data: {},
        },
      },
    },
    {
      method: 'POST',
      url: '/native/v1/settings',
      options: {
        responseOptions: {
          statusCode: 200,
          data: {},
        },
      },
    },
    {
      method: 'POST',
      url: '/native/v1/resend_email_validation',
      options: {
        responseOptions: {
          statusCode: 204,
          data: {},
        },
      },
    },
    {
      method: 'GET',
      url: '/native/v1/me',
      options: {
        responseOptions: {
          statusCode: 200,
          data: beneficiaryUser,
        },
      },
    },
    {
      method: 'GET',
      url: '/native/v1/offer/' + offerResponseSnap.id,
      options: {
        responseOptions: {
          statusCode: 200,
          data: offerResponseSnap,
        },
      },
    },
    {
      method: 'GET',
      url: '/native/v1/venue/' + venueResponseSnap.id,
      options: {
        responseOptions: {
          statusCode: 200,
          data: venueResponseSnap,
        },
      },
    },
    {
      method: 'GET',
      url: '/native/v1/bookings',
      options: {
        responseOptions: {
          statusCode: 200,
          data: bookingsSnap,
        },
      },
    },
    {
      method: 'POST',
      url: '/native/v1/send_phone_validation_code',
      options: {
        responseOptions: {
          statusCode: 200,
          data: {},
        },
      },
    },
    {
      method: 'POST',
      url: '/native/v1/validate_email',
      options: {
        responseOptions: {
          statusCode: 200,
          data: {
            accessToken: 'access_token',
            refreshToken: 'refresh_token',
          },
        },
      },
    },
    {
      method: 'GET',
      url: '/native/v1/subscription/next_step',
      options: {
        responseOptions: {
          statusCode: 200,
          data: {
            nextSubscriptionStep: null,
          },
        },
      },
    },
    {
      method: 'GET',
      url: '/native/v1/subscription/stepper',
      options: {
        responseOptions: {
          statusCode: 200,
          data: SubscriptionStepperResponseFixture,
        },
      },
    },
    {
      method: 'GET',
      url: '/native/v1/me/favorites',
      options: {
        responseOptions: {
          statusCode: 200,
          data: paginatedFavoritesResponseSnap,
        },
      },
    },
    {
      method: 'GET',
      url: '/native/v1/subcategories/v2',
      options: {
        responseOptions: {
          statusCode: 200,
          data: {
            ...placeholderData,
          },
        },
      },
    },
    {
      method: 'POST',
      url: '/native/v1/cookies_consent',
      options: {
        responseOptions: {
          statusCode: 200,
        },
      },
    },
    {
      method: 'GET',
      url: '/native/v1/offers/reports',
      options: {
        responseOptions: {
          statusCode: 200,
          data: {
            reportedOffers: [
              { offerId: 1234, reason: Reason.INAPPROPRIATE, reportedAt: '123456789' },
            ],
          },
        },
      },
    },
    {
      method: 'GET',
      url: '/native/v1/phone_validation/remaining_attempts',
      options: {
        responseOptions: {
          statusCode: 200,
          data: {
            remainingAttempts: 5,
            counterResetDatetime: 'time',
          },
        },
      },
    },
    {
      method: 'GET',
      url: '/native/v1/banner',
      options: {
        responseOptions: {
          statusCode: 200,
          data: {},
        },
      },
    },
  ],
})
