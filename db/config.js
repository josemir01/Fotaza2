import 'dotenv/config'
import { Sequelize } from 'sequelize';

console.log(process.env.DB_PASSWORD)

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    // dialectOptions: {
    //     ssl: {
    //         require: true,
    //         rejectUnauthorized: false // Esto es obligatorio para que Render y Neon se entiendan sin problemas de certificados
    //     }
    // }
})

export default sequelize

