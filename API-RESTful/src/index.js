import server from './server.js';
import connection from './database.js';
import messaging from './config/messaging.js';

connection();

messaging();

server.listen(process.env.PORT || 3000, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${process.env.PORT || 3000}`);
});
     