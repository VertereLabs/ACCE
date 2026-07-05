import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ACCE Tutors",
    short_name: "ACCE Tutors",
    description: "Expert CA(SA) & CTA tutoring for undergraduate and PGDA students.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f2140",
    theme_color: "#002251",
  };
}
