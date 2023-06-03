const axios = require("axios");
const env = require("../../env");

async function connectyPayApi(axiosConfig, token) {
  let AuthHeader = token ? { Authorization: `Bearer ${token}` } : {};

  axiosConfig = {
    ...axiosConfig,
    url: `${env.CONNECTY_PAY_URL}/${axiosConfig.url}`,
    method: "POST",
    headers: {
      ...AuthHeader,
      Accept: "application/json",
      // "Content-Type": "application/json; charset=utf-8",
      "Content-Type": "application/json",
      Accept: "*/*",
      "Accept-Encoding": "gzip, deflate, br",
      Connection: "keep-alive",
    },
  };

  const res = await axios(axiosConfig);
  return res;
}

async function JWTRequisicao() {
  try {
    const res = await connectyPayApi({
      url: "JWTRequisicao",
      data: { Empresa: process.env.CONNECTY_PAY_EMPRESA },
    });
    return res.data;
  } catch (err) {
    console.error("JWTRequisicao() ERROR ->", err.response);
    throw new Error(err);
  }
}

async function WSCripto(token) {
  try {
    if (!token) throw new Error({ message: "ConnectyPay Token not found." });
    const res = await connectyPayApi(
      {
        url: "WSCripto",
        data: {
          UsrCod: process.env.CONNECTY_PAY_USR_COD,
          ChaveAcesso: process.env.CONNECTY_PAY_CHAVE_DE_ACESSO,
        },
      },
      token
    );
    return res.data;
  } catch (err) {
    console.error(err);
    return { error: true, messsage: err.message };
  }
}

async function WSValidaCartaoCred(key, dados_cartao, token) {
  try {
    if (!token) throw new Error({ message: "ConnectyPay Token not found." });
    const res = await connectyPayApi(
      {
        url: "WSValidaCartaoCred",
        data: {
          UsrCod: process.env.CONNECTY_PAY_USR_COD,
          Key: key,
          DadosCartao: dados_cartao,
        },
      },
      token
    );
    if (res.data.returnCode === "400") throw new Error(res.data.returnMessage);
    return res.data;
  } catch (err) {
    throw err;
  }
}

async function WSGatewayeCommerceV4(order, token) {
  try {
    if (!token) throw new Error({ message: "ConnectyPay Token not found." });

    const res = await connectyPayApi(
      {
        url: "WSGatewayeCommerceV4",
        data: {
          UsrCod: process.env.CONNECTY_PAY_USR_COD,
          ChaveAcesso: process.env.CONNECTY_PAY_CHAVE_DE_ACESSO,
          IdentFatura: process.env.CONNECTY_PAY_NOME_ESTAB,
          QtdParcela: order.installments || 1,
          Valor: order.totals.total,
          CpfCliente: order.payment_method.owner_document_id,
          TokenCartao: order.payment_method.card_token,
          Split: order.base64_split,
          Autorizacao: "A",
        },
      },
      token
    );
    return res.data;
  } catch (err) {
    console.error(err);
    return { error: true, messsage: err.message };
  }
}

async function WSGatewayeCommerceEstornoV4(order, token) {
  try {
    if (!token) throw new Error({ message: "ConnectyPay Token not found." });

    const res = await connectyPayApi(
      {
        url: "WSGatewayeCommerceEstornoV4",
        data: {
          ChaveAcesso: process.env.CONNECTY_PAY_CHAVE_DE_ACESSO,
          UsrCod: process.env.CONNECTY_PAY_USR_COD,
          tid: order.payment_data.tid,
          amount: String(Number(order.payment_data.amount) * 100),
        },
      },
      token
    );

    if (Number(res.data.ErrCode) > 0)
      throw { message: res.data.ErrDescription };
    return res.data;
  } catch (err) {
    console.error(err);
    throw { error: true, messsage: err.message };
  }
}

module.exports = {
  JWTRequisicao,
  WSCripto,
  WSValidaCartaoCred,
  WSGatewayeCommerceV4,
  WSGatewayeCommerceEstornoV4,
};
