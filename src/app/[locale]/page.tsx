import { Button } from "@/components/button";
import { LocaleSelector, msg } from "gt-next";
import { T } from "gt-next/server";

export default async function Home() {
  return (
    <main className="bg-secondary/40 flex h-dvh flex-col">
      <div className="flex flex-1 flex-col items-center justify-center">
        <LocaleSelector />
        <T>
          <h1 className="text-primary text-3xl font-bold">Code Vault</h1>
          <p className="text-primary text-xs leading-6 tracking-tight">
            It is a modern platform for managing code snippets with social, collaborative, and productivity capabilities.
          </p>
          <Button />
        </T>
      </div>
    </main>
  );
}
