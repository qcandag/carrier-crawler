import fs from 'fs'
import Logger from '@ioc:Adonis/Core/Logger'

interface WriterReturn {
  success: boolean
  message: string
}
const writer = (urls: Array<string>, filePath: string): WriterReturn => {
  try {
    Logger.info('Writing scraped URLs...')
    for (let index = 0; index < urls.length; index++) {
      const url = urls[index]
      fs.appendFileSync(filePath, url + '\n')
    }
    Logger.info('Writed scraped URLs successfully.')
    return {
      success: true,
      message: 'Writing ended successfully.',
    }
  } catch (error) {
    return {
      success: false,
      message: `Writing ended with an error: ${error}`,
    }
  }
}

export { writer }
