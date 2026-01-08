"use client";
import { toast } from "sonner";
import { msg, useGT } from "gt-next";

export const Button = () => {
  const m = useGT();

  const randomMessage = [
    "Welcome to Code Vault",
    "Snippets made easy",
    "Sharing is caring",
    "Collaboration made simple",
    "Productivity in the palm of your hand",
  ];

  const message = msg(randomMessage[Math.floor(Math.random() * randomMessage.length)]);

  return (
    <button
      onClick={() => toast(m(message))}
      className="bg-primary hover:bg-primary/80 rounded-md px-4 py-2 text-white transition-colors"
    >
      {m("Click me for a welcome message!")}
    </button>
  );
};
