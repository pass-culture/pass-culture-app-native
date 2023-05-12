export interface MockServerInterface<BodyType, HeadersType, RequestBody> {
  baseUrl: string
  mode: MockServerMode
  delay: number
  getApiV1<TResponse extends BodyType>(
    url: string,
    options: TResponse | MockOptions<HeadersType, TResponse, RequestBody>
  ): MockReturnType
  postApiV1<TResponse extends BodyType>(
    url: string,
    options: TResponse | MockOptions<HeadersType, TResponse, RequestBody>
  ): MockReturnType
  deleteApiV1<TResponse extends BodyType>(
    url: string,
    options: TResponse | MockOptions<HeadersType, TResponse, RequestBody>
  ): MockReturnType
  putApiV1<TResponse extends BodyType>(
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

export type Mocks<HeadersType, TResponse, RequestBody> = {
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

export type RequestOptions<HeadersType, RequestBody> = {
  headers?: Record<string, HeadersType> | undefined
  matchHeader?: [string, string]
  matchData?: RequestBody | undefined
  persist?: boolean
}

export type ResponseOptions<TResponse> = {
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
