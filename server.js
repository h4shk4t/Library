const crypto = require("crypto");
const express = require("express");
const db = require("./database");
db.connect();
const app = express();
app.set("view engine", "ejs");

//Hashing function
function hashPassword(password) {
  var salt = crypto.randomBytes(128).toString("base64");
  var hash = crypto
    .createHash("sha256")
    .update(password + salt)
    .digest("base64");

  return {
    salt: salt,
    hash: hash,
  };
}

//Body parser (IDK what it exactly does?)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//ENVs setting the port
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});

//Setting view engine to ejs
app.set("view engine", "ejs");

//routes
app.get("/", function (req, res) {
  res.render("index");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.get("/dashboard", function (req, res) {
  res.render("dashboard");
});

app.post("/register", function (req, res) {
  let name = req.body.name;
  let username = req.body.username;
  let password = req.body.password;
  let passwordC = req.body.confirmPassword;
  var pass = hashPassword(password);
  db.query(
    "select * from users where NAME = " + db.escape(name) + ";",
    (error, result, field) => {
    console.log(result)
      if (result === undefined) {
        if (name && (password === passwordC)) {
          db.query(
            `INSERT INTO USERS VALUES(${db.escape(name)},'${pass.salt}', '${pass.hash}');`
          );
          //res.render(`somefile`, {data:some var in this block or function lmao})
        } else if (password !== passwordC) {
          res.send("Passwords didn't match");
        } else {
          res.send("password must not be emply");
        }
      } else {
        console.log("LMAO GG")
        console.log(result);
        res.send("Username is not unique");
      }
    }
  );
});
