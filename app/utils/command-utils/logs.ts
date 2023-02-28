/* eslint-disable prettier/prettier */
import fs from 'fs'
import path from 'path'

export const logFile = (fileName, data) => {
  const dir = path.join(__dirname, `../../logs/${fileName}.txt`)
  fs.appendFileSync(dir, data)
}
