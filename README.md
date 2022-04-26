# Utrust Challenge - Blockchain Integrations Developer

## How to run:

1. clone the repository;
2. make sure NodeJs is installed;
3. install all NodeJs dependencies ("npm install" on windows);
4. run the app by running the app.js script ("node app.js").

## Functionalities:

The app is able to issue a transaction on different blockchains by asking the user the desired network, the accounts' addresses of both the sender and the receiver, the sender's private key and the ammount (in ETH) to transact. Before the ammount is asked, the ETH-EUR conversion rate is shown. Once the task is completed it will log a message to the STDOUT containing both the transaction's confirmation and receipt.

Typescript Interfaces were used to model the structure of a raw transaction, and the object storing all the networks parameters.

To make the process of adding new blockchains easy, an object to store some chains' parameters was created, where the its name, id and rpc url can be obtained. To add some new chain that uses the EVM, all that's needed to integrate it in the app is to add it to the object, and the code will implement it automatically.

To issue a transaction a function ("broadcastTx()") was created that will get the transaction's nonce, create the raw transaction with the given data, sign it with the private key and send it. If some error occurs a message will be logged out. The gas limit and price are currently hardcoded (one point to improve).
