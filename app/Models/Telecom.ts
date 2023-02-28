import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate } from '@ioc:Adonis/Lucid/Orm'

export default class Telecom extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public carrier_link: string

  @column()
  public name: string

  @column()
  public company: string

  @column()
  public country: string

  @column()
  public country_iso: string

  @column()
  public country_code: string

  @column()
  public carrier_website: string

  @column()
  public carrier_codes: string

  @column()
  public mvno: string

  @column()
  public mobile_prefix: string

  @column()
  public mobile_prefix_comment: string

  @column()
  public size_of_nsn: string

  @column()
  public number_format: string

  @column()
  public coverage_map: string

  @column()
  public comment: string

  @column()
  public subscribers: string

  @column()
  public gsm_bands: string

  @column()
  public gsm_protocols: string

  @column()
  public umts_bands: string

  @column()
  public umts_protocols: string

  @column()
  public lte_bands: string

  @column()
  public lte_protocols: string

  @column()
  public cdma_bands: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static convertToJson(telecom: Telecom) {
    telecom.number_format = JSON.stringify(telecom.number_format)
    telecom.mobile_prefix = JSON.stringify(telecom.mobile_prefix)
    telecom.carrier_codes = JSON.stringify(telecom.carrier_codes)

    telecom.gsm_bands = JSON.stringify(telecom.gsm_bands)
    telecom.gsm_protocols = JSON.stringify(telecom.gsm_protocols)

    telecom.umts_protocols = JSON.stringify(telecom.umts_protocols)
    telecom.umts_bands = JSON.stringify(telecom.umts_bands)

    if (telecom.lte_bands !== '' && telecom.lte_protocols !== '') {
      telecom.lte_protocols = JSON.stringify(telecom.lte_protocols)
      telecom.lte_bands = JSON.stringify(telecom.lte_bands)
    }
  }
}
