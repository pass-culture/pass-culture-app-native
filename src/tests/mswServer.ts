import { DefaultBodyType, delay as delayFunction, http, HttpResponse, passthrough } from 'msw'
import { setupServer } from 'msw/node'

import { env } from 'libs/environment/env'
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

class MswMockServer
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

          const once = !handler.options?.requestOptions?.persist

          const matching = {
            GET: () => http.get(url, generatedHandler, { once }),
            DELETE: () => http.delete(url, generatedHandler, { once }),
            POST: () => http.post(url, generatedHandler, { once }),
            PUT: () => http.put(url, generatedHandler, { once }),
            PATCH: () => http.patch(url, generatedHandler, { once }),
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

    this.mswServer.events.on('request:unhandled', ({ request }) => {
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

  private areParamsMatching = (url: string, req: Request): boolean => {
    const params = url.split('?')[1]
    if (params) {
      const paramsArray = params.split('&')
      const reqParams = new URL(req.url).searchParams
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

  private areAllHeadersMatching = (headers: Record<string, string>, req: Request): boolean => {
    const reqHeaders = req.headers
    for (const [key, value] of Object.entries(headers)) {
      if (reqHeaders.get(key) !== value) {
        return false
      }
    }
    return true
  }

  private isOneHeaderMatching = (matchHeader: [string, string], req: Request): boolean => {
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
  ) => {
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

    return async ({ request }: { request: Request }) => {
      if (statusCode === 'network-error') return HttpResponse.error()

      if (!this.areParamsMatching(fullUrl, request)) {
        this.matchingErrors.push(
          request.url.toString() +
            '\nRequested header ' +
            fullUrl +
            ' got ' +
            new URL(request.url).searchParams
        )
        return passthrough()
      }

      if (matchHeader && !this.isOneHeaderMatching(matchHeader, request)) {
        this.matchingErrors.push(
          request.url + '\nRequested header ' + matchHeader + ' got ' + request.headers
        )
        return passthrough()
      }

      if (headers && !this.areAllHeadersMatching(headers, request)) {
        this.matchingErrors.push(
          request.url.toString() + '\nRequested headers ' + headers + ' got ' + request.headers
        )
        return passthrough()
      }

      if (matchData) {
        const requestData = await request.json()
        if (JSON.stringify(requestData) !== JSON.stringify(matchData)) {
          this.matchingErrors.push(
            request.url +
              '\nRequested Data ' +
              JSON.stringify(matchData) +
              ' got ' +
              JSON.stringify(requestData)
          )
          return passthrough()
        }
      }

      if (persist) {
        await delayFunction(delay)
        return HttpResponse.json(data, { status: statusCode })
      }
      this.currentRequests.splice(this.currentRequests.indexOf(debugObject), 1)
      return HttpResponse.json(data, { status: statusCode })
    }
  }

  isMockOptions<TResponse extends DefaultBodyType>(
    options: TResponse | MockOptions<string, TResponse, string | RegExp | Buffer>
  ): options is MockOptions<string, TResponse, string | RegExp | Buffer> {
    const optionsCasted = options as MockOptions<string, TResponse, string | RegExp | Buffer>
    return optionsCasted.responseOptions !== undefined || optionsCasted.requestOptions !== undefined
  }

  universalGet<TResponse extends DefaultBodyType>(
    url: string,
    options: TResponse | MockOptions<string, TResponse, string | RegExp | Buffer>
  ): MockReturnType {
    const urlWithoutParams = url.split('?')[0] ?? url
    if (this.isMockOptions(options)) {
      const handler = http.get(urlWithoutParams, this.generateMockHandler(url, options, 'GET'))
      this.mswServer.use(handler)
    } else {
      const handler = http.get(
        url,
        this.generateMockHandler(
          urlWithoutParams,
          { responseOptions: { data: options as TResponse } },
          'GET'
        )
      )
      this.mswServer.use(handler)
    }
  }
  getApi<TResponse extends DefaultBodyType>(
    url: string,
    options: TResponse | MockOptions<string, TResponse, string | RegExp | Buffer>
  ): MockReturnType {
    const fullUrl = `${this.baseUrl}${url}`

    this.universalGet(fullUrl, options)
  }

  universalPost<TResponse extends DefaultBodyType>(
    url: string,
    options: TResponse | MockOptions<string, TResponse, string | RegExp | Buffer>
  ): MockReturnType {
    const urlWithoutParams = url.split('?')[0] ?? url
    if (this.isMockOptions(options)) {
      const handler = http.post(urlWithoutParams, this.generateMockHandler(url, options, 'POST'))
      this.mswServer.use(handler)
    } else {
      const handler = http.post(
        url,
        this.generateMockHandler(url, { responseOptions: { data: options as TResponse } }, 'POST')
      )
      this.mswServer.use(handler)
    }
  }
  postApi<TResponse extends DefaultBodyType>(
    url: string,
    options: TResponse | MockOptions<string, TResponse, string | RegExp | Buffer>
  ): MockReturnType {
    const fullUrl = `${this.baseUrl}${url}`

    this.universalPost(fullUrl, options)
  }

  universalDelete<TResponse extends DefaultBodyType>(
    url: string,
    options: TResponse | MockOptions<string, TResponse, string | RegExp | Buffer>
  ): MockReturnType {
    const urlWithoutParams = url.split('?')[0] ?? url
    if (this.isMockOptions(options)) {
      const handler = http.delete(
        urlWithoutParams,
        this.generateMockHandler(url, options, 'DELETE')
      )
      this.mswServer.use(handler)
    } else {
      const handler = http.delete(
        url,
        this.generateMockHandler(url, { responseOptions: { data: options as TResponse } }, 'DELETE')
      )
      this.mswServer.use(handler)
    }
  }
  deleteApi<TResponse extends DefaultBodyType>(
    url: string,
    options: TResponse | MockOptions<string, TResponse, string | RegExp | Buffer>
  ): MockReturnType {
    const fullUrl = `${this.baseUrl}${url}`

    this.universalDelete(fullUrl, options)
  }

  universalPut<TResponse extends DefaultBodyType>(
    url: string,
    options: TResponse | MockOptions<string, TResponse, string | RegExp | Buffer>
  ): MockReturnType {
    const urlWithoutParams = url.split('?')[0] ?? url
    if (this.isMockOptions(options)) {
      const handler = http.put(urlWithoutParams, this.generateMockHandler(url, options, 'PUT'))
      this.mswServer.use(handler)
    } else {
      const handler = http.put(
        url,
        this.generateMockHandler(url, { responseOptions: { data: options as TResponse } }, 'PUT')
      )
      this.mswServer.use(handler)
    }
  }
  putApi<TResponse extends DefaultBodyType>(
    url: string,
    options: TResponse | MockOptions<string, TResponse, string | RegExp | Buffer>
  ): MockReturnType {
    const fullUrl = `${this.baseUrl}${url}`

    this.universalPut(fullUrl, options)
  }
  universalPatch<TResponse extends DefaultBodyType>(
    url: string,
    options: TResponse | MockOptions<string, TResponse, string | RegExp | Buffer>
  ): MockReturnType {
    const urlWithoutParams = url.split('?')[0] ?? url
    if (this.isMockOptions(options)) {
      const handler = http.patch(urlWithoutParams, this.generateMockHandler(url, options, 'PATCH'))
      this.mswServer.use(handler)
    } else {
      const handler = http.patch(
        url,
        this.generateMockHandler(url, { responseOptions: { data: options as TResponse } }, 'PATCH')
      )
      this.mswServer.use(handler)
    }
  }
  patchApi<TResponse extends DefaultBodyType>(
    url: string,
    options: TResponse | MockOptions<string, TResponse, string | RegExp | Buffer>
  ): MockReturnType {
    const fullUrl = `${this.baseUrl}${url}`

    this.universalPatch(fullUrl, options)
  }
}

export const mockServer = new MswMockServer(`${env.API_BASE_URL}/native`)
