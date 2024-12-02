import server from './server.js';
import connection from './database.js';
import messaging from './config/messaging.js';
import { startCronJob } from './utils/cronJobs.js';



connection();

messaging();


server.listen(process.env.PORT || 4001, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${process.env.PORT || 4002}`);
    startCronJob(server);
});
     