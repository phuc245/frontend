import { Card } from "antd";
import LoginForm from "./_components/login-form/login-form";
import PackageCard from "./_components/package-card";
import RegisterForm from "@/pages/login/_components/register-form";
import { useState } from "react";

export default function Login() {
  const [activeTabKey, setActiveTabKey] = useState<string>("login");
  const tabList = [
    {
      key: "login",
      tab: "Đăng nhập",
    },
    {
      key: "register",
      tab: "Đăng ký",
    },
  ];

  const onTabChange = (key: string) => {
    setActiveTabKey(key);
  };

  const contentList: Record<string, React.ReactNode> = {
    login: <LoginForm />,
    register: <RegisterForm />,
  };
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Service packages sidebar
      <div className="bg-gradient-to-b from-sky-400 to-blue-600 md:w-1/3 p-8 flex flex-col justify-center items-center text-white">
        <h1 className="text-3xl font-bold mb-6">Service Packages</h1>
        <div className="space-y-6 w-full max-w-xs">
          <PackageCard
            title="Basic Plan"
            price="$9.99/month"
            features={["10GB Data", "Basic Support", "1 User"]}
          />
          <PackageCard
            title="Premium Plan"
            price="$19.99/month"
            features={["50GB Data", "24/7 Support", "5 Users"]}
            highlighted
          />
          <PackageCard
            title="Enterprise Plan"
            price="$49.99/month"
            features={["Unlimited Data", "Priority Support", "Unlimited Users"]}
          />
        </div>
      </div> */}

      {/* Login form */}
      <div
        className="flex-1 flex justify-center items-center p-8 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://png.pngtree.com/background/20220716/original/pngtree-hand-drawn-cartoon-purple-technology-background-picture-image_1637472.jpg')",
        }}
      >
        <div className="w-full max-w-md backdrop-blur-md bg-white/30 rounded-2xl shadow-xl p-6">
          <h2 className="text-center text-2xl font-bold mb-4 text-white drop-shadow">
            Welcome Back
          </h2>

          <div className="flex justify-center mb-4">
            {tabList.map((tab) => (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={`px-4 py-2 rounded-md mx-1 text-white font-semibold transition ${
                  activeTabKey === tab.key
                    ? "bg-white/30 border border-white"
                    : "bg-transparent hover:bg-white/10"
                }`}
              >
                {tab.tab}
              </button>
            ))}
          </div>

          <div className="text-white">{contentList[activeTabKey]}</div>
        </div>
      </div>
    </div>
  );
}
