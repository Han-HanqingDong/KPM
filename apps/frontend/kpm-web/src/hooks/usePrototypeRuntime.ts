import { useCallback, useMemo, useState } from 'react';
import { appConfig } from '../config/appConfig';

export function usePrototypeRuntime() {
  const [loaded, setLoaded] = useState(false);
  const runtimeUrl = useMemo(() => appConfig.prototypeRuntimePath, []);
  const handleLoad = useCallback(() => setLoaded(true), []);

  return { loaded, runtimeUrl, handleLoad };
}
