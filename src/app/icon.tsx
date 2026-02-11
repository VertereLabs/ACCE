import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #111827 100%)",
        }}
      >
        <svg width="260" height="260" viewBox="0 0 200 200" fill="none" aria-hidden="true">
          <rect x="28" y="38" width="64" height="124" rx="8" stroke="#f59e0b" strokeWidth="10" />
          <rect x="108" y="38" width="64" height="124" rx="8" stroke="#f59e0b" strokeWidth="10" />
          <line x1="100" y1="42" x2="100" y2="162" stroke="#f8fafc" strokeWidth="6" />
        </svg>
      </div>
    ),
    {
      width: size.width,
      height: size.height,
    }
  );
}
