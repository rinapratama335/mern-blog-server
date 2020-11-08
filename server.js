const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT;

app.listen(port, () => console.log(`Server running on port ${port}`));
