const ethers = require('ethers');

async function transact(privateKey, recipientAddress, value) {
    const provider = new ethers.JsonRpcProvider("https://withered-fluent-sponge.ethereum-goerli.discover.quiknode.pro/aaf8094f3a84466654c62fc39be02128cc1dbddd/");
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

transact("", "0xE6707721ad79f4519f80D95ef4D961b60893CD76", 0.01);

