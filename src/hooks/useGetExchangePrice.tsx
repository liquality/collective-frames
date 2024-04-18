import { useState, useEffect } from "react";

export function useGetExchangePrice(currencyId: string | undefined) {
  const [exchangeRateInEth, setExchangePriceInCurrency] = useState<
    number | null
  >(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let debounceTimer: NodeJS.Timeout;

    const fetchData = async () => {
      try {
        if (currencyId) {
          setLoading(true);

          const response = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${currencyId}&vs_currencies=eth`
          );
          const data = await response.json();
          console.log("OOOO");

          if (data[currencyId]) {
            setExchangePriceInCurrency(data[currencyId].eth);
          } else {
            setExchangePriceInCurrency(1);
          }
          setLoading(false);
        }
      } catch (error) {
        console.log(error, "Error fetching the currency with id" + currencyId);
      }
    };

    const debouncedFetchData = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(fetchData, 3000); // Adjust the debounce delay as needed (e.g., 500ms)
    };

    if (currencyId) {
      debouncedFetchData();
    }

    return () => clearTimeout(debounceTimer); // Cleanup function to clear the debounce timer
  }, [currencyId]);

  return {
    exchangeRateInEth,
    loading,
    setPriceInCurrency: setExchangePriceInCurrency,
  };
}

export default useGetExchangePrice;
