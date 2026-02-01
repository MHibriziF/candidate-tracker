import { testConnection } from '../data/db'
import { Errors } from '../utils/error'

export default defineEventHandler(async () => {
  try {
    const time = await testConnection()

    return {
      status: "ok",
      database: "connected",
      timestamp: time.now
    }

  } catch (err: any) {

    console.error("DB Health Check Failed:", err)

    throw Errors.db(err)

  }
})
