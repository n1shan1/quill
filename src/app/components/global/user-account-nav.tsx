import { Icons } from "@/app/dashboard/_components/icons/icons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Gem } from "lucide-react";

import Image from "next/image";
import Link from "next/link";

interface Props {
  email: string;
  imageUrl: string;
  name: string;
}

const UserAccountNav = async ({ email, imageUrl, name }: Props) => {
  const subscriptionPlan = await getUserSubscriptionPlan();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="overflow-visible">
        <Button className="rounded-full h-8 w-8 aspect-square ">
          <Avatar className="relative h-8 w-8 ">
            {imageUrl ? (
              <div className="relative h-full w-full aspect-square">
                <Image
                  fill
                  src={imageUrl}
                  alt={"eg"}
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <AvatarFallback>
                {
                  <span>
                    name.slice(0, 2)
                    <Icons.user className="h-8 w-8 aspect-square rounded-ful" />
                  </span>
                }
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-background" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-0.5 leading-none">
            {name && (
              <p className="font-medium text-sm text-foreground">{name}</p>
            )}
            {email && (
              <p className="w-[200px] truncate text-xs text-muted-foreground/60">
                {email}
              </p>
            )}
          </div>
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={"/dashboard"}>Dashboard</Link>
        </DropdownMenuItem>
        {subscriptionPlan.isSubscribed ? (
          <DropdownMenuItem asChild>
            <Link href={"/dashboard/billing"}>Manage Subscription</Link>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem asChild>
            <Link href={"/pricing"}>
              Upgrade <Gem className="text-blue-600 h-4 w-4 mt-1.5" />
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <LogoutLink>Logout</LogoutLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default UserAccountNav;
