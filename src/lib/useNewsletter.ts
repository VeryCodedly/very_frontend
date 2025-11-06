// lib/useNewsletter.ts
import { useEffect, useState } from 'react';

const KEY = 'vc-newsletter-subscribed';

export function useNewsletter() {
  const [subscribed, setSubscribed] = useState<boolean | null>(null);

  // read once on mount
  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    setSubscribed(raw === 'true');
  }, []);

  const markSubscribed = () => {
    localStorage.setItem(KEY, 'true');
    setSubscribed(true);
  };

  const reset = () => {
    localStorage.removeItem(KEY);
    setSubscribed(false);
  };

  return { subscribed, markSubscribed, reset };
}