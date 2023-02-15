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
      table.string('country_code')
      table.string('carrier_webiste')
      table.string('carrier_codes')
      table.string('mobile_prefix')
      table.string('size_of_nsn')
      table.string('number_format')
      table.string('coverage_map')
      table.string('subscribers')
      table.string('gsm_bands')
      table.string('gsm_protocols')
      table.string('umts_bands')
      table.string('umts_protocols')
      table.string('lte_bands')
      table.string('lte_protocols')
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
