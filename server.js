const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const routes = require("./src/router/routes");
app.use("/api/v1", routes);

const port = process.env.PORT;

app.listen(port, () => console.log(`Server running on port ${port}`));
