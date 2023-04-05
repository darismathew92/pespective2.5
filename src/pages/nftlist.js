import React from "react";
import { useDirectListingsCount, useContract } from "@thirdweb-dev/react";

const contractAddress = "0x79AA75999269CB10d24a8fD858ce62DeBaAB5B29";

const generateIframes = (listingsCount) => {
  const iframes = [];
  for (let i = 0; i < listingsCount; i++) {
    iframes.push(
      <iframe
        key={i}
        src={`https://ipfs.thirdwebcdn.com/ipfs/QmbAgC8YwY36n8H2kuvSWsRisxDZ15QZw3xGZyk9aDvcv7/marketplace-v3.html?contract=0x79AA75999269CB10d24a8fD858ce62DeBaAB5B29&chain=%7B%22name%22%3A%22Mumbai%22%2C%22chain%22%3A%22%22%2C%22rpc%22%3A%5B%22https%3A%2F%2Fmumbai.rpc.thirdweb.com%2F5a9bc94b87f7cbbbfbbc234bf1e07f0adf5f3cf3012c9f26f9fc9820d64df93a%22%5D%2C%22nativeCurrency%22%3A%7B%22symbol%22%3A%22MATIC%22%2C%22name%22%3A%22MATIC%22%2C%22decimals%22%3A18%7D%2C%22shortName%22%3A%22mumbai%22%2C%22chainId%22%3A80001%2C%22testnet%22%3Atrue%2C%22slug%22%3A%22mumbai%22%7D&directListingId=${i}`}
        width="600px"
        height="600px"
        style={{ maxWidth: "100%" }}
      />
    );
  }
  return iframes;
};


const NFTList = () => {
  const { contract } = useContract(contractAddress, "marketplace-v3");
  const {
    data: listingsCount,
    isLoading,
    error,
  } = useDirectListingsCount(contract);

  const iframes = listingsCount !== undefined ? generateIframes(listingsCount.toNumber()) : [];


  return (
    <div>
      {isLoading && <p>Loading listings count...</p>}
      {error && <p>Error: {error.message}</p>}
      {listingsCount !== undefined && (
        <div
        style={{
         display: "flex",
         flexWrap: "wrap",
         justifyContent: "center",
        }}
         >
        <h1 className="p-4">
          {listingsCount.toString()} NFTs for sale
        </h1>
      </div>  
      )}

      <div
         style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
         }}
          >
         {iframes.map((iframe, index) => (
          <div
            key={index}
            style={{
              width: "calc(50% - 10px)",
              padding: "5px",
            }}
          >
            {iframe}
          </div>
         ))}
      </div>
       
    </div>
  );
};

export default NFTList;
