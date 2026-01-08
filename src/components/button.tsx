"use client";
import { toast } from "sonner";
import { msg, useMessages } from "gt-next";

export const Button = () => {
  const m = useMessages();

  const randomMessage = [
    msg("Welcome to Code Vault"),
    msg("Snippets made easy"),
    msg("Sharing is caring"),
    msg("Collaboration made simple"),
    msg("Productivity in the palm of your hand"),
  ];

  const message = randomMessage[Math.floor(Math.random() * randomMessage.length)];

  return (
    <button
      onClick={() => toast(m(message))}
      className="bg-primary hover:bg-primary/80 rounded-md px-4 py-2 text-white transition-colors"
    >
      {m("Click me for a welcome message!")}
    </button>
  );
};
