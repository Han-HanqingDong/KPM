import type { ComponentPropsWithoutRef } from 'react';

type PrototypeFrameProps = {
  src: string;
  onLoaded?: () => void;
} & Omit<ComponentPropsWithoutRef<'iframe'>, 'src' | 'onLoad'>;

export function PrototypeFrame({ src, onLoaded, className = 'kpm-prototype-runtime', title, ...props }: PrototypeFrameProps) {
  return (
    <iframe
      {...props}
      className={className}
      title={title ?? 'KPM Kozen Project Management'}
      src={src}
      onLoad={onLoaded}
    />
  );
}
