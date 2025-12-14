import { createAccountAssociationProof } from "@farcaster/frame-registration";
import { ethers } from "ethers";

export async function generateAssociationProof(address: string) {
  if (!window.ethereum) {
    throw new Error("No se detectó ninguna wallet en el navegador");
  }

  // Provider de Metamask / Base wallet extension / cualquier EVM
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  // Crear el mensaje estándar que pide Farcaster
  const message = await createAccountAssociationProof({
    fid: 1375612,            //  <<< TU FID REAL
    accountAddress: address, // Wallet conectada
  });

  // Firmar el mensaje
  const signature = await signer.signMessage(message);

  return {
    fid: 1375612,
    message,
    signature,
    address,
  };
}
