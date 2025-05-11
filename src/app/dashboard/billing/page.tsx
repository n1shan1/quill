import { getUserSubscriptionPlan } from "@/lib/stripe"
import BillingForm from "./_components/billing-form"

const BillingPage = async () => {
    const subscriptionPlan = await getUserSubscriptionPlan()

    return (
        <BillingForm subscriptionPlan={subscriptionPlan} />
    )
}

export default BillingPage
