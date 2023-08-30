<img src="https://user-images.githubusercontent.com/75620849/230622162-c804d78e-91a5-47c0-a51e-e83cdeb9f2d7.png" width="512" />

* DEMO: https://bit.ly/metawallet-demo
* https://metawallett.netlify.app/

## Background
This research introduces an innovative solution to enhance the security and usability of digital asset wallets in the face of quantum computing threats. By combining post-quantum cryptography and zero-knowledge proofs, the proposed algorithm strengthens wallet security. It employs Lattice-based Threshold Secret Sharing, the Kyber Algorithm for key generation, and ZKP for unlocking wallets. Notably, this approach eliminates the need for complex seed-phrases, making it more user-friendly. The algorithm also offers features like server downtime wallet recovery and private key rekeying, further improving security and convenience. This comprehensive framework effectively safeguards digital assets, addressing the challenges posed by quantum computing.

Review our advanced-level theoretical research, which distinguishes itself from the codebase while maintaining a significant degree of functional similarity:
https://arxiv.org/abs/2308.07309

### Clone MetaWallet Repository 
```bash
git clone https://github.com/yathin017/MetaWallet.git
```
```bash
cd MetaWallet
```

### Run Backend
- Navigate to backend directory
```bash
cd backend
```
- Install required packages
```bash
npm install
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
npm install
```
- Run the frontend
```bash
npm start
```

### Want to understand our Algorithm?

<!-- img src="https://user-images.githubusercontent.com/75620849/230621844-0bcc63b4-fb65-4f16-87dc-dafd9c0b3144.png" width="725" /-->

#### Run the Algorithm?
- Navigate to algorithm directory
```bash
cd algorithm
```
- Install required packages
```bash
npm install
```
- Go through the code in `app.js` before running and make the changes for kyber512
- Run the algorithm
```bash
node app.js
```
