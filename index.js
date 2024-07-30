
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");


dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_KEY);

const app = express();
app.use(cors({ origin: true }));

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "success!",
  });
});

app.post("/payment/create", async (req, res) => {
  const total = req.query.total;

  if (total > 0) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: "usd",
      });
      res.status(201).json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  } else {
    res.status(403).json({
      message: "total must be greater than 0",
    });
  }
});

app.listen(5001, (err)=>{
  if(err) throw err
  console.log("amazon Server runing on PORT: 5000, http://localhost:5001")
})


