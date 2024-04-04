"use client"
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  router.replace("/dashboard/create-frame")
  // TODO: fetch list of frames and render a list if not redirect

  return <div className="flex justify-center mt-12">
    List of memes
  </div>;
}
