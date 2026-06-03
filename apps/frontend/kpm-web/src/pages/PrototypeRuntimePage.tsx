import { AppShell } from '../components/AppShell';
import { PrototypeFrame } from '../components/PrototypeFrame';
import { usePrototypeRuntime } from '../hooks/usePrototypeRuntime';

export function PrototypeRuntimePage() {
  const { loaded, runtimeUrl, handleLoad } = usePrototypeRuntime();

  return (
    <AppShell runtimeLoaded={loaded}>
      <PrototypeFrame src={runtimeUrl} onLoaded={handleLoad} />
    </AppShell>
  );
}
