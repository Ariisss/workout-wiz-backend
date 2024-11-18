import express, { Express, Router } from 'express';
import env from './config/environment';
import sequelize from './config/database';
import { testSequelize } from './config/database';
import { setupAssociations } from './models';
const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// database init and server start
async function startServer(): Promise<void> {
    try {

        //comment this out if successful one time or when u change something in the models
        await testSequelize();
        
        setupAssociations();
        
        // comment out nsd ni if wala natay changes
        await sequelize.sync({force: true});
        
        app.listen(env.PORT, () => {
            console.log(`Server is running on port ${env.PORT}`);
        });

    } catch (error) {
        console.error('Unable to start server:', error);
        process.exit(1);
    }
}

startServer();

export default app;
