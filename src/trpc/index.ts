import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { protectedProcedure, publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/app/db";
import { z } from "zod";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";
import { absoluteURL } from "@/lib/utils";
import { getUserSubscriptionPlan, stripe } from "@/lib/stripe";
import { PLANS } from "@/config/stripe";
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
    const { id } = ctx;
    return await db.file.findMany({
      where: {
        userId: id,
      },
    });
  }),

  getFileUploadStatus: protectedProcedure
    .input(z.object({ fileId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = ctx;
      const file = await db.file.findFirst({
        where: {
          id: input.fileId,
          userId: id,
        },
      });

      if (!file) return { fileStatus: "PENDING" as const };

      return { fileStatus: file.uploadStatus };
    }),

  deleteFile: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = ctx;

      const file = await db.file.findFirst({
        where: {
          id: input.id,
          userId: id,
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
      const { id } = ctx;
      const file = await db.file.findFirst({
        where: {
          key: input.key,
          userId: id,
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

  getFileMessages: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        fileId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { fileId, cursor } = input;
      const limit = input.limit ?? INFINITE_QUERY_LIMIT;

      const file = await db.file.findFirst({
        where: {
          id: fileId,
          userId: ctx.id,
        },
      });

      if (!file) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const messages = await db.message.findMany({
        take: limit + 1,
        where: {
          fileId,
        },
        orderBy: {
          createdAt: "desc",
        },
        cursor: cursor ? { id: cursor } : undefined,
        select: {
          id: true,
          isUserMessage: true,
          createdAt: true,
          text: true,
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (messages.length > limit) {
        const nextItem = messages.pop();
        nextCursor = nextItem?.id;
      }

      return {
        messages,
        nextCursor,
      };
    }),

  createStripeSession: protectedProcedure.mutation(async ({ ctx }) => {
    const user = ctx;

    const billingUrl = absoluteURL("/dashboard/billing");
    if (!user.id) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    const dbUser = await db.user.findFirst({
      where: {
        id: user.id,
      },
    });

    if (!dbUser) throw new TRPCError({ code: "UNAUTHORIZED" });
    const subscriptionPlan = await getUserSubscriptionPlan();

    if (subscriptionPlan.isSubscribed && dbUser.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: dbUser.stripeCustomerId,
        return_url: billingUrl,
      });
      return {
        url: stripeSession.url,
      };
    }

    const proPlan = PLANS.find((plan) => plan.name === "Pro");
    if (!proPlan?.price.priceId.test) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Pro plan price ID not found",
      });
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: billingUrl,
      cancel_url: billingUrl,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      line_items: [
        {
          price: proPlan.price.priceId.test,
          quantity: 1,
        },
      ],
      metadata: {
        userId: user.id,
      },
    });
    return { url: stripeSession.url };
  }),
});

export type AppRouter = typeof appRouter;
