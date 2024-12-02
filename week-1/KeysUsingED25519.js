import * as ed from '@noble/ed25519';
//Generate Private Key
//Convert message to Uint8 Array
//Get Public Key from Private Key
// Msg ---------> Private Key ------------> Sign ------------->Public Key -----------> Verify
async function main() {
    const pvtKey = ed.utils.randomPrivateKey();
    const msg= new TextEncoder().encode("Hello World");
    const pubKey =await ed.getPublicKeyAsync(pvtKey);
    const signature =await ed.signAsync(msg,pvtKey);
    const isVerified = await ed.verifyAsync(signature,msg,pubKey);
    console.log(isVerified);
}

main();