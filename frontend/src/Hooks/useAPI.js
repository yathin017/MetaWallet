import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router";
import bcrypt from "bcryptjs-react";
import sha256 from 'crypto-js/sha256';
import sha512 from 'crypto-js/sha512';
import { nanoid } from "nanoid";
import BigInteger from "bigi";
import ecurve from "ecurve";
import { Buffer } from "buffer";
import secrets from "../Utils/secrets";
import { ethers } from "ethers";
// Import 'Kyber'
import {KeyGen512} from "../Utils/kyber";
import { setSignin, setSigninSuccess, setSocialRecoverySuccess, setTokenSuccess } from "../data/users/action";

window.Buffer = window.Buffer || Buffer;

// Import Big Integer
// import { BigInteger } from "big-integer";


// import {
//   setSignin,
//   setSigninSuccess,
//   setSigninError,
//   setHandleUserTokens,
//   setRefreshToken,
//   setRefreshTokenSuccess,
//   setRefreshTokenError,
//   setLogout,
//   setLogoutSuccess,
//   setLogoutError,
// } from "../Redux/auth/actions";

// import notify from "../Utils/notifyToast";
const ecparams = ecurve.getCurveByName("secp256k1");
function useAPI() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const LOCAL_HOST_API = "http://localhost:3001";
  const hash = (message) => {
    const rounds = 12;
    const salt = `$2b$${rounds}$`.concat(sha512(message));
    const hashBcrypt = bcrypt.hashSync(message, salt);
    const hashSha256 = sha256(hashBcrypt).toString();
    return hashSha256;
  }
  function ecInverse(Cr) {
    const key = BigInteger(String(Cr));
    // console.log(key);
    // console.log(ecparams) 
    const keyInv = key.modInverse(ecparams.n);
    return keyInv.toString();
  }
  function ecModExponent(sp, exp) {
    const startPoint = BigInteger(String(sp));
    const exponent = BigInteger(String(exp));
    const ecPoint = ecparams.pointFromX(true, startPoint);
    const resultPoint = ecPoint.multiply(exponent);
    return String(resultPoint.affineX);
  }

  function hashToEllipticCurvePoint(hv) {
    const hashValue = BigInteger(String(hv));
    const bufferHashValue = Buffer.from(hash(String(hv)), "hex");
    const ecPoint = ecparams.pointFromX(true, hashValue);
    while (ecparams.isOnCurve(ecPoint) == false) {
      bufferHashValue = Buffer.from(hash(Buffer.toString()), "hex");
      ecPoint = ecparams.pointFromX(true, BigInteger.fromBuffer(bufferHashValue));
    }
    return String(ecPoint.affineX);
  }

  function hexTOdec(hex) {
    return String(parseInt(hex, 16).toString(10));
  }
  function ecModExponent(sp, exp) {
    const startPoint = BigInteger(String(sp));
    const exponent = BigInteger(String(exp));
    const ecPoint = ecparams.pointFromX(true, startPoint);
    const resultPoint = ecPoint.multiply(exponent);
    return String(resultPoint.affineX);
  }


  function secretToUint8Array(secret) {
    const secretUint8Array = new Uint8Array(Math.ceil(secret.length / 2));
    for (let i = 0; i < secret.length; i++) {
      secretUint8Array[i] = parseInt(secret.substr(i * 2, 2), 16);
    }
    return secretUint8Array;
  }

  function uint8ArrayToHex(uint8Array) {
    const hex = Buffer.from(uint8Array).toString("hex");
    return hex;
  }

  function kyberKeyGeneration(secretUint8Array) {
    const pk_sk = KeyGen512(secretUint8Array);
    return [uint8ArrayToHex(pk_sk[0]), uint8ArrayToHex(pk_sk[1])];
  }


  const handleCreateAccount = async (email, password1) => {
    dispatch(setSignin());
    const hashEmail = hash(email)
    console.log(hashEmail)
    const Cr = nanoid(64);
    let Cr_1 = ((Cr.replace(/[^a-zA-Z0-9]/g, '')).toLowerCase()).slice(0, 32);
    console.log(Cr_1)
    const CrInv = ecInverse(Cr_1);
    console.log(CrInv)
    const alpha = ecModExponent(
      hashToEllipticCurvePoint(hexTOdec(email.concat(password1))),
      Cr
    );
    console.log(alpha);

    const response = await fetch(`${LOCAL_HOST_API}/users/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: hashEmail,
        alpha: alpha
      })
    })
    const data = await response.json()
    console.log(data?.beta)
    const gamma = ecModExponent(data?.beta?.beta, CrInv);
    const hashPwd1 = hash(password1);
    dispatch(setSigninSuccess(gamma, hashPwd1, data?.authenticatorSecret?.authSecretBase32));
    window.alert("Account created successfully", "success", data?.authenticatorSecret?.authSecretBase32)

    // const mainshare = secrets.newShare("4", shares);
    // console.log("NEW SHARE: " + mainshare);

    // const secret = secrets.combine(shares);
    // console.log("SECRET: " + secret);

    // const keyPair = kyberKeyGeneration(secretToUint8Array(secret));
    // // console.log("PUBLIC KEY: " + keyPair[0]);
    // // console.log("PRIVATE KEY: " + keyPair[1]);

    // const wallet = new ethers.Wallet(hash(keyPair[1]));
    // console.log("ADDRESS: ", wallet.address);
    // if (data) {
    //   navigate("/dashboard")
    // }
  }

  const handleSocialRecovery = async (gamma, hashpassword, emailData) => {
    // dispatch(setSocialRecoverySuccess());
    // const shares = [


    // ];
    const shares = [
      // String("801").concat(String(hashpassword)),
      // String("802").concat(String(gamma)),
      '803b16500cc9803adbe1998453b99d885e07a3c34d0f48b225cb138a94a11e73f4dd6f74618710efa17728d63b200055275b32ff5b6ab81d6fe867a83f9c582d6fb65f5d6597e0a57d407ded56f7cb9a6e232a3a0e9e26d2d1e4c839f6f5e8744d37cf38af0038c2fed99bc10a1838256072d06ff20de024ec37012e442a40afaf21a764002f7bc9941781828780db7f3029c67779471c41e870c30d0d4d2c3bff049f8fd3e934560ab24ce842cb83dfd2b1f3c46cba57a9b67f871d1293aa6307c0f3ac63b8b1889958ddbd91010577ce6f97a213bee813c20683085c1e900e7dc2bdd13891c2b97f5032e14118c05bbd439452c8c2d84110dcc20c0ebced7eb0f8e86aa657e85002f1b8efa824b03565535bac620a81730d82b1c9804c2b0ed73346ecbb124386fe2c7074085ceee0bb4c25af1ba54a3751068221aff97f06d86dd6f6b5453dc76dae9fc1646dd2b2c2fad3b66c9f282a805c38fb77259982012208a91deeba6f18fa0a5886ac2d7ec332294cf0835b93b6d972c1b3b97d5f0bd8366058a47d3ce58193a040296898408c870886e2cb7824c2be5a91eb81f67a2d22ac0a7467544bb70fbd5d032d34ef421663c628f305b29e1309848e3af561042392f241c643a7822b266595a9dfe89a74d623a2088e693240482daeb1400f1dc6fe8deb5e1cfc9c65eb3293ba0d0542bd4877a3d8da346916fbfa95980d94018dce06eca325671a073d8867f757e5ee8f784649bef7f2d25664417af44702fadd53168dc2dc6cd3d79a79f323f511c93ee88e5ef80827d1b420c95466b12e62c9be962af7e90ba11212750f111f638fcd10d2537b6623f0953fb986884d4b77e3b26c7844c750dcdbd6eefd87367d228e066b162912c250dd0e2f6d4fade1543feb1eed711d82a5b60f6b4b9f0c9d8019ac925ea79f763e9fc42d5044b9e64b6e9ed2ec44695ce30ef9750119ef6408887b0451fc10f207be22109e0d604373bb1fb8ce51b89b6a38450128e5c0e22c555ff823b26b39921a4d7886d2022b7ae359f13b9e65bb3363e84326d8702b0de24f33a6cda403ceed74d9797a2cfa53d2080b3ce80be7aa3a4ba1fecc52a2d652b805eaf40475a492b06ffb5c876f285bbe8a1813517d4c90e3c7ad775001d0fe0fd8fc00b0cadcb722c3015b9c158b2e5353a1a39260ae59122f9d96cbc9207e5d116c470ca931e7a68357d46eda345d10df22f627f066ce509e8add76661641121551c0837df4800227d320143f0dd71c5c82bbc703b517e094f3151134c1927b378bcabd9e6eed61332e9e3feba1ccbd302402750afbffe75470b133417028d85fff629bd9aa468977bdf1204a70d1ef982ba093bde4c8f42b5996f3f8ac37d65d86077fc0b10325e5357ded96ccfa2b9094be57bac8329a4b11cc8920018bcbb445cea15e0d980f7af595c13c447c2aca6de52add28a0c144b29b3f48b3edd5182cd03da01405a269c1916b33bd0486696eb3e499134be30812d9bd23a25cd956d0551e6c674c829840248a1ec788b53e90ae4719e75d4ddf51fb077e342135cff082da2023b460fe8d64db19537353ca9737bc33cd469e42b70efb06edacd327c9c97ab0f8f031cd010b27720cc9a06f6ecd0db4df8d8a4073775d9a249d9921bdce7c550a922ee63dbb121a0052dbb05aa559f75eb8ada23808ec80c899c8b117ac07df9e9125822e7938c498e70ffb797bf5e11718e32fc990cb95a216fe0a513200e94a71fcad176d933299712275fa8da24cdf08215fddbf837ed8797e5f58a478658eb55fa6f7ee05a75b9f619520490f50f0cbd42371d27930b0fc808f0fc140fa376ea272575e6ec6c5ac886205439d710210bec89ba8af6ce3d841876202d70885b86e80b9f5b05f096064eac70c616821ea755ee1e534c663e29e89e2929e3747ee2b31800fffc52334622daaa934605c615c69722cba03b874c30aa58f31249e1be0cb76f50024c758a37d3850e052e7d8c8d41a6b9f335bd5407c9069a52e2d9ecc1e4a1f6fb9586e9c47244d518571bbbcef106d27f75496aeab1d86ddc0ce38c763b0f325ac080b2bab56c6ff05b4c60a91025963c8468fcd5f64cc7027a16d5ec3e9f6252676ba5d30cc6f67ce8dc73d96e69a928a8b9b2f8a51e4f3e5b953f826600ca659f96f7a1236b43fcbf62c003d620b0d715d4234fd2f8043303086e3ce122a59c6b834377264460141f7d141169e0d0fc7f9c686fe3b5428f18d51c5c3e97e1814fb63ee38e58457910e65378b58ccbd84b0fe67b5efbf85ebcd78ea5435917a3f9',
      '804a97600e361899f3eb06126e5edc1dbadc96672d58fc05596a96c95b1a42eef32da06af3c541b94abddcf792000868d5eacc7032a90d1da9e52c9d41d7b58da187603da10c3110bdf83ce5367c6bd02a87d840d35a862c233bed4e26793deaa5cc60c4c858943c73fed3b2881d4588783c20f1250ce05bb74d82da7a50711948039d7a005063bed2ccc3c44cc92a60c056b735b7f54f733de1e78d5dfd074b28538911763fc26f0905ae6574e31ea17cdbf66af608bc9e873915459c8690278c69769f2e5c03cc5f3cf484d28280bc6a21dc9dce5b6d16650e478db7135002ecbcd47a1c536cdf603894b22a44386b8dfe0264e43c257a492e350fd30e656309746521c76c3db00c7b54694583d89870efe34f25019ab78c1cd36610af8253f5172eb60a95a6c67a87e83a0dbe6b69d2ff899093482845e28e4553912f685625247676d8201cbd7c4359b27af47cd4ec79fe5ff658058198674caa6dd1061502d504cf9ce300209ca0d8b49e1f856b3f1557f6a14febde562f64eb5e5f65385b7d4ff864c235ce69cb0690a057ac55714e9d849eb4ea658becd2b953331bf7308d041fd8eaf5eaab8d81853d57d5cbb8fdcff66f5ca7815c8217861b4249a8728a5e0c75a36fa69cc5520ff1099e79ec58e32f5695049a2fc5a0a58c430220009cb67b9cea3216a65f293acc8e50dd582cddfdec9eacf84aff967b295105d4da03ccbadebec7d87540d51c1524f5ec393b90657fae83a4fc2d6ffaaab9aaad8c79f53f4e4cbc2f26fea408ee27def0436fcb6492b3a5d584ab5a51ef3af6d2da24ee835f59ac37534a4dcd38809a48a6c9b5992d6fb2af5ef98011861e457dfa6c3e55f7e57be5e926fb7eb3ac15173d044adffa9f5f94ed692d5a88adf94ceae299ea9b656a4c14115f08a2fbd8565c18c6465d6bc400679359ba5530a3d6efa2a353f4bf7aff3e6783af688a46e8aa049de2526bf71975045a8dc98adda0afbe5a918432bb5c52a8457882d46961b557b0e1258e55faceddc075649625055a616fee2a1bda215ac7763577d62de0525ce5a0c69eec4a066b65632f6f6086a8bea505dace65d3ec9840734bfb37b41c276cd5d939aa0239938cd0f12a3e9d780dbb8b981d1feabdf651b66c9565e00ba97ad17cafd9d1e9f60dd4e78aebd719c202bfe6939e05f112bf9551d4dee3b70832b5927f7d8ecfc33c9e4fe4aaf3f8426599280c7f54f0fee2b98b99f56ff7cfaa4dc0e3614fb42b400554a7d8c298547547be9cd3bd8e504c39837f404a1beb0d3accc3b904da2b6daa17d35249e3436605c05a0d3889ab29e5e239da172ab05cfdb128ac8b76407e4f645422d0a8e92331d583498e5cebecaa5a3ed67ef4c744a76c1f05b9b9d287d93010bce4dee6a08bd983d2b4513d4c807a936e970003c3bb8aa96bcaead4d5d069a1096a1f723f81302ce8d9fd04c1e223dc8ac8fc0634704586f89c48ca0995f6bb027ace5d5b4ff7a306338f9723e78d1c2e8d069d66ff3628604a2f2d2e9c85705b481b3ccc0013511a7546e5edf4703bf255b24a5a1961214c20805e5af97b9da32a9f3fbfe669551457466df68a7cdd83a25ebc46f7dc66bf69097ca8936d528205b50e3640f8ab3d5483291c10783fb5e4d08384d70b5cb2e7b889555b67948a9dc0d86c2b8861c0ee25e304cc4d95d46e91ec56bc0a4c9fd4a1d352d9c552efc433846d812a6f6b293a454467d9bed1ebd99dc67ad8ba1501b7f8ebfec59d74df1c8f62dd31f19c45a6f8558ae174891fb3fdef62b034c23529c300e9467c3ad995ebd8ab08d0a7503971eb7a5fbbad3fc9d97e914859b229784d7bcd3d65ea2b3ee99e9525082e05628dc9db3c5344c8ae6ea573cd750c2d8491552b99de21586857a0fbb13d8f22758338e0eb63301beff63c8b96ec8c824d2c3a8ac3c00129b8df1af55c41cfcaf86f2aef2f655600de5debe781c9c0c2d38213e1ea6678805be5e4cfb5cdb1b864b4a43cf2c02bd0cfeb78283650f648da84db371a7818a18f35235f7ddaa533c0bb5b8e6090fd04f5e38e1bca9c162cb1e2443d7e5977d99fd5d2034a3ee678515bef09528d67a6657e49b538abe7e05c92753b363e2f58d736d8b5c1ef28ac6b9cb514deb68954419bd20918b33376315f3ef58ff00ec76e27a0681d96d299bb2f5fd89da502556aedfd937d0910af18914eb6621558b6b6dd4295b5faaf022bf4a22a468add59b4f6be46724a3a5ca3c53369663f621d13793847003cd830b606ef70d990f80eaa7226e07d9202ad9afc803f997cb72ed2c'
    ];
    console.log(shares);
    const share1 = secrets.newShare("3", shares);
    console.log("SHARE 1: " + share1);

    const share2 = secrets.newShare("4", shares);
    console.log("SHARE 2: " + share2);

    const share3 = secrets.newShare("5", shares);
    console.log("SHARE 3: " + share3);

    const share4 = secrets.newShare("6", shares);
    console.log("SHARE 4: " + share4);

    const secret = secrets.combine(shares);
    console.log("SECRET: " + secret);

    const wallet = new ethers.Wallet(hash(secret));
    console.log("PRIVATE KEY: ", wallet.privateKey);
    console.log("ADDRESS: ", wallet.address);

    const keyPair = kyberKeyGeneration(secretToUint8Array(secret));
    console.log("KEY PAIR: ", keyPair);


    // const response = await fetch(`${LOCAL_HOST_API}/users/verify`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     otp: otp
    //   })
    // })
    // const data = await response.json()
    // console.log("OTP Response", data);
    // if (data) {
    //   dispatch(setTokenSuccess());
    // }

  }

  const handleIntialization = async (email, password1) => {

  }



  const handleLogin = async (email, password1, password2) => {
    // dispatch(setSignin());
    console.log(email, password1, password2)
    const response = await fetch("https://api.quotable.io/random", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password1: password1,
        password2: password2
      })
    })
    const data = await response.json()
    if (data) {
      navigate("/dashboard")
    }
  }

  // const handleRefreshToken = useCallback(() => {
  //   dispatch(setRefreshToken());
  //   refreshToken()
  //     .then((response) => {
  //       dispatch(setRefreshTokenSuccess(response.data.message));
  //       dispatch(setHandleUserTokens(response.data.accessToken));
  //     })
  //     .catch((error) => {
  //       dispatch(
  //         setRefreshTokenError(
  //           error?.response?.data?.errors?.[0]
  //             ? error?.response?.data?.errors?.[0]
  //             : "Some server error occured, please try again later!"
  //         )
  //       );
  //       navigate("/");
  //     });
  // }, [dispatch, navigate, location]);

  // const handleUserLogout = useCallback(() => {
  //   dispatch(setLogout());
  //   logout()
  //     .then((response) => {
  //       dispatch(setLogoutSuccess(response.data.message));
  //       dispatch(setHandleUserTokens(null));
  //       notify("Logout successfull", "success");
  //       navigate(0);
  //     })
  //     .catch((error) => {
  //       dispatch(
  //         setLogoutError(
  //           error?.response?.data?.errors?.[0]
  //             ? error?.response?.data?.errors?.[0]
  //             : "Some server error occured, please try again later!"
  //         )
  //       );
  //       notify(
  //         error?.response?.data?.errors?.[0]?.message
  //           ? error?.response?.data?.errors?.[0]?.message
  //           : "Some server error occured, please try again later!",
  //         "error"
  //       );
  //     });
  // }, [dispatch, navigate]);

  return {
    handleCreateAccount,
    handleLogin,
    handleSocialRecovery,
    handleIntialization
  };
}

export default useAPI;