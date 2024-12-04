'use client'
import { useState } from "react";
import Button from "./components/Button";
import { generateMnemonic } from "bip39";

export default function Home() {
  const [wallets, setWallets] = useState<string[]>([]);
  const [mneumonics, setmneumonics] = useState<string[]>([]);
  const [walletType, setWalletType] = useState<string>("");
  const [showMneumonics, setShowMnemonics] = useState<boolean>(true);
  const generateMnemonics = async () => {
    const mn = generateMnemonic();
    setmneumonics(mn.split(" "));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(mneumonics.join(" "))
      .then(() => {
        alert("Mnemonics copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };
  return (
    <div className="bg-slate-900 min-h-screen flex flex-col">
      <header></header>
      <div className="flex justify-center items-center flex-grow">
        {mneumonics.length === 0 ? (
          <div>
            {!walletType ? (
              <div>
                <div className="text-white text-xl flex justify-center">
                  SELECT WALLET TYPE
                </div>
                <div className="flex gap-4 mt-4">
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
              <div>
                <Button
                  text="Generate Mnemonics"
                  onClick={() => generateMnemonics()}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="bg-slate-800 rounded-xl p-4 text-white">
            <div className="flex items-center gap-2" >
              <div className="flex justify-center text-xl">
                Secret Mneumonics
              </div>
              <div className="flex justify-center">
                {
                  !showMneumonics ? <button className="bg-slate-700 h-max w-max text-white rounded-lg p-2" onClick={() => { setShowMnemonics(true) }}>Show</button> :
                    <button className="bg-slate-700 h-max w-max text-white rounded-lg p-2" onClick={() => { setShowMnemonics(false) }}>Hide</button>
                }
              </div>
            </div>
            {
              showMneumonics && <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 m-2" onClick={() => {
                copyToClipboard()
              }}>
                {mneumonics.map((value, index) => (
                  <div key={index} className="text-white bg-slate-500 rounded-lg p-2">
                    {value}
                  </div>
                ))}
                <div className="bg-zinc-900 w-max text-sm p-1 rounded">
                  Click Anywhere To Copy
                </div>
              </div>
            }
          </div>
        )}
      </div>
      <footer className="flex items-center justify-center m-2">
        <div className="text-xl text-white">
        Created by Raghav 🚀
        </div>
      </footer>
    </div>
  );
}
