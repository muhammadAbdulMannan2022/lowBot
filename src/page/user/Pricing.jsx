import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Navbar from "../../component/user/Navbar";
import Sidebar from "../../component/user/UserSidebar";
import { useState, useEffect } from "react";
import axiosInstance from "../../component/axiosInstance";

export default function PricingTable() {
  const [plans, setPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  // Fetch subscription plans from the API
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axiosInstance.get(
          "/payment/get_all/subscribtions-plan/"
        );
        if (response.status !== 200) {
          throw new Error("Failed to fetch subscription plans");
        }

        const data = response.data;

        // Map API data to the format expected by the component
        const formattedPlans = data.map((plan) => ({
          name: plan.name,
          price: `$${parseFloat(plan.amount).toFixed(2)}`,
          description: plan.subtitle,
          duration_type: plan?.descriptions?.duration_type,
          price_id: plan.price_id, // Add price_id to the plan object
          features: plan.descriptions.map((desc) => ({
            name: desc.text,
            included: desc.status,
          })),
        }));
        setPlans(formattedPlans);
      } catch (error) {
        console.error("Error fetching subscription plans:", error);
        setPlans([]);
      }
    };

    fetchPlans();
    fetchSubscriptionsData();
  }, []); // Empty dependency array to fetch only on mount

  const fetchSubscriptionsData = async () => {
    try {
      const response = await axiosInstance.get("/payment/me/");

      if (response.status === 200) {
        console.log("res", response.data);
        setCurrentPlan(response.data.subscription || {});
      }
    } catch (error) {
      console.error("Error fetching subscription data:", error);
    }
  };

  function formatDateToCustom(isoDateString) {
    const date = new Date(isoDateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  }

  const handlePayment = async (data) => {
    console.log(data.name, data.price_id, data.duration_type);

    setIsLoading(data.price_id);
    try {
      const response = await axiosInstance.post(
        "/payment/create-checkout-session/",
        {
          plan_name: data.name,
          price_id: data.price_id,
          duration_type: data.duration_type,
        }
      );
      const { checkout_url } = response.data;
      console.log("checkout_url", checkout_url);
      if (checkout_url) {
        // Navigate to the Stripe checkout URL
        window.location.href = checkout_url; // Redirect to Stripe page
      }
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#f0f7ff] dark:bg-gray-900">
      <Navbar />
      <div className="flex flex-1 overflow-hidden mt-16">
        <Sidebar />
        <div className="flex-1 overflow-y-auto p-4 md:p-6 md:pl-7">
          <h1 className="text-xl md:text-2xl font-semibold text-center mb-6 text-gray-800 dark:text-gray-100">
            List of Packages
          </h1>

          {/* Current Membership Status */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Date of Starting
              </p>
              <p className="font-medium text-sm md:text-base text-gray-800 dark:text-gray-100">
                {formatDateToCustom(currentPlan.start_date)}
              </p>
            </div>
            <div className="text-center">
              <p className="font-medium text-sm md:text-base text-gray-800 dark:text-gray-100">
                Membership (Current)
              </p>
              <p className="text-blue-600 dark:text-blue-400 text-sm md:text-base">
                {currentPlan.plan?.name}
              </p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Date of End
              </p>
              <p className="font-medium text-sm md:text-base text-gray-800 dark:text-gray-100">
                {formatDateToCustom(currentPlan.end_date)}
              </p>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {plans.length > 0 ? (
              plans.map((plan) => (
                <Card
                  key={plan.name}
                  className={`border ${
                    plan.name === currentPlan.plan?.name
                      ? "border-blue-500"
                      : "border-gray-200 dark:border-gray-700"
                  } bg-white dark:bg-gray-800`}
                >
                  <CardHeader className="pb-0">
                    <h2 className="text-lg md:text-xl font-semibold text-blue-600 dark:text-blue-400">
                      {plan.name}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 min-h-[48px]">
                      {plan.description}
                    </p>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex items-baseline mb-4 md:mb-6">
                      <span className="text-3xl md:text-4xl font-bold text-gray-700 dark:text-gray-100">
                        {plan.price}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                        /{plan.duration_type}
                      </span>
                    </div>
                    <Button
                      disabled={plan.name === currentPlan.plan?.name}
                      onClick={() => handlePayment(plan)}
                      className={`w-full py-2 rounded-md border text-sm md:text-base ${
                        plan.name === currentPlan.plan?.name
                          ? "bg-blue-500 text-white cursor-not-allowed"
                          : "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 border-blue-600 hover:bg-blue-700 hover:text-white"
                      }`}
                      aria-label={`${
                        plan.name === currentPlan.plan?.name
                          ? "Activated"
                          : `Get started with ${plan.name} plan`
                      }`}
                    >
                      {isLoading === plan.price_id ? (
                        <span className="loader"></span>
                      ) : (
                        <span>
                          {plan.name === currentPlan.plan?.name
                            ? "Activated"
                            : "Get Started Now"}
                        </span>
                      )}
                    </Button>

                    <div className="mt-4 md:mt-6 space-y-2 md:space-y-3">
                      {plan.features.map((feature) => (
                        <div key={feature.name} className="flex items-start">
                          {feature.included ? (
                            <Check className="h-4 w-4 md:h-5 md:w-5 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0" />
                          ) : (
                            <X className="h-4 w-4 md:h-5 md:w-5 text-gray-400 mr-2 flex-shrink-0" />
                          )}
                          <span
                            className={`text-sm md:text-base ${
                              feature.included
                                ? "text-gray-700 dark:text-gray-200"
                                : "text-gray-400"
                            }`}
                          >
                            {feature.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-center col-span-1 md:col-span-3 text-gray-600 dark:text-gray-300">
                No subscription plans available.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
