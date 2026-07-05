import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 600,
};

export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0f172a 0%, #111827 100%)",
          color: "#f8fafc",
        }}
      >
        <div style={{ fontSize: 60, fontWeight: 700, marginBottom: 12 }}>IFRS 16: Leases</div>
        <div style={{ fontSize: 28, color: "#cbd5f5" }}>
          ROU assets, lease liabilities, and exam-focused notes.
        </div>
      </div>
    ),
    {
      width: size.width,
      height: size.height,
    }
  );
}
