import { FrameWithZoraUrl } from "@/types";
import ApiService from "@/utils/api-service";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

export function useGetExchangePrice(currencyId: string | undefined) {
  const [exchangeRateInEth, setPriceInCurrency] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currencyId) {
          setLoading(true);

          const response = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${currencyId}&vs_currencies=eth`
          );
          const data = await response.json();

          const usdtToEthExchangeRate = data[currencyId].eth;
          setPriceInCurrency(usdtToEthExchangeRate);
          setLoading(false);
        }
      } catch (error) {
        console.log(error, "Error fetching the currency with id" + currencyId);
      }
    };
    fetchData();
  }, [exchangeRateInEth, currencyId]);

  return { exchangeRateInEth, loading, setPriceInCurrency };
}

export default useGetExchangePrice;
