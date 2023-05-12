"use client";
import { redirect } from "next/navigation";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function MemberLayout({ children }) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "loading") {
      if (session) {
        localStorage.setItem("userID", session.user.id);
      } else {
        redirect("/");
      }
    }
  }, [session]);

  if (session) {
    return <div> {children} </div>;
  }
}
