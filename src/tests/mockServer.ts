export interface MockServerInterface<BodyType, HeadersType, RequestBody> {
  baseUrl: string
  mode: MockServerMode
  delay: number
  getApi<TResponse extends BodyType>(
    url: string,
    options: TResponse | MockOptions<HeadersType, TResponse, RequestBody>
  ): MockReturnType
  postApi<TResponse extends BodyType>(
    url: string,
    options: TResponse | MockOptions<HeadersType, TResponse, RequestBody>
  ): MockReturnType
  deleteApi<TResponse extends BodyType>(
    url: string,
    options: TResponse | MockOptions<HeadersType, TResponse, RequestBody>
  ): MockReturnType
  putApi<TResponse extends BodyType>(
    url: string,
    options: TResponse | MockOptions<HeadersType, TResponse, RequestBody>
  ): MockReturnType
  universalGet<TResponse extends BodyType>(
    url: string,
    options: TResponse | MockOptions<HeadersType, TResponse, RequestBody>
  ): MockReturnType
  universalPost<TResponse extends BodyType>(
    url: string,
    options: TResponse | MockOptions<HeadersType, TResponse, RequestBody>
  ): MockReturnType
  universalDelete<TResponse extends BodyType>(
    url: string,
    options: TResponse | MockOptions<HeadersType, TResponse, RequestBody>
  ): MockReturnType
  universalPut<TResponse extends BodyType>(
    url: string,
    options: TResponse | MockOptions<HeadersType, TResponse, RequestBody>
  ): MockReturnType
}

type Mocks<HeadersType, TResponse, RequestBody> = {
  method: SupportedMethod
  url: string
  options: MockOptions<HeadersType, TResponse, RequestBody>
}

export type MockServerConstructorOptions<HeadersType, TResponse, RequestBody> = {
  mode?: MockServerMode
  delay?: number
  defaultRequests?: Mocks<HeadersType, TResponse, RequestBody>[]
}

export type MockServerMode = 'SERVER' | 'TEST'

type RequestOptions<HeadersType, RequestBody> = {
  headers?: Record<string, HeadersType> | undefined
  matchHeader?: [string, string]
  matchData?: RequestBody | undefined
  persist?: boolean
}

type ResponseOptions<TResponse> = {
  statusCode?: number | 'network-error'
  delay?: number
  data?: TResponse
}

export type MockOptions<HeadersType, TResponse, RequestBody> = {
  requestOptions?: RequestOptions<HeadersType, RequestBody>
  responseOptions?: ResponseOptions<TResponse>
}

export type MockReturnType = {
  requestData: () => void
} | void

export type SupportedMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
