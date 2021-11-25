export const getBatchSDK = () => {
  /* Load remote Batch SDK JavaScript code */
  /* eslint-disable-next-line */
  ;(function (b, a, t, c, h, e, r) {
    h = 'batchSDK'
    b[h] =
      b[h] ||
      function () {
        /* eslint-disable-next-line */
        ;(b[h].q = b[h].q || []).push(arguments)
      }
    ;(e = a.createElement(t)), (r = a.getElementsByTagName(t)[0])
    e.async = 1
    e.src = c
    r.parentNode.insertBefore(e, r)
  })(window, document, 'script', 'https://via.batch.com/v3/bootstrap.min.js')
}
