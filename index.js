const express = require("express");
const cors = require('cors')

const updateRoute = require('./routes/update')
const fetchRoute = require('./routes/fetch')


const app = express();
app.use(cors())
app.use(express.json());

const port = 4000;

app.use('/fetch',fetchRoute)
app.use('/update',updateRoute)

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
})


// const spreadsheetId = '1k3qa1oU9a6NBVHCdEt4G43k11V1ocblb14bqCDOWHcI'