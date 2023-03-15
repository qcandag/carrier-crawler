/* eslint-disable prettier/prettier */
import { BaseCommand } from '@adonisjs/core/build/standalone'
var path = require('path')
import fs from 'fs'
import getDateDiffrence from '../../app/utils/command-utils/getDateDiffrence'

import { scraper } from './workers/scraper'
import { writer } from './workers/writer'

export default class DataTelecom extends BaseCommand {
  public static commandName = 'data:telecom'

  public static description = 'Get telecom providers data.'

  public static settings = {
    /**
     * Set the following value to true, if you want to load the application
     * before running the command. Don't forget to call `node ace generate:manifest`
     * afterwards.
     */
    loadApp: true,

    /**
     * Set the following value to true, if you want this command to keep running until
     * you manually decide to exit the process. Don't forget to call
     * `node ace generate:manifest` afterwards.
     */
    stayAlive: false,
  }

  public async run() {
    const { default: Telecom } = await import('App/Models/Telecom')
    const filePath = path.join(__dirname, '..', '..', 'app', 'utils', 'command-utils', 'links.txt')

    try {
      this.logger.info('Command Running!')

      const withFileFunction = async (filePath) => {
        const data = await scraper(true, filePath)
        if (data.success === false) throw new Error(data.message)
      }

      const withoutFileFunction = async (filePath: any) => {
        const data = await scraper(false, filePath)
        if (data.success === false) throw new Error(data.message)
        //@ts-ignore
        writer(data.urls, filePath)
      }

      const state = fs.existsSync(filePath) && getDateDiffrence() <= 2
      const fileActionFunctions = {
        true: (filePath) => withFileFunction(filePath),
        false: (filePath) => withoutFileFunction(filePath),
      }
      //@ts-ignore
      await fileActionFunctions[state](filePath, Telecom)
      this.logger.success('Command Completed!')
    } catch (err) {
      this.logger.error(err)
    }
  }
}
