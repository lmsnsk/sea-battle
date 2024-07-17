const cors = require("cors");
const express = require("express");
const session = require("express-session");
const apiRoutes = require("./routes/api.routes.js");
const authRoutes = require("./routes/auth.routes.js");
const path = require("path");

const app = express();
const PORT = 3333;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(apiRoutes);
app.use(authRoutes);

app.listen(PORT, async () => {
  console.log(`Server is listening on port ${PORT}...`);
});
