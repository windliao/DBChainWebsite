import Neon, {
  rpc,
  wallet,
  nep5,
  api,
  sc,
  u,
  tx
} from "@cityofzion/neon-js";
import cookie from "js-cookie";
import {
  get_address_abstracts
} from "@/api/index";

import {
  dbc_balance
} from "@/api";
//const netType = 'https://api.neoscan.io'
const netType = "https://neocli.dbchain.ai";
//const netType = 'http://seed2.aphelion-neo.com:10332'
const DBCHash = "b951ecbbc5fe37a9c280a76cb0ce0014827294cf"; // DBC assetId
const DBC_NAME = "DEEPBRAIN COIN";
const testAddress = "AKMqDy51FuMnc4poiGBczQvPh6819hQuLH";

export let account = undefined;

export const client = new rpc.RPCClient(netType);

export function saveCookie(account, encryptedKey) {
  if (wallet.isAddress(account.address)) {
    cookie.set("address", account.address); // save address
  }
  if (wallet.isWIF(account.WIF) || wallet.isPrivateKey(account.privateKey)) {
    cookie.set("privateKey", account.privateKey);
    cookie.set("WIF", account.WIF);
  }
  if (wallet.isPublicKey(account.publicKey)) {
    cookie.set("publicKey", account.publicKey);
  }
  if (wallet.isNEP2(encryptedKey)) {
    cookie.set("encryptedKey", encryptedKey);
  }
}

export function closeAc() {
  cookie.remove("privateKey");
  cookie.remove("address");
  cookie.remove("mail");
  cookie.remove("encryptedKey");
  account = undefined;
}

export function initAccount(privateKey) {
  if (wallet.isPrivateKey(privateKey) || wallet.isWIF(privateKey)) {
    account = new wallet.Account(privateKey);
    return account;
  } else {
    return undefined;
  }
}

export function initAccountFromEncryptedKey(encryptedKey, password) {
  return new Promise((resolve, reject) => {
    if (wallet.isNEP2(encryptedKey)) {
      account = new wallet.Account(encryptedKey);
      account
        .decrypt(password)
        .then(account => {
          resolve(account);
        })
        .catch(e => {
          reject(e);
        });
    } else {
      reject("the key is wrong~!");
    }
  });
}

export function getBalance_old() {
  return new Promise((resolve, reject) => {
    if (account) {
      const scriptHash = DBCHash;
      //const apiProvider = new api.neoscan.instance('MainNet')
      //  const apiProvider = new api.neoscan.instance(
      //    "https://api.neoscan.io/api/main_net"
      //   ); //
      const apiProvider = new api.neoCli.instance("https://neocli.dbchain.ai"); //or "http://seed5.ngd.network:20332" for TestNet );

      apiProvider
        .getBalance(account.address)
        .then(res => {
          // console.log(res)
          const nep5AssetsArray = [];
          res.tokenSymbols.forEach(symbol => {
            const fixed8 = res.tokens[symbol];
            const balance = fixed8.toNumber();
            nep5AssetsArray.push({
              symbol,
              balance
            });
          });
          const dbc_info = nep5AssetsArray.find(
            item => item.symbol === DBC_NAME
          );
          if (dbc_info) {
            console.log(dbc_info);
            resolve(dbc_info);
          } else {
            resolve({
              balance: 0
            });
          }
        })
        .catch(err => {
          console.log(err);
          reject("please open wallet");
        });

      /*nep5.getToken(netType, scriptHash, account.address).then(res => {
        console.log(res)
        resolve({
          name: res.name,
          symbol: res.symbol,
          balance: res.balance.c[0],
          decimals: res.decimals
        })
      }).catch(err => {
        console.log(err)
        reject('please open wallet')
      })*/
    } else {
      reject("please open wallet");
    }
  });
}

export function getBalance() {
  return new Promise((resolve, reject) => {
    if (account) {
      dbc_balance({
        user_wallet_address: account.address,
        language: "CN"
      }).then(res => {

        resolve({
          symbol: DBC_NAME,
          balance: res.content
        });

      }).catch(err => {

      })
    } else {
      reject("please open wallet");
    }
  });
}

// new Account
export function createAccount(password) {
  return new Promise((resole, reject) => {
    const privateKey = wallet.generatePrivateKey();
    const ac = new wallet.Account(privateKey);
    wallet
      .encrypt(ac.WIF, password)
      .then(nep2Key => {
        account = ac;
        resole({
          nep2Key,
          privateKey
        });
      })
      .catch(err => {
        reject(err);
      });
  });
}

export function getWIFFromPrivateKey(privateKey) {
  return wallet.getWIFFromPrivateKey(privateKey);
}

export function isAddress(address) {
  return wallet.isAddress(address);
}

export function getAccount() {
  if (account) {
    // console.log(account)
    return account;
  } else {
    return initAccount(cookie.get("privateKey"));
  }
}

export async function getEncryptedKey(WIF, password) {
  const nep2Key = await wallet.encrypt(WIF, password);
  return nep2Key;
}

export function getTransfer(address) {
  const rpcClient = new rpc.RPCClient(netType);
  const query = Neon.create.query({
    method: "getnep5transfers",
    params: [address, 0]
  });
  return new Promise((resolve, reject) => {
    rpcClient
      .execute(query)
      .then(data => {
        resolve(data.result);
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });
  });
}

