'use client';
import { useState, useEffect } from "react";
import Button from "./components/Button";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import { derivePath } from "ed25519-hd-key";

export default function Home() {
  const [wallets, setWallets] = useState<
    { publicKey: string; secretKey: string; hidden: boolean }[]
  >([]);
  const [mneumonics, setmneumonics] = useState<string[]>([]);
  const [walletType, setWalletType] = useState<string>("");
  const [showMneumonics, setShowMnemonics] = useState<boolean>(true);
  const [seed, setSeed] = useState<Buffer>();
  const [count, setCount] = useState<number>(0);

  const loadOrGenerateMnemonic = async () => {
    const storedMnemonic =
      walletType === "Solana"
        ? localStorage.getItem("solanaMnemonic")
        : localStorage.getItem("ethMnemonic");

    if (storedMnemonic) {
      setmneumonics(storedMnemonic.split(" "));
      setSeed(mnemonicToSeedSync(storedMnemonic));
    } else {
      // generateMnemonics();
    }
  };

  const generateMnemonics = async () => {
    const mn = generateMnemonic();
    setmneumonics(mn.split(" "));
    setSeed(mnemonicToSeedSync(mn));
    localStorage.setItem(walletType === "Solana" ? "solanaMnemonic" : "ethMnemonic", mn);
  };

  const createWallet = () => {
    const path =
      walletType === "Solana" ? `m/44'/501'/${count}'/0'` : `m/44'/60'/${count}'/0'`;
    let derivedSeed;
    if (seed) derivedSeed = derivePath(path, seed.toString("hex")).key;
    let secret;
    if (derivedSeed) secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    let keypair;
    if (secret) keypair = Keypair.fromSecretKey(secret);
    if (keypair) {
      const newWallet = {
        publicKey: keypair.publicKey.toString(),
        secretKey: Buffer.from(keypair.secretKey).toString("hex"),
        hidden: true,
      };
      setCount(count + 1);
      setWallets([...wallets, newWallet]);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(mneumonics.join(" "))
      .then(() => {
        return;
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  useEffect(() => {
    if (walletType) {
      loadOrGenerateMnemonic();
    }
  }, [walletType]);

  return (
    <div className="bg-slate-900 min-h-screen flex flex-col">
      <header></header>
      <div className="flex flex-col items-center justify-center flex-grow p-4">
        {mneumonics.length === 0 ? (
          <div className="w-full max-w-md">
            {!walletType ? (
              <div>
                <div className="text-white text-xl text-center">
                  SELECT WALLET TYPE
                </div>
                <div className="flex gap-4 mt-4 justify-center">
                  <Button
                    text="Solana Wallet"
                    onClick={() => setWalletType("Solana")}
                  />
                  <Button
                    text="Ethereum Wallet"
                    onClick={() => setWalletType("Ethereum")}
                  />
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <Button
                  text="Generate Mnemonics"
                  onClick={() => generateMnemonics()}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row items-center gap-6 w-full">
            <div className="bg-slate-800 rounded-xl p-4 text-white w-full lg:w-2/3 overflow-auto">
              <div className="flex items-center justify-between">
                <div className="text-xl">Secret Mneumonics</div>
                {!showMneumonics ? (
                  <Button
                    text="Show"
                    onClick={() => setShowMnemonics(true)}
                    textColor="text-white"
                    color="bg-slate-700"
                  />
                ) : (
                  <Button
                    text="Hide"
                    onClick={() => setShowMnemonics(false)}
                    textColor="text-white"
                    color="bg-slate-700"
                  />
                )}
              </div>
              {showMneumonics && (
                <div
                  className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-4"
                  onClick={() => copyToClipboard()}
                >
                  {mneumonics.map((value, index) => (
                    <div
                      key={index}
                      className="text-white bg-slate-500 rounded-lg p-2"
                    >
                      {value}
                    </div>
                  ))}
                  <div className="bg-zinc-900 w-max text-sm p-1 rounded">
                    Click Anywhere To Copy
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-4">
              <Button
                text="Create New Wallet"
                onClick={() => createWallet()}
                color="bg-green-500"
                textColor="text-black"
              />
              {wallets.length > 0 && (
                <Button
                  text="Delete All Wallet"
                  onClick={() => {
                    setWallets([]);
                    setCount(0);
                  }}
                  color="bg-red-500"
                />
              )}
            </div>
            <div className="w-full overflow-auto">
              {wallets.map((wallet, index) => (
                <div
                  key={index}
                  className="text-white bg-gray-700 p-4 rounded-lg mb-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-lg">Wallet {index + 1}</div>
                    <Button
                      text="Delete"
                      onClick={() => {
                        const updatedWallets = wallets.filter(
                          (_, i) => i !== index
                        );
                        setWallets(updatedWallets);
                      }}
                      textColor="text-white"
                      color="bg-red-500"
                    />
                  </div>
                  <p>Public Key: {wallet.publicKey}</p>
                  <p className="break-words whitespace-pre-wrap">
                    Secret Key:{" "}
                    <span
                      className={`${wallet.hidden ? "" : "bg-gray-600 text-xs rounded p-1"
                        } inline-block w-full overflow-hidden`}
                    >
                      {wallet.hidden ? "******" : wallet.secretKey}
                    </span>
                  </p>
                  {wallet.hidden ? (
                    <Button
                      text="Show"
                      onClick={() => {
                        const updatedWallets = wallets.map((w, i) =>
                          i === index ? { ...w, hidden: false } : w
                        );
                        setWallets(updatedWallets);
                      }}
                    />
                  ) : (
                    <Button
                      text="Hide"
                      onClick={() => {
                        const updatedWallets = wallets.map((w, i) =>
                          i === index ? { ...w, hidden: true } : w
                        );
                        setWallets(updatedWallets);
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <footer className="flex items-center justify-center m-4">
        <div className="text-xl text-white">Created by Raghav 🚀</div>
      </footer>
    </div>
  );
}
