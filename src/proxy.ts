import { NextRequest } from "next/server";
import { createNextMiddleware } from "gt-next/middleware";

const i18nMiddleware = createNextMiddleware({
  prefixDefaultLocale: true,
});

export default async function proxy(request: NextRequest) {
  return await i18nMiddleware(request);
}

export const config = {
  matcher: ["/", "/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
