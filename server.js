// require('dotenv').config()
const app = require('./src/app/app')
const dataBase = require('./utils/db')
const config = require('./src/config/config')
const Routing = require('./src/routes/auth.routes')



// database connection
const PORT = config.PORT 
dataBase()
app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`);
    
})

