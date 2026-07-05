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
          background: "linear-gradient(135deg, #002251 0%, #001a3d 100%)",
          color: "#f5ecd9",
        }}
      >
        <div style={{ width: 80, height: 6, background: "#cb8a00", marginBottom: 28 }} />
        <div style={{ fontSize: 68, fontWeight: 700, marginBottom: 12 }}>ACCE Tutors</div>
        <div style={{ fontSize: 28, color: "#d8c9a8" }}>
          Expert CA(SA) &amp; CTA tutoring for undergraduate and PGDA students.
        </div>
      </div>
    ),
    {
      width: size.width,
      height: size.height,
    }
  );
}
