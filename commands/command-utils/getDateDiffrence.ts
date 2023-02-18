var path = require('path')
import fs from 'fs'

export default () => {
  try {
    const filePath = path.join(__dirname, 'links.txt')
    const { birthtime } = fs.statSync(filePath)
    const fileDate = new Date(birthtime)
    const now = new Date()
    //@ts-ignore
    return Math.floor((now - fileDate) / (1000 * 60 * 60 * 24))
  } catch (err) {
    return 0
  }
}
