import { BaseCommand } from '@adonisjs/core/build/standalone'

export default class DataTelecom extends BaseCommand {
  public static commandName = 'data:telecom'

  /**
   * Command description is displayed in the "help" output
   */
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
    this.logger.info('Hello world!')
  }
}
