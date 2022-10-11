import * as React from 'react';

type SeparatorProps = {
  width: number | string;
  color: string;
  className?: string;
};

export default function Separator({ width, color, className }: SeparatorProps) {
  return (
    <div
      style={{
        width: width,
        border: `2px solid ${color}`,
      }}
      className={className}
    />
  );
}
