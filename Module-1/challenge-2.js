// Import Solana web3 functinalities
const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    SystemProgram,
    sendAndConfirmTransaction
} = require("@solana/web3.js");


// Making a keypair and getting the private key
 const newPair = Keypair.generate();
 console.log("Below is what you will paste into your code:\n")
 console.log(newPair.secretKey);
 
const DEMO_FROM_SECRET_KEY = new Uint8Array(
    // paste your secret key inside this empty array
    // then uncomment transferSol() at the bottom
    [
        86, 151, 111,  87, 243, 212,  95,  94, 237, 116, 173,
        136, 223, 209,  90, 119, 168, 165,  44,  90, 247, 227,
        58, 249,  81, 196,  42, 252, 107, 118,  50, 211,  75,
        131, 123, 221,  80,  12, 242,  48, 176,  67,  76,  86,
        198,  75, 232, 135, 157, 216,   4, 239, 249,  27, 255,
        35,  21, 117, 162,  20, 239, 178, 234, 131
    ]            
);

const transferSol = async() => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    // Get Keypair from Secret Key
    const from = Keypair.fromSecretKey(DEMO_FROM_SECRET_KEY);

    const to = Keypair.generate();

    // Aidrop 2 SOL to Sender wallet

    console.log("Airdopping some SOL to Sender wallet!");
    const fromAirDropSignature = await connection.requestAirdrop(
        new PublicKey(from.publicKey),
        2 * LAMPORTS_PER_SOL
    );

    // Latest blockhash (unique identifer of the block) of the cluster
    let latestBlockHash = await connection.getLatestBlockhash();

    // Confirm transaction using the last valid block height (refers to its time)
    await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: fromAirDropSignature
    });

    console.log("Airdrop completed for the Sender account");

    // Fetching user wallet balance
    console.log("Getting the Wallet Balance")
    const fromWalletBalance = await connection.getBalance(from.publicKey);
    const fromBalanceSol = parseInt(fromWalletBalance)/LAMPORTS_PER_SOL;
    console.log('Wallet balance (sender):', fromBalanceSol);

    // Transfering Half of sender's balance 
    const HalfBalanceTRansfer = fromBalanceSol / 2;

    if (HalfBalanceTRansfer <= 0) {
        console.log('Kindly airdrop some Sol to complete the transaction');
        return;
    }

    // Send money from "from" wallet and into "to" wallet
    var transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: from.publicKey,
            toPubkey: to.publicKey,
            lamports: HalfBalanceTRansfer * LAMPORTS_PER_SOL
        })
    );

    // Sign transaction
    var signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [from]
        
    );
    console.log('Transaction Successful. Signature is', signature);
    
    // Getting recepient Wallet Balance
    const toWalletBalance = await connection.getBalance(to.publicKey);
    const toBalanceSol = parseInt(toWalletBalance)/LAMPORTS_PER_SOL;
    console.log('Wallet balance (recepient):', toBalanceSol);
}

transferSol();
