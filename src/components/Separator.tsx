import * as React from 'react';

type SeparatorProps = {
  width?: number | string;
  color?: string;
  className?: string;
  height?: number;
};

export default function Separator({
  width,
  color = '#D6AD60',
  className,
  height,
}: SeparatorProps) {
  return (
    <div
      style={{
        width: width,
        border: `${height ? height : 1}px solid ${color}`,
      }}
      className={className}
    />
  );
}
