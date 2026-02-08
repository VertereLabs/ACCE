import { ImageResponse } from "next/og";

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
          color: "#f8fafc",
          fontSize: 96,
          fontWeight: 700,
          letterSpacing: "0.08em",
        }}
      >
        ACCE
      </div>
    ),
    {
      width: size.width,
      height: size.height,
    }
  );
}
