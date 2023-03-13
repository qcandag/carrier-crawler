// Scrapte all the data based on the condition.
var axios = require('axios')
var cheerio = require('cheerio')
import fs from 'fs'
import getDateDiffrence from '../../../app/utils/command-utils/getDateDiffrence'

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

const scraper = async (isFile: boolean, filePath: string): Promise<ScraperReturn> => {
  try {
    if (isFile) {
      // go and scrape just page urls and return true
      return {
        success: true,
        message: 'Scraping ended successfully.',
      }
    } else {
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
