import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";

export const config = {
  matcher: ["/dashboard/:path*", "/auth-callback"],
};

export default withAuth({
  // This is the default behavior, but you can customize it
  callbacks: {
    authorized: ({ token }: { token: string }) => {
      if (!token) {
        return false;
      }
      return true;
    },
  },
});
