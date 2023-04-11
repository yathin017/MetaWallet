const ethers = require('ethers');

async function transact(privateKey, recipientAddress, value) {
    const provider = new ethers.JsonRpcProvider("http://34.131.144.87/");
    const feeData = await provider.getFeeData();
    const wallet = new ethers.Wallet(privateKey);
    const signer = wallet.connect(provider);
    const tx = {
        from: wallet.address,
        to: recipientAddress,
        value: ethers.parseEther(value, "ether"),
        gasPrice: feeData.gasPrice,
        gasLimit: 100000,
        nonce: await provider.getTransactionCount(wallet.address, 'latest')
    };
    const transaction = await signer.sendTransaction(tx);
    console.log(transaction.hash)
}

transact("2ec5248f12ecf493915442d97ed0430217f6d8d0f28626da4fc55792c6568633", "0xB245B4DBEe83064CDd975D31Af9edA5f6a4508A4", "20");

