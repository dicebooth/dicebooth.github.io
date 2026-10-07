"use client";

import React, { useState } from "react";
import Image from "next/image";
import { User } from "lucide-react";

export interface AvatarProps {
  src?: string;
  alt: string;
  size?: number;
}

export function Avatar({ src, alt, size = 96 }: AvatarProps) {
  const [hasError, setHasError] = useState(false);

  // Compute initials from alt/title
  const initials = alt
    ? alt
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "DB";

  return (
    <div className="relative group">
      {/* Subtle outer ambient glow */}
      <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-500 opacity-60 blur-md group-hover:opacity-90 transition-all duration-500" />

      {/* Main avatar container */}
      <div
        className="relative rounded-full overflow-hidden border-2 border-white/20 bg-neutral-900/90 shadow-2xl flex items-center justify-center backdrop-blur-md"
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        {src && !hasError ? (
          <img
            src={src}
            alt={alt}
            width={size}
            height={size}
            onError={() => setHasError(true)}
            className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-105"
            loading="eager"
          />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full text-white/90 font-bold text-xl select-none">
            {initials ? initials : <User className="w-8 h-8 text-neutral-400" />}
          </div>
        )}
      </div>
    </div>
  );
}

export default Avatar;
