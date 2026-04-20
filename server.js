require('dotenv').config()
const app = require('./src/app')
const dataBase = require('./utils/db')

const PORT =process.env.PORT


dataBase()
app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`);
    
})

