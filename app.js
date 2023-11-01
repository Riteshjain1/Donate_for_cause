import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import {
  aboutRoute,
  contactRoute,
  featureRoute,
  homeRoute,
  detailsRoute,
  userRegistationRoute,
  loginRoute,
  seeAllUserTransactionsRoute,
  seeAllNgoTransactionsRoute,
  userLoginRoute,
  enableTransactionRoute,
  loginEntryRoute,
  registerRoute,
  ngoLoginRoute,
} from "./src/routes/routes.js";

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const url = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.yi94a.mongodb.net/userDB?retryWrites=true&w=majority`;
mongoose.set({ strictQuery: false });
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database Connected..");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/", homeRoute);
app.use("/contact", contactRoute);
app.use("/features", featureRoute);
app.use("/about", aboutRoute);
app.use("/details", detailsRoute);
app.use("/userReg", userRegistationRoute);
app.use("/login/:type", loginRoute);
app.use("/trans/:ngoname", seeAllUserTransactionsRoute);
app.use("/transaction/:username", seeAllNgoTransactionsRoute);
app.use("/loginuser", userLoginRoute);
app.use("/transaction", enableTransactionRoute);
app.use("/login", loginEntryRoute);
app.use("/register", registerRoute);
app.use("/loginngo", ngoLoginRoute);

app.get("/instagram", function (req, res) {
  res.redirect("https://www.instagram.com/r.it_esh");
});

app.get("/linkedin", function (req, res) {
  res.redirect("https://linkedin.com/in/ritesh-ranka/");
});

app.get("/twitter", function (req, res) {
  res.redirect("https://twitter.com/Ritesh82223581");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started...");
});

export { mongoose };
