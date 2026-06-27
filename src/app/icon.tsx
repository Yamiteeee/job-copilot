// src/app/icon.tsx
import { ImageResponse } from 'next/og';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 14,
          background: 'rgba(6, 78, 59, 0.2)', // bg-emerald-950/20
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '4px',
          border: '1px solid rgba(6, 95, 70, 0.8)', // border-emerald-800/80
          color: '#34d399', // text-emerald-400
          fontWeight: 900,
          position: 'relative',
        }}
      >
        ⚡
        {/* Top Right Dot Indicator */}
        <div
          style={{
            position: 'absolute',
            top: 2,
            right: 2,
            width: 4,
            height: 4,
            borderRadius: '50%',
            background: '#10b981', // bg-emerald-500
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}