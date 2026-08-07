import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "JAVA — Born of Volcanic Soil · Wines from Mount Bromo";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(ellipse 80% 70% at 50% 40%, #1a1410 0%, #0a0a0a 70%)",
          position: "relative",
        }}
      >
        {/* gold frame */}
        <div
          style={{
            position: "absolute",
            inset: 28,
            border: "1px solid rgba(201,168,76,0.4)",
            display: "flex",
          }}
        />
        <div
          style={{
            fontSize: 26,
            letterSpacing: 14,
            color: "#c9a84c",
            textTransform: "uppercase",
            marginBottom: 24,
          }}
        >
          Java Estate · Mount Bromo
        </div>
        <div
          style={{
            fontSize: 200,
            fontWeight: 300,
            letterSpacing: 40,
            color: "#e8dcc8",
            lineHeight: 1,
            fontFamily: "serif",
          }}
        >
          JAVA
        </div>
        <div
          style={{
            fontSize: 34,
            fontStyle: "italic",
            color: "rgba(232,220,200,0.7)",
            marginTop: 28,
            fontFamily: "serif",
          }}
        >
          Born of volcanic soil
        </div>
        {/* gold rule */}
        <div
          style={{
            width: 120,
            height: 1,
            background: "#c9a84c",
            marginTop: 36,
          }}
        />
      </div>
    ),
    { ...size }
  );
}
