import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../state/context/GlobalContext";

import Header from "../Header";
import { ConnectWallet } from "@thirdweb-dev/react";
import {
  useCreateDirectListing,
  useContract,
  Web3Button,
} from "@thirdweb-dev/react";
import NFTList from "../../pages/NFTList";

const contractAddress = "0x79AA75999269CB10d24a8fD858ce62DeBaAB5B29";

const Marketplace = () => {
  const { user } = useContext(GlobalContext);
  const [tokenId, setTokenId] = useState();
  const [pricePerToken, setPricePerToken] = useState();
  const [assetContractAddress, setAssetContractAddress] = useState("");

  const { contract } = useContract(contractAddress, "marketplace-v3");
  const {
    mutateAsync: createDirectListing,
    isLoading,
    error,
  } = useCreateDirectListing(contract);

  if (!user) return <div>Please log in to view your profile.</div>;

  return (
    <>
      <Header />
      <div className="w-full h-full bg-[#FAFAFA]">
        <div className="grid w-full max-w-screen-lg grid-cols-1 gap-6 mx-auto mt-20">
          <div className="flex flex-col w-full space-y-5 border-t-2 ">
            {/* My Profile section */}
            <div className="w-full py-8 bg-gradient-to-r from-purple-500 to-indigo-500">
              <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                  <h2 className="text-3xl font-extrabold text-white">
                    Perspective NFT Marketplace
                  </h2>
                  <p className="mt-4 text-lg text-purple-100">
                    explore the art of the future
                  </p>
                  <ConnectWallet />
                </div>
                
              </div>
            </div>
            {/* Where every nft goes here */}
            <div className="space-y-4 p-10">
                  <div>
                    <label htmlFor="assetContractAddress" className="block text-sm font-medium text-gray-700">
                      Asset Contract Address:
                    </label>
                    <input
                      type="text"
                      id="assetContractAddress"
                      value={assetContractAddress}
                      onChange={(e) => setAssetContractAddress(e.target.value)}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="tokenId" className="block text-sm font-medium text-gray-700">
                      Token ID:
                    </label>
                    <input
                      type="text"
                      id="tokenId"
                      value={tokenId}
                      onChange={(e) => setTokenId(e.target.value)}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="pricePerToken" className="block text-sm font-medium text-gray-700">
                      Price Per Token:
                    </label>
                    <input
                      type="text"
                      id="pricePerToken"
                      value={pricePerToken}
                      onChange={(e) => setPricePerToken(e.target.value)}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    />
                  </div>
    
                  <Web3Button
                    contractAddress={contractAddress}
                    action={() =>
                      createDirectListing({
                        assetContractAddress: assetContractAddress,
                        tokenId: tokenId,
                        pricePerToken: pricePerToken,
                      })
                    }
                    className="w-full mt-4 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Create Direct Listing
                  </Web3Button>
                  {error && (
                    <div className="mt-2 text-sm text-red-500">
                      {error.message}
                    </div>
                  )}
                  {isLoading && (
                    <div className="mt-2 text-sm text-gray-500">
                      Creating direct listing...
                    </div>
                  )}
            </div>
           <NFTList/>
          </div>
        </div>
      </div>
    </>
);
};

export default Marketplace;    
