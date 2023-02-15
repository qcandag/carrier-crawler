import { BaseCommand } from '@adonisjs/core/build/standalone'
var axios = require('axios')
var cheerio = require('cheerio')
var path = require('path')
const readline = require('readline')

import fs from 'fs'
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
    const { default: Telecom } = await import('App/Models/Telecom')
    const filePath = path.join(__dirname, 'command-utils', 'links.txt')

    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' }).split('\n')
      const rowData = {
        carrier_link: '',
        name: '',
        company: '',
        country: '',
        country_code: '',
        carrier_webiste: '',
        carrier_codes: '',
        mobile_prefix: '',
        size_of_nsn: '',
        number_format: '',
        coverage_map: '',
        subscribers: '',
        gsm_bands: '',
        gsm_protocols: '',
        umts_bands: '',
        umts_protocols: '',
        lte_bands: '',
        lte_protocols: '',
      }
      for (let index = 0; index <= data.length; index++) {
        if (await Telecom.findBy('carrier_link', data[index])) continue
        const request = axios.get(data[index], {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
          },
        })
        const $ = cheerio.load((await Promise.resolve(request)).data)
        rowData.carrier_link = data[0]

        const rows = $('table tbody tr')
        rows.each((i, row) => {
          const tds = $(row).find('td')
          const coverageLink = $(row).find('td a:contains("Check AWCC Coverage")').attr('href')
          tds.each((_, td) => {
            const text = $(td).text().trim()
            switch (i) {
              case 0:
                rowData.name = text
                break
              case 1:
                rowData.company = text
                break
              case 2:
                rowData.company = text
                break
              case 3:
                rowData.country = text
                break
              case 4:
                rowData.country_code = text
                break
              case 5:
                rowData.carrier_webiste = text
                break
              case 6:
                rowData.carrier_codes = text
                break
              case 7:
                rowData.mobile_prefix = text
                break
              case 8:
                rowData.size_of_nsn = text
                break
              case 9:
                rowData.number_format = text
                break
              case 10:
                rowData.coverage_map = coverageLink
                break
              case 11:
                rowData.subscribers = text
                break
              case 12:
                rowData.gsm_bands = text
                break
              case 13:
                rowData.gsm_protocols = text
                break
              case 14:
                rowData.umts_bands = text
                break
              case 15:
                rowData.umts_protocols = text
                break
              case 16:
                rowData.lte_bands = text
                break
              case 17:
                rowData.lte_protocols = text
                break
              default:
                break
            }
          })
        })
        await Telecom.create(rowData)
      }
    } else {
      const request = axios.get('https://www.imei.info/carriers/', {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
          'Accept': '*/*',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
        },
      })
      const $ = cheerio.load((await Promise.resolve(request)).data)
      const pageNumber = parseInt(
        $('.pager').first().children('li').children('a').last().attr('href').replace(/\D/g, '')
      )
      for (let index = 1; index <= pageNumber; index++) {
        const request = axios.get(`https://www.imei.info/carriers/?page=${index}`, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
          },
        })
        const $ = cheerio.load((await Promise.resolve(request)).data)
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
    try {
    } catch (error) {
      this.logger.error(error)
    }
    this.logger.success('Command Completed!')
  }
}
