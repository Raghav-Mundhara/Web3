import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import React, { useEffect, useState } from 'react'

function Balance() {
    const wallet= useWallet();
    const {connection} = useConnection();
    const [balance,setBalance] = useState(0);
    const getBalance = async () => {
        const b=await connection.getBalance(wallet.publicKey);
        setBalance(b/1000000000); /// 1 SOL = 1000000000 lamports
    }
    useEffect(()=>{
        if(wallet.publicKey){
            getBalance();
        }
    })
  return (
    <div>
        <br/><br/>
        <h1>Balance: {balance} SOL</h1>
    </div>
  )
}

export default Balance