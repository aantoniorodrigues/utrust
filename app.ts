// Required libraries
const Web3 = require('web3');
const Tx = require('ethereumjs-tx').Transaction;
const promptSync = require('prompt-sync')();
const { getEthPriceNow, getEthPriceHistorical } = require('get-eth-price');

interface NetworkParameters {
    [chainName: string]: {
        chain: string,
        chainId: number,
        rpc_url: string
    }
}

interface TxData {
    nonce: string,
    from: string,
    to: string,
    value: string,
    gasLimit: string,
    gasPrice: string
}

const networkParameters: NetworkParameters = {
    'ethereum': 
    {
        chain: 'ethereum',
        chainId: 1,
        rpc_url: 'https://mainnet.infura.io/v3/007a8a93a36c4d5caa6191fa9bedf65b'
    },
    'ropsten':
    {
        chain: 'ropsten',
        chainId: 3,
        rpc_url: 'https://ropsten.infura.io/v3/007a8a93a36c4d5caa6191fa9bedf65b'
    },
    'rinkeby':
    {
        chain: 'rinkeby',
        chainId: 4,
        rpc_url: 'https://rinkeby.infura.io/v3/007a8a93a36c4d5caa6191fa9bedf65b'
    }
}

const networkName: string = promptSync(`Network: ["ethereum", "rinkeby", "ropsten"]`);
// Accessing the network
const web3 = new Web3(networkParameters[networkName].rpc_url);

async function getEthEurConversionRate(): Promise<void> {
    let conversionData = await getEthPriceNow();
    const currentDate: string = Object.keys(conversionData)[0];
    conversionData = conversionData[Object.keys(conversionData)[0]];
    const ethPriceInEur: number = conversionData[Object.keys(conversionData)[0]].EUR;
    console.log(`1 ETH = ${ethPriceInEur} EUR [${currentDate}]`);
}

function getSignedTx(txData: TxData, privateKey: Buffer): string {
    const tx = new Tx(txData, { chain: networkName });    // create transaction object with correct data
    tx.sign(privateKey);        // sign the transaction
    const serializedTransaction = tx.serialize();      // convert the transaction into a hex string
    return '0x' + serializedTransaction.toString('hex');
}

async function showTxReceipt(txHash: string): Promise<void> {
    await web3.eth.getTransaction(txHash).then(console.log);
}

async function broadcastTx(_from: string, _privateKey: string, _to: string, _value: string): Promise<void> {

    const privateKey: Buffer = Buffer.from(_privateKey, 'hex');
    const txCount = await web3.eth.getTransactionCount(_from);
    
    // Build the transaction (all values in hexadecimal)
    const txData: TxData = {
        nonce: web3.utils.toHex(txCount),    // account's transaction count
        from: _from,
        to: _to,
        value: web3.utils.toHex(web3.utils.toWei(_value, 'ether')),
        gasLimit: web3.utils.toHex(21000),
        gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei'))
    };
    
    // Sign it
    const signedTx: string = getSignedTx(txData, privateKey);
    
    // Broadcast it
    web3.eth.sendSignedTransaction(signedTx, async (err: any, txHash: string) => {
        if (!err) {
            // let receipt = await web3.eth.getTransaction(txHash);
            console.log('Transaction succeeded.');
            // console.log(`Receipt:\n ${receipt.resolve(receipt)}`);
            showTxReceipt(txHash);
        } else {
            console.log(err);
        }
    });
}

async function runApp(): Promise<void> {
    const fromAccount: string = promptSync('From account:');
    const privateKey: string = promptSync('Private key:');
    const toAccount: string = promptSync('To account:');
    console.log('\n')
    await getEthEurConversionRate();
    const ammount: string = promptSync('Ammount (ETH):');
    broadcastTx(fromAccount, privateKey, toAccount, ammount);
}

runApp();
