import fs from 'fs'

interface WriterReturn {
  success: boolean
  message: string
}
const writer = (urls: Array<string>, filePath: string): WriterReturn => {
  try {
    for (let index = 0; index < urls.length; index++) {
      const url = urls[index]
      fs.appendFileSync(filePath, url + '\n')
    }
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
