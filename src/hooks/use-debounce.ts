import { useEffect, useState } from "react";

export default function useDebounce<T>(value: T, delay: number) {
  const [debounce, setDebounce] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounce(value);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounce;
}
