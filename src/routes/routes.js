import express from "express";
import bcrypt from "bcryptjs";
import ejs from "ejs";

import { User, Ngo, Trans } from "../schema/mongoSchema.js";
import { getDate } from "../helpers/helpers.js";

const router = express.Router();

const saltRounds = 10;

const homeRoute = router.get("/", (_, res) => {
  res.render("index");
});

const featureRoute = router.get("/features", function (req, res) {
  res.render("features");
});

const aboutRoute = router.get("/about", function (req, res) {
  res.render("about");
});

const contactRoute = router.get("/contact", function (req, res) {
  res.render("contact");
});

const detailsRoute = router.get("/details", function (req, res) {
  res.render("details");
});

const userRegistationRoute = router.get("/userReg", function (req, res) {
  let errors = [];
  res.render("userReg", { errors: errors });
});

const loginRoute = router.get("/login/:type", function (req, res) {
  let errors = [];
  if (req.params.type === "user")
    res.render("loginuser", { type: "User", name: "Username", errors: errors });
  else
    res.render("loginuser", { type: "NGO", name: "NGOname", errors: errors });
});

const seeAllUserTransactionsRoute = router.get(
  "/trans/:ngoname",
  function (req, res) {
    Trans.find(function (error, trans) {
      if (error) {
        console.log("Something went wrrong");
      } else {
        res.render("allTransactionn", {
          ngoname: req.params.ngoname,
          trans,
          type: "ngo",
        });
      }
    });
  }
);

const seeAllNgoTransactionsRoute = router.get(
  "/transaction/:username",
  function (req, res) {
    Trans.find(function (error, trans) {
      if (error) {
        console.log("Something went wrrong");
      } else {
        res.render("allTransaction", {
          username: req.params.username,
          trans,
          type: "user",
        });
      }
    });
  }
);

const userLoginRoute = router.post("/loginuser", function (req, res) {
  let errors = [];
  if (req.body.User === "u")
    res.render("loginuser", { type: "User", name: "Username", errors });
  else res.render("loginuser", { type: "NGO", name: "NGOname", errors });
});

const enableTransactionRoute = router.post("/transaction", function (req, res) {
  const mess = "";
  const trans = new Trans({
    username: req.body.username,
    ngoname: req.body.ngoname,
    amount: req.body.amount,
    date: getDate(),
    status: "Sent",
    message: mess,
  });
  // TODO: addtion of payemt gateway
  trans.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.render("broadMsg", { msg: "Transaction Completed" });
    }
  });
});

const loginEntryRoute = router.post("/login", function (req, res) {
  let errors = [];
  const { username, password, button } = req.body;
  if (!username || !password) {
    errors.push({ msg: "Please enter all fields." });
    res.render("loginuser", {
      type: button,
      name: button + "name",
      errors,
    });
  } else if (req.body.button === "User") {
    User.findOne({ username: req.body.username }, function (err, user) {
      if (err) {
        console.log("Something went wrong or Account not found");
        errors.push({ msg: "Something went wrong. Try again." });
        res.render("loginuser", {
          type: "User",
          name: "Username",
          errors,
        });
      } else {
        if (user) {
          bcrypt.compare(
            req.body.password,
            user.password,
            function (err, result) {
              if (err) {
                console.log(err);
              } else if (result === true) {
                console.log("Logged in successfully");
                Ngo.find(function (error, ngo) {
                  if (error) {
                    errors.push({ msg: "something went wrong" });
                  } else {
                    res.render("welcome", { type: "User", user, ngos: ngo });
                  }
                });
                //console.log(ngos);
              } else {
                console.log("Incorrect password");
                errors.push({ msg: "Incorrect password." });
                res.render("loginuser", {
                  type: "User",
                  name: "Username",
                  errors,
                });
              }
            }
          );
        } else {
          console.log("Account not found");
          errors.push({ msg: "Account not found. Register Yourself." });
          res.render("loginuser", {
            type: "User",
            name: "Username",
            errors,
          });
        }
      }
    });
  } else {
    Ngo.findOne({ username: req.body.username }, function (err, user) {
      if (err) {
        console.log("Something went wrong or Account not found");
        errors.push({ msg: "Something went wrong. Try again." });
        res.render("loginuser", {
          type: "NGO",
          name: "NGOname",
          errors,
        });
      } else {
        if (user) {
          bcrypt.compare(
            req.body.password,
            user.password,
            function (err, result) {
              if (err) {
                console.log(err);
              } else if (result === true) {
                if (user.status == 0) {
                  errors.push({ msg: "Not Yet verified." });
                  res.render("loginuser", {
                    type: "NGO",
                    name: "NGOname",
                    errors,
                  });
                } else {
                  console.log("Logged in successfully");
                  Trans.find(function (err, trans) {
                    if (err) {
                      console.log(err);
                    } else {
                      res.render("ngoTransactions", {
                        ngoname: user.username,
                        trans,
                        today: getDate(),
                      });
                    }
                  });
                }
              } else {
                console.log("Incorrect password");
                errors.push({ msg: "Incorrect password." });
                res.render("loginuser", {
                  type: "NGO",
                  name: "NGOname",
                  errors,
                });
              }
            }
          );
        } else {
          console.log("Account not found");
          errors.push({ msg: "Account not found. Register Yourself." });
          res.render("loginuser", {
            type: "NGO",
            name: "NGOname",
            errors,
          });
        }
      }
    });
  }
});

