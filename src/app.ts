import express, { Express, Router } from 'express';
import env from './config/environment';
import sequelize from './config/database';
import { testSequelize } from './config/database';
import { setupAssociations } from './models';
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes';
const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/auth', authRoutes)
app.use('/user', userRoutes)

// database init and server start
async function startServer(): Promise<void> {
    try {

        //comment this out if successful one time or when u change something in the models
        // await testSequelize();
        
        setupAssociations();
        // console.log("www")

        // comment out nsd ni if wala natay changes
        // await sequelize.sync();
        
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
