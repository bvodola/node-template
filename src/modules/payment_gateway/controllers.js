const models = require("../models");
const connectypay = require("./connectypay/controllers");
const paymentGatewayHelpers = require("./helpers");

const makePayment = async (order) => {
  try {
    // Get ConnectyPay token
    const { token } = await connectypay.JWTRequisicao();

    // Get company/user plan
    const company = await models.Companies.findById(order.company_id);
    const company_user = await models.Users.findById(company.user_id);
    const plan = await models.Plans.findById(company_user.plan_id);

    // Calculate split object
    const split = paymentGatewayHelpers.calculateSplit(
      order.totals,
      company.connectypay_ec || company_user.connectypay_ec || null,
      plan
    );
    order.base64_split = Buffer.from(split).toString("base64");

    // Make API call to connectypay
    const paymentData = await connectypay.WSGatewayeCommerceV4(order, token);

    // If there's an error, we add the error flag and throw
    if (Number(paymentData.ErrCode) > 0) throw { error: true, ...paymentData };

    return paymentData;
  } catch (err) {
    console.error(err);
    return err.response && err.response.data ? err.response.data : err;
  }
};

const cancelPayment = async (order_id) => {
  try {
    // Get ConnectyPay token
    const { token } = await connectypay.JWTRequisicao();

    // Get order object
    const order = await models.Orders.findById(order_id);

    // Make API call to connectypay
    const paymentData = await connectypay.WSGatewayeCommerceEstornoV4(
      order,
      token
    );

    return paymentData;
  } catch (err) {
    throw err;
  }
};

async function addCreditCard(key, card_data, token) {
  try {
    const data = await connectypay.WSValidaCartaoCred(key, card_data, token);

    return {
      error: false,
      ...data,
    };
  } catch (err) {
    console.log(err);
    return { error: true, message: err.message };
  }
}

async function getCryptoParams() {
  try {
    const { token } = await connectypay.JWTRequisicao();
    const crypto_data = await connectypay.WSCripto(token);
    return {
      ...crypto_data,
      token,
    };
  } catch (err) {
    console.error(err);
    return { error: true, message: err.message };
  }
}

module.exports = {
  makePayment,
  addCreditCard,
  getCryptoParams,
  cancelPayment,
};
