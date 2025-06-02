import { useState, useEffect } from 'react';

export default function useFetch(fetchFunction, param) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (param == null) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchFunction(param)
      .then(resultado => {
        setData(resultado);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro em useFetch:', err);
        setLoading(false);
      });
  }, [fetchFunction, param]);

  return { data, loading };
}
