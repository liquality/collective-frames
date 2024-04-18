import { useState, useEffect } from "react";

export function useConvertEthToUsd(ethPrice: number | undefined) {
  const [usdtPrice, setUsdtPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (ethPrice) {
          setLoading(true);

          const response = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=eth`
          );
          const data = await response.json();

          console.log(
            "erc20 token EthPrice:",
            ethPrice,
            "Tether exchange in eth",
            data.tether.eth
          );
          if (data.tether) {
            let price = ethPrice / Number(data.tether.eth);

            console.log(price, "price???");
            setUsdtPrice(price);
          }
          setLoading(false);
        }
      } catch (error) {
        console.log(error, "Error fetching the currency with id" + ethPrice);
      }
    };
    fetchData();
  }, [usdtPrice, ethPrice]);

  return { usdtPrice, loading, setUsdtPrice };
}

export default useConvertEthToUsd;
