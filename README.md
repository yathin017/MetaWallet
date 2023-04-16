<img src="https://user-images.githubusercontent.com/75620849/230622162-c804d78e-91a5-47c0-a51e-e83cdeb9f2d7.png" width="512" />

### Fortifying Digital Asset Wallet Security with Post-Quantum Cryptography and Zero-Knowledge Proof

* Google Doc: https://docs.google.com/document/d/e/2PACX-1vToVt9nG5YBEtFAfH5-sehdPtp_07GkCRKLs-t66jnvP8AVeKJ2aFxP5HmHYuttQMNGe6iVzjwmpq48/pub
* Website: https://metawallett.netlify.app/
* Server: http://34.131.62.15/
* Blockchain: http://34.131.144.87/

Cryptographic techniques used in digital asset wallets may not be safe from potential attacks by quantum computers, leading to financial losses and reduced user trust. A more secure and robust approach is needed to address these vulnerabilities and ensure the safety of digital asset wallets. Our research aims to propose a new algorithm that uses post-quantum cryptography and zero-knowledge proof to enhance wallet security while also being user-friendly.

### Rationale behind Meta Wallet
To gain a comprehensive understanding of the unique features of Meta Wallet, it is imperative to analyze the strengths and drawbacks of the most widely used wallet recovery protocols. A thorough examination of these protocols will allow for a comparison of their capabilities and limitations with those offered by Meta Wallet. In the following discourse, we will present a formal overview of the various wallet recovery protocols.

#### Plain and Brain wallets
When it comes to wallet recovery protocols, there are two main types of wallets to consider: plain wallets and brain wallets.

Plain wallets, as the name suggests, refer to standard wallets that utilize full entropy private keys. These wallets typically use a random 256 bit string or a combination of 12 seed phrases to secure the wallet. While plain wallets offer a high level of resistance to brute force attacks, they can be extremely challenging to remember unless the user has a photographic memory or is willing to commit seemingly useless information to memory.

On the other hand, brain wallets generate private keys from a relatively short seed phrase, such as a password, that can be easily remembered and recalled. However, brute-forcing such wallets is relatively easy, making them a less secure option, even for hot wallets.

#### Multi-Sig protocols
In recent years, multi-sig wallets have become increasingly popular as a standard for security in the cryptocurrency space. Typically, these setups use a 2/3 signing scheme, meaning that there are three private keys, any two of which can be used to sign transactions.

Services use a multi-sig setup where one key is held by the user, another by the server, and a third 'backup' key is stored securely by the user. When a transaction needs to be sent, the user signs the transaction with their private key before requesting the service to complete the multi-sig process with their server key. The service has a scanning algorithm in place that checks a set of parameters to verify whether the transaction is legitimate, such as low value or transfer to known addresses, before signing the transaction and completing the multi-sig process. However, this means that the user relies on the service to verify whether a transaction is fraudulent, which presents certain limitations.

#### Threshold Multi-Sig protocols
To mitigate the risk of public brute force attacks on password-derived multi-sig protocols, threshold multi-sig protocols have emerged that use secret sharing schemes to enable private key recovery using a threshold number of secret shares.

### Clone MetaWallet Repository 
```bash
git clone https://github.com/yathin017/MetaWallet.git
```

### Run Backend
- Navigate to backend directory
```bash
cd backend
```
- Install required packages
```bash
npm i
```
- Run the backend in normal or developer mode
```bash
npm start
```
Or
```bash
npm dev
```

### Run frontend
- Navigate to frontend directory
```bash
cd frontend
```
- Install required packages
```bash
npm i
```
- Run the frontend
```bash
npm start
```

### Want to understand our Algorithm?

<img src="https://user-images.githubusercontent.com/75620849/230621844-0bcc63b4-fb65-4f16-87dc-dafd9c0b3144.png" width="725" />

#### Run the Algorithm?
- Navigate to algorithm directory
```bash
cd algorithm
```
- Install required packages
```bash
npm i
```
- Go through the code in `app.js` before running and make the changes for kyber512
- Run the algorithm
```bash
node app.js
```
