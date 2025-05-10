import { AppRouter } from "@/trpc";
import { inferRouterOutputs } from "@trpc/server";

type routerOutput = inferRouterOutputs<AppRouter>;

type Messages = routerOutput["getFileMessages"]["messages"];

type OmitText = Omit<Messages[number], "text">;

type ExtendedText = {
  text: string | JSX.Element;
};

export type ExtendMessage = OmitText & ExtendedText;
