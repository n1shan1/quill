import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { NextRequest } from "next/server";

export const config = {
  matcher: ["/dashboard/:path*", "/auth-callback"],
};

export default withAuth({
  // This is the default behavior, but you can customize it
  callbacks: {
    authorized: ({ req, token }: { req: NextRequest; token: any }) => {
      if (!token) {
        return false;
      }
      return true;
    },
  },
});
