const app = require("./app");
const pool = require("./config/db");

const PORT = 3000;

pool.query("SELECT 1")
  .then(() => {
    console.log("MySQL connected");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MySQL connection failed:", err);
  });
