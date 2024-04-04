"use client";
import dynamic from "next/dynamic";

const DynamicCreateFrame = dynamic(
  () => import("../../components/CreateFrame"),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  }
);

export default function Dashboard() {
  return <DynamicCreateFrame />;
}
