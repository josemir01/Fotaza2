import { connectDatabase } from "./models/index.js";
import { seed } from './Seeders/seed.js'

try {

  await connectDatabase();

  await seed();
  console.log("Seeder ejecutado correctamente");
} catch (err) {
  console.error(err);
} finally {
  process.exit(0);
}