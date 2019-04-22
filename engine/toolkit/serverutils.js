import * as fs from 'fs'
import * as log from '../log/log.js'

export async function getServerConf (confFilePath) {
  const readFile = () => {
    return new Promise((resolve, reject) => {
      if (!confFilePath) reject(new Error('Configuration file path is empty'))

      fs.readFile(confFilePath, 'utf8', (error, output) => {
        if (error) {
          reject(error)
        } else {
          resolve(output)
        }
      })
    })
  }

  try {
    let rawJSON = await readFile(confFilePath)
    return JSON.stringify(rawJSON)
  } catch (error) {
    log.Logger.warning(error.message)
    return {}
  }
}
