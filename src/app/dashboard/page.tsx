import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import Dashboard from "./_components/dashboard";
import { getUserSubscriptionPlan } from "@/lib/stripe";

async function DashboardPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user || !user.id) {
    redirect("/auth-callback?origin=dashboard");
  }
  // const dbUser = await db.user.findFirst({
  //   where: {
  //     id: user.id,
  //   },
  // });
  if (!user) {
    redirect("/auth-callback?origin=dashboard");
  }

  const subscriptionPlan = await getUserSubscriptionPlan();

  return <Dashboard subscriptionPlan={subscriptionPlan} />;
}

export default DashboardPage;
