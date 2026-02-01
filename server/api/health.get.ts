import { testConnection } from "../data/db";
import { Errors } from "../utils/error";

export default defineEventHandler(async () => {
  try {
    const time = await testConnection();

    return {
      status: "ok",
      database: "connected",
      timestamp: time.now,
    };
  } catch (err: any) {
    throw Errors.db("Failed to connect with database", err);
  }
});
