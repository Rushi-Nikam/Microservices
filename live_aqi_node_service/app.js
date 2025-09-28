const express = require('express');
const cors = require('cors');

const busRoutes = require('./routes/busroutes');
const miscRoutes = require('./routes/index');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/', miscRoutes);
app.use('/bus', busRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
