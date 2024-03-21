const express= require ('express');
const mainRouter = require('./routes/index');
const cors = require('cors');
const app = express();


app.use(cors());


//body parser is not being used in express 4.16 and above
app.use(express.json());

// app.use is used to create middleware or runmiddleware before function
// it is also used to route the requests to the specified path over to another router
//we can all request to go to /api/v1 plz go to routes/index.js file this file will handle all the requests
app.use("/api/v1", mainRouter);


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});