import { BaseCommand } from '@adonisjs/core/build/standalone'
var axios = require('axios')
var cheerio = require('cheerio')
var path = require('path')
import fs from 'fs'
import getDateDiffrence from '../app/utils/command-utils/getDateDiffrence'
import { toSnakeCase } from 'js-string-helper'
import { closest } from 'fastest-levenshtein'

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
    const filePath = path.join(__dirname, '..', 'app', 'utils', 'command-utils', 'links.txt')

    try {
      this.logger.info('Command Running!')
      const getCarriersPage = (pageNumber: number = 1) => {
        const request = axios.get(`https://www.imei.info/carriers/?page=${pageNumber}`, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
          },
        })
        return request
      }
      const getCarrier = (url: string) => {
        const request = axios.get(url, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
          },
        })
        return request
      }
      const updateRowData = (rowData, rowDataKey, rowDataValue) => {
        if (rowDataKey === 'mobile_prefix' || rowDataKey === 'carrier_codes') {
          rowDataValue = rowDataValue.split(/[\s,]+/)
        }
        rowData[rowDataKey] = rowDataValue
      }

      const withFileFunction = async (filePath, Telecom) => {
        const data = fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' }).split('\n')
        const rowData = {
          carrier_link: '',
          name: '',
          company: '',
          country: '',
          country_iso: '',
          country_code: '',
          carrier_website: '',
          carrier_codes: '',
          mvno: '',
          mobile_prefix: '',
          mobile_prefix_comment: '',
          size_of_nsn: '',
          number_format: '',
          coverage_map: '',
          comment: '',
          subscribers: '',
          gsm_bands: '',
          gsm_protocols: '',
          umts_bands: '',
          umts_protocols: '',
          lte_bands: '',
          lte_protocols: '',
          cdma_bands: '',
        }
        for (let index = 1; index <= data.length; index++) {
          if (await Telecom.findBy('carrier_link', data[index])) continue
          const $ = cheerio.load((await getCarrier(data[index])).data)
          const rows = $('table tbody tr')
          const coverageLink = $(rows).find('td a:contains("Coverage")').attr('href')
          rows.each((i, row) => {
            const th = $(row).find('th')
            const td = $(th).next()
            const objectKey = closest(toSnakeCase(th.text().toLowerCase()), Object.keys(rowData))
            if ($(td).find('p').length && objectKey === 'number_format') {
              const objectValue = $(td)
                .find('p')
                .map((i, el) => $(el).text())
                .get()
              rowData[objectKey] = objectValue
              return
            }
            updateRowData(rowData, objectKey, td.text().trim())
          })
          rowData.carrier_link = data[index]
          rowData.coverage_map = coverageLink
          await Telecom.create(rowData)
        }
      }

      const withoutFileFunction = async (filePath: any) => {
        if (getDateDiffrence() > 2) {
          fs.unlink(filePath, (err) => {
            if (err) throw err
          })
        }
        const $ = cheerio.load((await getCarriersPage()).data)
        const pageNumber = parseInt(
          $('.pager').first().children('li').children('a').last().attr('href').replace(/\D/g, '')
        )
        for (let index = 1; index <= pageNumber; index++) {
          const request = getCarriersPage(index)
          const $ = cheerio.load((await request).data)
          $('table tbody tr').each((_, tr) => {
            const link = `https://www.imei.info${$(tr)
              .children('td')
              .first()
              .children('a')
              .attr('href')}`
            fs.appendFile(filePath, link + '\n', (err) => {
              if (err) throw err
            })
          })
        }
      }

      const state = fs.existsSync(filePath) && getDateDiffrence() <= 2
      const fileActionFunctions = {
        true: (filePath, Telecom) => withFileFunction(filePath, Telecom),
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
