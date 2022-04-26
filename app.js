var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// Required libraries
var Web3 = require('web3');
var Tx = require('ethereumjs-tx').Transaction;
var promptSync = require('prompt-sync')();
var _a = require('get-eth-price'), getEthPriceNow = _a.getEthPriceNow, getEthPriceHistorical = _a.getEthPriceHistorical;
var networkParameters = {
    'ethereum': {
        chain: 'ethereum',
        chainId: 1,
        rpc_url: 'https://mainnet.infura.io/v3/007a8a93a36c4d5caa6191fa9bedf65b'
    },
    'ropsten': {
        chain: 'ropsten',
        chainId: 3,
        rpc_url: 'https://ropsten.infura.io/v3/007a8a93a36c4d5caa6191fa9bedf65b'
    },
    'rinkeby': {
        chain: 'rinkeby',
        chainId: 4,
        rpc_url: 'https://rinkeby.infura.io/v3/007a8a93a36c4d5caa6191fa9bedf65b'
    }
};
var networkName = promptSync("Network: [\"ethereum\", \"rinkeby\", \"ropsten\"]");
// Accessing the Ropsten testnet
var web3 = new Web3(networkParameters[networkName].rpc_url);
function getEthEurConversionRate() {
    return __awaiter(this, void 0, void 0, function () {
        var conversionData, currentDate, ethPriceInEur;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getEthPriceNow()];
                case 1:
                    conversionData = _a.sent();
                    currentDate = Object.keys(conversionData)[0];
                    conversionData = conversionData[Object.keys(conversionData)[0]];
                    ethPriceInEur = conversionData[Object.keys(conversionData)[0]].EUR;
                    console.log("1 ETH = " + ethPriceInEur + " EUR [" + currentDate + "]");
                    return [2 /*return*/];
            }
        });
    });
}
function getSignedTx(txData, privateKey) {
    var tx = new Tx(txData, { chain: networkName }); // create transaction object with correct data
    tx.sign(privateKey); // sign the transaction
    var serializedTransaction = tx.serialize(); // convert the transaction into a hex string
    return '0x' + serializedTransaction.toString('hex');
}
function showTxReceipt(txHash) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, web3.eth.getTransaction(txHash).then(console.log)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function broadcastTx(_from, _privateKey, _to, _value) {
    return __awaiter(this, void 0, void 0, function () {
        var privateKey, txCount, txData, signedTx;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    privateKey = Buffer.from(_privateKey, 'hex');
                    return [4 /*yield*/, web3.eth.getTransactionCount(_from)];
                case 1:
                    txCount = _a.sent();
                    txData = {
                        nonce: web3.utils.toHex(txCount),
                        from: _from,
                        to: _to,
                        value: web3.utils.toHex(web3.utils.toWei(_value, 'ether')),
                        gasLimit: web3.utils.toHex(21000),
                        gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei'))
                    };
                    signedTx = getSignedTx(txData, privateKey);
                    // Broadcast it
                    web3.eth.sendSignedTransaction(signedTx, function (err, txHash) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            if (!err) {
                                // let receipt = await web3.eth.getTransaction(txHash);
                                console.log('Transaction succeeded.');
                                // console.log(`Receipt:\n ${receipt.resolve(receipt)}`);
                                showTxReceipt(txHash);
                            }
                            else {
                                console.log(err);
                            }
                            return [2 /*return*/];
                        });
                    }); });
                    return [2 /*return*/];
            }
        });
    });
}
function runApp() {
    return __awaiter(this, void 0, void 0, function () {
        var fromAccount, privateKey, toAccount, ammount;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fromAccount = promptSync('From account:');
                    privateKey = promptSync('Private key:');
                    toAccount = promptSync('To account:');
                    console.log('\n');
                    return [4 /*yield*/, getEthEurConversionRate()];
                case 1:
                    _a.sent();
                    ammount = promptSync('Ammount (ETH):');
                    broadcastTx(fromAccount, privateKey, toAccount, ammount);
                    return [2 /*return*/];
            }
        });
    });
}
runApp();