export function getTransactions(address, page, assetsHash = DBCHash) {
  return get_address_abstracts({
    address,
    page
  }).then(res => {
    return Promise.resolve(res);
  });
}

// send assets to address
export function transfer({
  toAddress = testAddress,
  amount,
  gas = 0
}) {
  return dbc_balance({
      user_wallet_address: account.address,
      language: "CN"
    })
    .then(res => {
      if (res.content > amount) {

        const apiCli = new api.neoCli.instance("https://neocli.dbchain.ai"); //or "http://seed5.ngd.network:20332" for TestNet );

        //const apiProvider = new api.neoscan.instance('https://api.neoscan.io/api/main_net')
        //  const apiProvider = new api.neoscan.instance('https://neocli.dbchain.ai')
        // console.log(apiProvider)
        const generator = nep5.abi.transfer(
          DBCHash,
          account.address,
          toAddress ? toAddress : testAddress,
          amount
        );
        // console.log(generator)
        const script = generator().str;
        // console.log(script)
        const config = {
          api: apiCli, // The API Provider that we rely on for balance and rpc information

          url: "https://neocli.dbchain.ai",

          account: account, // The sending Account
          // intents: undefined, // Additional intents to move assets
          script: script, // The Smart Contract invocation script
          gas // Additional GAS for invocation.
        };
        // console.log(res.balance)
        return Neon.doInvoke(config).then(res => {
          if (res.response && res.response.result) {
            return Promise.resolve({
              status: 1,
              ...res
            });
          } else {
            return Promise.resolve({
              status: -2
            });
          }
        });
      } else {
        return Promise.resolve({
          status: -1
        });
      }
    })
    .catch(err => {
      return Promise.resolve({
        status: -2
      });
    });
}

export function transfer12({
  toAddress = testAddress,
  amount

}) {
  return dbc_balance({
      user_wallet_address: account.address,
      language: "CN"
    })
    .then(res => {
      if (res.content > amount) {
        const param_sending_address = sc.ContractParam.byteArray(
          account.address,
          "address"
        );
        const param_receiving_address = sc.ContractParam.byteArray(
          toAddress,
          "address"
        );
        const param_amount = Neon.create.contractParam("Integer", amount * 1e8);
        // Build contract script
        const props = {
          scriptHash: DBCHash,
          operation: "transfer",
          args: [param_sending_address, param_receiving_address, param_amount]
        };
        const script = Neon.create.script(props);
        // Create transaction object
        let rawTransaction = new tx.InvocationTransaction({
          script: script,
          gas: 0
        });
        // Build input objects and output objects.
        rawTransaction.addAttribute(
          tx.TxAttrUsage.Script,
          u.reverseHex(wallet.getScriptHashFromAddress(account.address))
        );
        // Sign transaction with sender's private key
        const signature = wallet.sign(
          rawTransaction.serialize(false),
          account.privateKey
        );
        // Add witness
        rawTransaction.addWitness(
          tx.Witness.fromSignature(signature, account.publicKey)
        );
        // Send raw transactionconst
        // client = new rpc.RPCClient("https://neocli.dbchain.ai");
        //client = new rpc.RPCClient("http://117.51.149.193:10332");
        //  client = new rpc.RPCClient("http://117.51.149.193:10332");

        client.sendRawTransaction(rawTransaction).then(res => {
          if (res.response && res.response.result) {
            return Promise.resolve({
              status: 1
            });
          } else {
            return Promise.resolve({
              status: -2
            });
          }
        });
      } else {
        return Promise.resolve({
          status: -1
        });
      }
    })
    .catch(err => {
      return Promise.resolve({
        status: -2
      });
    });
}

export function transfer_other({
  toAddress = testAddress,
  amount,
  gas = 0
}) {
  return getBalance()
    .then(res => {
      if (res.balance > amount) {
        const apiProvider = new api.neoscan.instance(
          "https://api.neoscan.io/api/main_net"
        );
        // console.log(apiProvider)
        const generator = nep5.abi.transfer(
          DBCHash,
          account.address,
          toAddress ? toAddress : testAddress,
          amount
        );
        // console.log(generator)
        const script = generator().str;
        // console.log(script)
        const config = {
          api: apiProvider, // The API Provider that we rely on for balance and rpc information
          url: "https://seed2.cityofzion.io/",
          //  url: 'https://neocli.dbchain.ai',
          account: account, // The sending Account
          // intents: undefined, // Additional intents to move assets
          script: script, // The Smart Contract invocation script
          gas // Additional GAS for invocation.
        };
        // console.log(res.balance)
        return Neon.doInvoke(config);
      } else {
        this.$message({
          showClose: true,
          message: this.$t("dbc_lack_of_balance"),
          type: "error"
        });
        return Promise.reject({
          status: -1,
          msg: "DBC余额不足"
        });
      }
    })
    .then(res => {
      if (res.response && res.response.result) {
        console.log(res);
        return Promise.resolve({
          status: 1,
          msg: `you paied ${amount}DBC to ${toAddress}, txid is ${res.response.txid}`,
          ...res
        });
      } else {
        return Promise.reject({
          status: -2,
          msg: "dbc transfer fail~!"
        });
      }
    });
}
// initAccount()
