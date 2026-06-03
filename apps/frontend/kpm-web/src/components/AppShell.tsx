import type { ReactNode } from 'react';

type AppShellProps = {
  children: ReactNode;
  runtimeLoaded?: boolean;
};

export function AppShell({ children, runtimeLoaded = false }: AppShellProps) {
  return (
    <div className="kpm-app-shell" data-runtime-loaded={runtimeLoaded ? 'true' : 'false'}>
      {children}
    </div>
  );
}
