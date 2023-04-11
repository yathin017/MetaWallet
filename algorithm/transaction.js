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

transact("", "0xB245B4DBEe83064CDd975D31Af9edA5f6a4508A4", "20");


async function balance(walletAddress) {
    const provider = new ethers.JsonRpcProvider("http://34.131.144.87/");
    const balance = await provider.getBalance(walletAddress);
    console.log(ethers.formatEther(balance, "ether"));
}

balance('0x0A801be61A959ce0635E152f808e235e52F3F605');