const registerRoute = router.post("/register", function (req, res) {
  const { username, fullname, email, password, password1 } = req.body;
  let errors = [];
  if (!username || !password || !email || !fullname || !password1) {
    errors.push({ msg: "Please enter all details." });
    res.render("userReg", { errors });
  } else if (password1 != password) {
    errors.push({ msg: "Password not matched" });
    if (password.length < 8)
      errors.push({ msg: "Password must be at least 6 characters." });
    res.render("userReg", { errors });
  } else {
    User.findOne({ username: req.body.username }, function (err, user1) {
      if (err) {
        console.log("Something went wrong or Account not found");
      } else if (user1) {
        console.log("Username already exists");
        errors.push({ msg: "Username already exists. Try something else." });
        res.render("userReg", { errors });
      } else {
        bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
          if (err) {
            console.log(err);
          } else {
            const user = new User({
              username: req.body.username,
              fullname: req.body.fullname,
              email: req.body.email,
              password: hash,
            });

            user.save(function (err) {
              if (err) {
                console.log(err);
              } else {
                console.log("Registered");
                res.render("loginuser", { type: "User", name: "Username" });
              }
            });
          }
        });
      }
    });
  }
});

const ngoLoginRoute = router.post("/loginngo", function (req, res) {
  let errors = [];
  Ngo.findOne({ username: req.body.username }, function (err, user1) {
    if (err) {
      console.log("Something went wrong. Please try again.");
      errors.push({ msg: "NGO name already exists." });
      res.render("details", { errors });
    } else if (user1) {
      console.log("NGO name already exists");
      errors.push({ msg: "NGO name already exists." });
      res.render("details", { errors });
    } else {
      bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        if (err) {
          console.log(err);
        } else {
          const user = new Ngo({
            username: req.body.username,
            password: hash,
            email: req.body.email,
            phone: req.body.phoneNo,
            description: req.body.description,
            adress1: req.body.adress1,
            adress2: req.body.adress2,
            country: req.body.country,
            state: req.body.state,
            zip: req.body.zip,
            status: 0,
          });

          user.save(function (err) {
            if (err) {
              console.log(err);
            } else {
              console.log("Registered");
              res.render("broadMsg", {
                msg: "Thanks for registering. Please wait for the confirmation Email.",
              });
            }
          });
        }
      });
    }
  });
});

export {
  contactRoute,
  homeRoute,
  aboutRoute,
  featureRoute,
  detailsRoute,
  loginEntryRoute,
  loginRoute,
  userLoginRoute,
  userRegistationRoute,
  ngoLoginRoute,
  registerRoute,
  enableTransactionRoute,
  seeAllNgoTransactionsRoute,
  seeAllUserTransactionsRoute,
};
