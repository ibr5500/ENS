import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { ethers, providers } from "ethers";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);

  const web3ModalRef = useRef();

  const [ens, setENS] = useState("");
  const [address, setAddress] = useState("");

  const setENSOrAddress = async (address, web3Provider) => {
    var _ens = await web3Provider.lookupAddress(address);

    if (_ens) {
      setENS(_ens);
    } else {
      setAddress(_ens);
    }
  };

  const getProviderOrSigner = async () => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 5) {
      window.alert("Change the Network to Goerli!");
      throw new Error("Change the Network to Goerli!");
    }

    const signer = web3Provider.getSigner();

    const address = await signer.getAddress();

    await setENSOrAddress(address, web3Provider);

    return signer;
  };

  const connectWallet = async () => {
    try {
      await getProviderOrSigner(true);
      setWalletConnected(true);
    } catch (error) {
      console.error(error);
    }
  };

  const renderButton = () => {
    if (walletConnected) {
      <div>Wallet Connected.</div>;
    } else {
      return (
        <button
          onClick={connectWallet}
          className={styles.button}
        >
          Connect your Wallet
        </button>
      );
    }
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);

  return (
    <div>
      <Head>
        <title>ENS dApp</title>
        <meta
          name="description"
          content="ENS-Dapp"
        />
        <link
          rel="icon"
          href="/favicon.ico"
        />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to LearnWeb3 Punks {ens ? ens : address}</h1>
          <div className={styles.description}>Its an NFT collection for LearnWb3 Punks.</div>
          {renderButton()}
          <div>
            <img
              className={styles.image}
              src="./learnweb3punks.png"
            />
          </div>
        </div>
      </div>
      <footer className={styles.footer}>Built using NextJS by LearnWeb3 Punks</footer>
    </div>
  );
}
