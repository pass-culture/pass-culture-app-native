const profileDevice = (
  tmxOrgId: string,
  tmxFpsServer: string,
  callback: (sessionId: string) => void
) => {
  // eslint-disable-next-line no-console
  console.log('TOOD: tmx Web integration', { tmxOrgId, tmxFpsServer, callback })
  callback('TMX-web-mock-sessionXYZ')
}

const Profiling = {
  profileDevice,
}

export default Profiling
