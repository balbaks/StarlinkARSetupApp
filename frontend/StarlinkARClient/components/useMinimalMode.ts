import { useState } from 'react';

export default function useMinimalMode() {
  const [minimal, setMinimal] = useState(false);
  const toggleMinimal = () => setMinimal(prev => !prev);
  return { minimal, toggleMinimal };
}
