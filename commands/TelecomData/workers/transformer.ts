import { closest } from 'fastest-levenshtein'
import { toSnakeCase } from 'js-string-helper'
import Logger from '@ioc:Adonis/Core/Logger'
import { store } from './repository'

// Transform the coming data from scraper based on model.
interface TransformerReturn {
  success: boolean
  message: string
}
const updateRowData = (rowData, rowDataKey, rowDataValue) => {
  if (rowDataKey === 'mobile_prefix' || rowDataKey === 'carrier_codes') {
    rowDataValue = rowDataValue.split(/[\s,]+/)
  }
  rowData[rowDataKey] = rowDataValue
}
const transformer = async (
  objectKeys: Array<any>,
  objectValues: Array<any>,
  $
): Promise<TransformerReturn> => {
  try {
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
    const toModify = [
      'number_format',
      'gsm_bands',
      'gsm_protocols',
      'umts_bands',
      'umts_protocols',
      'lte_bands',
      'lte_protocols',
    ]
    Logger.info('Transforming coming data from scraper...')
    for (let index = 0; index < objectKeys.length; index++) {
      const th = objectKeys[index]
      const td = objectValues[index]
      const rowKey = closest(toSnakeCase(th.toLowerCase()), Object.keys(rowData))
      if ($(td).find('a:contains("Coverage")').attr('href') && th === 'Coverage map') {
        const link = $(td).find('a:contains("Coverage")').attr('href')
        updateRowData(rowData, rowKey, link)
        continue
      }
      if ($(td).find('p').length && toModify.includes(rowKey)) {
        const objectValue = $(td)
          .find('p')
          .map((_, el) => $(el).text())
          .get()
        updateRowData(rowData, rowKey, objectValue)
        continue
      }
      if ($(td).find('li').length && toModify.includes(rowKey)) {
        const objectValue = $(td)
          .find('ul li')
          .map((_, el) => $(el).text())
          .get()
        updateRowData(rowData, rowKey, objectValue)
        continue
      }
      updateRowData(rowData, rowKey, td.text().trim())
    }
    //@ts-ignore
    rowData.carrier_link = objectValues.slice(-1)
    Logger.info('Transforming coming data from scraper ended successfully.')
    Logger.info('Sending transformed data to repository...')
    const storeReturn = await store(rowData)
    if (storeReturn.success === false) throw new Error(storeReturn.message)
    return {
      success: true,
      message: 'Transform ended successfully.',
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: `Transform ended with an error: ${error}`,
    }
  }
}

export { transformer }
