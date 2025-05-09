import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { protectedProcedure, publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/app/db";
import { z } from "zod";
export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.id || !user?.email) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }
    const dbUser = await db.user.findFirst({
      where: {
        id: user.id,
      },
    });

    if (!dbUser) {
      //create user
      await db.user.create({
        data: {
          id: user.id,
          email: user.email,
          name: user.given_name,
        },
      });
    }

    return { success: true };
  }),

  getUserFiles: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx;
    return await db.file.findMany({
      where: {
        userId: user.id,
      },
    });
  }),

  deleteFile: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;

      const file = await db.file.findFirst({
        where: {
          id: input.id,
          userId: user.id,
        },
      });

      if (!file) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "File not found",
        });
      }

      await db.file.delete({
        where: {
          id: input.id,
        },
      });

      return { success: true };
    }),

  getFile: protectedProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const file = await db.file.findFirst({
        where: {
          key: input.key,
          userId: user.id,
        },
      });
      if (!file) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "File not found",
        });
      }
      return file;
    }),
});

export type AppRouter = typeof appRouter;
