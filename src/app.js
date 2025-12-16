const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("API is working!");
});

app.use("/books", require("./routes/book.routes"));
app.use("/members", require("./routes/member.routes"));
app.use("/transactions", require("./routes/transaction.routes"));
app.use("/fines", require("./routes/fine.routes"));

module.exports = app;
