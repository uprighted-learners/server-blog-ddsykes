const express = require("express");
const app = express();
const dotenv = require("dotenv");
const routes = require("./controllers/routes");

dotenv.config();

app.use(express.json());
app.use("/api", routes);

const PORT = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on the port ${PORT}`);
});
