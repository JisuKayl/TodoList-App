require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;
const routes = require("./src/routes/index");

app.use(cors());
app.use(express.json());
app.use(routes);

app.get("/", (req, res) => {
  res.json("Test");
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
