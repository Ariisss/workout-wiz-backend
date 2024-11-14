import { Sequelize } from "sequelize"
import env from './environment'

const sequelize = new Sequelize(env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
})

export default sequelize