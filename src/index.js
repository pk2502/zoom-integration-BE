const express = require("express");
const zoomRoutes = require("./routes/zoomRoutes");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Use CORS middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/api/zoom", zoomRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
