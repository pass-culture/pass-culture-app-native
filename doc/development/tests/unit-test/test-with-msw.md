# How to test with MSW server

When we have to do a request to a server, for example our own API or the recommandation endpoint, we have to use a mocked server in our tests.
For that purpose we use msw, and `mockServer` utils, and 8 possible methods: `getApi`, `postApi`, `putApi`, `deleteApi`, `universalGet`, `universalPost`, `universalPut`, `universalDelete`.

They are two types of call: the one to our backend `api/native` and the other ones. We also have two uses of our mocked request : those who responds with a status code 200 and a data (that we use the most) and the one with an error. Here are different example on how to use the mockServer in different use cases.

## Call to our API with data in response

For those calls we want to type correctly the data.

```ts
mockServer.getApi<UpdateEmailTokenExpiration>('/profile/token_expiration', {
  expiration: undefined,
})
```

## Call to our API but we want the response to persist for more than one call (here the data is empty)

For this use case, we need to pass the data in responseOptions field, and we use the persist option in requestOptions as follows :

```ts
mockServer.postApi('/change_password', {
  responseOptions: { data: {} },
  requestOptions: { persist: true },
})
```

## Call to our API but the response is an error

Same as before, we need to go through the responseOptions field.

Try to type the error data when possible.

```ts
mockServer.postApi('/profile/update_email', {
  responseOptions: { statusCode: 400, data: { code: 'INVALID_PASSWORD' } },
})
```

## Call to another API than our `native` (the url needs to be full)

It works the same with post, put or delete functions.

```ts
mockServer.universalGet(`https://recommmendation-endpoint/similar_offers/${mockOfferId}`, {
  hits: [],
})
```
