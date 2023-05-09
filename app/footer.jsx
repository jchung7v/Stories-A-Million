// Because we're using react thing in line 4.
"use client";
import { useSession } from "next-auth/react";
import Link from 'next/link';
import { HomeIcon, PlusCircleIcon, UserIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from "react";


export default function Footer(){
  const { data: session } = useSession();

  const [userId, setUserId] = useState(null)

  useEffect(()=> {
    const userID = localStorage.getItem("userID") 
    setUserId(userID)
  })

  if (session) {
    return (
      <footer className="z-10 bg-stone-100 py-4 text-center">
        <div className="flex items-center justify-between mx-10">
          <Link
            href="/threads"
            className="text-stone-500 hover:text-stone-800 transition-colors"
          >
            <HomeIcon className="w-9" />
            <span className="uppercase font-mono text-xs">Home</span>
          </Link>
          <Link
            href="/createMainThread"
            className="text-stone-500 hover:text-stone-800 transition-colors"
          >
            <PlusCircleIcon className="w-9" />
            <span className="uppercase font-mono text-xs">Start</span>
          </Link>
          <Link
            href={`/profile/users/${userId}`}
            className="text-stone-500 hover:text-stone-800 transition-colors"
          >
            <UserIcon className="w-9" />
            <span className="uppercase font-mono text-xs">Profile</span>
          </Link>
        </div>
      </footer>
    );
  }

  return;
};
