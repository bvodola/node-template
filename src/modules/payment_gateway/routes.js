const express = require("express");
const {
  makePayment,
  addCreditCard,
  getCryptoParams,
} = require("./controllers");
let router = express.Router();

router.post("/make-payment", async (req, res) => {
  const { order } = req.body;
  const data = await makePayment(order);
  res.send(data);
});

router.post("/add-credit-card", async (req, res) => {
  const data = await addCreditCard(
    req.body.key,
    req.body.card_data,
    req.body.token
  );
  res.send(data);
});

router.get("/get-crypto-params", async (req, res) => {
  const data = await getCryptoParams();
  res.send(data);
});

module.exports = router;
