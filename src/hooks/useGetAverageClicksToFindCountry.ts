import { useState, useEffect } from "react";
import { POSTHOG_QUERY_API_KEY } from "../config";

export const useGetAverageClicksToFindCountry = (country?: string) => {
  const [averageClicks, setAverageClicks] = useState<number | undefined>();
  const [loading, setLoading] = useState(true);

  const url = "https://us.posthog.com/api/projects/47514/query/";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${POSTHOG_QUERY_API_KEY}`,
  };

  const payload = {
    query: {
      kind: "HogQLQuery",
      query: `select avg(JSONExtractFloat(properties, 'countedClicks')) as average_clicks from events where event == 'WIN' and JSONExtractString(properties, 'target') = '${country}'`,
    },
  };

  useEffect(() => {
    if (!!country && !!POSTHOG_QUERY_API_KEY) {
      setLoading(true);

      const fetchClickData = async () => {
        try {
          const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(payload),
          });
          const data = await response.json();
          setAverageClicks(data.results[0][0].toFixed(2));
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

      fetchClickData();
    }
  }, [country]);

  return { averageClicks, loading };
};
