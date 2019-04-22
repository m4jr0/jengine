import * as log from '../log/log.js'

export async function getClientConf (confFilePath) {
  if (confFilePath === undefined) {
    log.Logger.error('Configuration file path is undefined')
  }

  const response = await fetch(confFilePath)

  try {
    return await response.json()
  } catch (error) {
    log.Logger.warning(error.message)
    return {}
  }
}
