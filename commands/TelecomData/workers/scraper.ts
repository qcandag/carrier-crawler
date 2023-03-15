// Scrapte all the data based on the condition.
var axios = require('axios')
var cheerio = require('cheerio')
import fs from 'fs'
import getDateDiffrence from '../../../app/utils/command-utils/getDateDiffrence'
import Telecom from 'App/Models/Telecom'
import Logger from '@ioc:Adonis/Core/Logger'
import { transformer } from './transformer'
interface ScraperReturn {
  success: boolean
  message: string
  urls?: Array<string>
}

const getPage = (pageNumber: number = 1) => {
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

const scraper = async (isFile: boolean, filePath: string): Promise<ScraperReturn> => {
  try {
    if (isFile) {
      Logger.info('Scraping telecoms...')
      const objectKeys = []
      const objectValues = []

      const data = fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' }).split('\n')
      for (let index = 0; index < data.length; index++) {
        if (await Telecom.findBy('carrier_link', data[index])) continue
        const $ = cheerio.load((await getCarrier(data[index])).data)
        const rows = $('table tbody tr')
        rows.each((_, row) => {
          const th = $(row).find('th')
          const td = $(th).next()
          //@ts-ignore
          objectKeys.push(th.text())
          //@ts-ignore
          objectValues.push(td)
        })
        //@ts-ignore
        objectValues.push(data[index])
        Logger.info(`Sent Date: ${new Date(new Date().toDateString())} Url: ${data[index]}`)
        const transformReturn = await transformer(objectKeys, objectValues, $)
        if (transformReturn.success === false) throw new Error(transformReturn.message)
      }
      return {
        success: true,
        message: 'Scraping ended successfully.',
      }
    } else {      
      Logger.info("Scraping telecom page's...")
      if (getDateDiffrence() > 2) {
        fs.unlink(filePath, (err) => {
          if (err) throw err
        })
      }
      const $ = cheerio.load((await getPage()).data)
      const pageNumber = parseInt(
        $('.pager').first().children('li').children('a').last().attr('href').replace(/\D/g, '')
      )
      const urls = []
      for (let index = 1; index <= pageNumber; index++) {
        const request = getPage(index)
        const $ = cheerio.load((await request).data)
        $('table tbody tr').each((_, tr) => {
          const link = `https://www.imei.info${$(tr)
            .children('td')
            .first()
            .children('a')
            .attr('href')}`
          //@ts-ignore
          urls.push(link)
        })
      }
      return {
        success: true,
        message: 'Scraping ended successfully.',
        urls: urls,
      }
    }
  } catch (error) {
    return {
      success: false,
      message: `Scraping ended with an error: ${error}`,
    }
  }
}
export { scraper }
