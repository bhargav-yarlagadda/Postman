"use client";

import React, { useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/wrappers/UserWrapper";
import { Loader } from "@/components/Loader";
import Navbar from "@/components/Navbar";
import AddTab from "@/components/AddTab";
import RequestSender from "@/components/RequestSender";

const Page = () => {
  const router = useRouter();
  const context = useContext(UserContext);
  const user = context?.user;
  const loading = context?.loading;
  const logout = context?.logout;

  useEffect(() => {
    if (loading) return;
    router.push(user ? "/" : "/sign-in");
  }, [user, loading, router]);

  if (loading) return <Loader />;

  return (
    <div>
      <Navbar/>
      <AddTab/>
      <RequestSender/>
    </div>

  );
};

export default Page;
