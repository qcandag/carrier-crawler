import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'telecoms'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('carrier_link')
      table.string('name')
      table.string('company')
      table.string('country')
      table.string('country_iso')
      table.string('country_code')
      table.string('carrier_website')
      table.json('carrier_codes')
      table.string('mvno')
      table.json('mobile_prefix')
      table.string('mobile_prefix_comment')
      table.string('size_of_nsn')
      table.json('number_format')
      table.string('coverage_map')
      table.string('comment')
      table.string('subscribers')
      table.json('gsm_bands')
      table.json('gsm_protocols')
      table.json('umts_bands')
      table.json('umts_protocols')
      table.json('lte_bands')
      table.json('lte_protocols')
      table.string('cdma_bands')
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
