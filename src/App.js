import React, { useEffect, useState } from "react";
import Web3 from "web3";
import DNFT_ABI from "./DNFT.json";

const DNFT_Address = "0xfFABC3453d9A27b50727c3DdDA30937aA26dc86A";

function App() {
  const [account, setAccount] = useState("");
  let [tokenId, setTokenId] = useState("");
  let [tokenUri, setTokenUri] = useState("");
  let [newTokenUri, setNewTokenUri] = useState("");
  let [fetchedUri, setFetchedUri] = useState("");

  let web3 = new Web3(Web3.givenProvider);

  useEffect(() => {
    window.ethereum.on("chainChanged", handleChainChanged);
    window.ethereum.on("accountsChanged", handleAccountsChanged);
  }, []);

  function handleChainChanged(_chainId) {
    window.location.reload();
  }

  function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      console.log("Please connect to MetaMask.");
    } else if (accounts[0] !== account) {
      setAccount(accounts[0]);
    }
  }

  const connectWallet = async () => {
    try {
      //   let web3 = new Web3(Web3.givenProvider);
      if (typeof window.web3 != "undefined") {
        web3 = new Web3(window.ethereum);
      } else {
        return { status: false };
      }
      let account = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      return { status: true, account: account[0] };
    } catch (error) {
      console.log("error", error?.message);
      return { status: false };
    }
  };

  const onConnectWallet = async () => {
    if (window.ethereum) {
      let response = await connectWallet();
      if (response.status) {
        setAccount(response.account);
        alert("Successfully connected!");
      } else {
        alert("Something went wrong!");
      }
    } else {
      alert("Please install Metamask wallet extension to use this app.");
      setTimeout(() => {
        let popup = window.open("https://metamask.io/", "_blank");
        if (popup) {
          popup.focus();
        } else {
          alert(
            "You have disabled popups. Please enable the popups or follow this link: https://metamask.io/"
          );
        }
      }, 3000);
    }
  };

  async function handleMint() {
    const accounts = await web3.eth.getAccounts();
    const DNFT_instance = await new web3.eth.Contract(
      DNFT_ABI.abi,
      DNFT_Address
    );
    let result = await DNFT_instance.methods
      .safeMint(accounts[0], tokenUri)
      .send({ from: accounts[0] });

    console.log(result);
  }

  async function handleUpdate() {
    const accounts = await web3.eth.getAccounts();
    const DNFT_instance = await new web3.eth.Contract(
      DNFT_ABI.abi,
      DNFT_Address
    );
    let result = await DNFT_instance.methods
      .updateNFT(tokenId, newTokenUri)
      .send({ from: accounts[0] });

    console.log(result);
  }

  async function handleFetch() {
    const accounts = await web3.eth.getAccounts();
    const DNFT_instance = await new web3.eth.Contract(
      DNFT_ABI.abi,
      DNFT_Address
    );
    let result = await DNFT_instance.methods
      .tokenURI(tokenId)
      .call({ from: accounts[0] });

      setFetchedUri(result);
  }

  function handleTokenUriChange(e) {
    setTokenUri(e.target.value);
  }

  function handleTokenIdChange(e) {
    setTokenId(e.target.value);
  }

  function handleNewTokenUriChange(e) {
    setNewTokenUri(e.target.value);
  }

  return (
    <div className="App">
      <button onClick={onConnectWallet}>Connect wallet</button>
      <div id="mintItem">
        <h4>Create Item</h4>
        <input
          type="text"
          id="txtMintItemURI"
          required
          placeholder="Enter TokenURI"
          onChange={handleTokenUriChange}
          value={tokenUri}
        />

        <button id="btnCreateItem" onClick={handleMint}>
          Mint NFT
        </button>
      </div>
      <div id="updateItem">
        <h4>Update Item</h4>
        <input
          type="number"
          id="numTokenId"
          required
          placeholder="Enter TokenId"
          onChange={handleTokenIdChange}
          value={tokenId}
        />
        <input
          type="text"
          id="txtUpdateItemURI"
          required
          placeholder="Enter new TokenURI"
          onChange={handleNewTokenUriChange}
          value={newTokenUri}
        />
        <button id="btnUpdateItem" onClick={handleUpdate}>
          Update NFT
        </button>
      </div>
      <div id="fetchUri">
        <h4>Fetch URI</h4>
        <input
          type="number"
          id="numTokenIdFetch"
          required
          placeholder="Enter TokenId"
          onChange={handleTokenIdChange}
          value={tokenId}
        />
        <button id="btnFetchURI" onClick={handleFetch}>
          Fetch URI
        </button>

        <h4>TokenURI :- {fetchedUri}</h4>
      </div>
    </div>
  );
}

export default App;
