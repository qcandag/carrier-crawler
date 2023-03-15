import Telecom from 'App/Models/Telecom'
import Logger from '@ioc:Adonis/Core/Logger'
interface RepositoryReturn {
  success: boolean
  message: string
}
const store = async (dataObject: object): Promise<RepositoryReturn> => {
  try {
    Logger.info('Saving coming data...')
    await (await Telecom.create(dataObject)).save()
    Logger.info('Coming data saved successfully.')
    return {
      success: true,
      message: 'Telecom saved  successfully.',
    }
  } catch (error) {
    return {
      success: false,
      message: `Saving ended with an error: ${error}`,
    }
  }
}

export { store }
