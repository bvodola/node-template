/**
 * Calculates the split between the app company and client company
 * @param {object} totals contains total, subtotal and shipping_cost values
 * @param {*} company_code the ConnectyPay company code (EC)
 * @param {*} plan the charging plan selected by that company
 */
function calculateSplit(totals, company_code, plan) {
  try {
    const net_amount =
      totals.total * (1 - plan.percentage_fee) - plan.fixed_fee;
    const normalized_percentage =
      (plan.percentage * totals.subtotal) / net_amount;

    let splitArray = [
      {
        SplitUsrCod: process.env.CONNECTY_PAY_USR_COD,
        SplitPerc: company_code ? normalized_percentage * 10000 : 10000,
      },
    ];

    if (company_code) {
      splitArray = [
        ...splitArray,
        {
          SplitUsrCod: company_code,
          SplitPerc: (1 - normalized_percentage) * 10000,
        },
      ];
    }

    return splitArray;
  } catch (err) {
    console.error("payment_gateway/helpers/calculateSplit() ERROR ->", err);
    return [];
  }
}

module.exports = {
  calculateSplit,
};
