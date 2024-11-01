import server from './server.js';
import connection from './database.js';

connection();

server.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on http://localhost:${process.env.PORT || 3000}`);
});
     