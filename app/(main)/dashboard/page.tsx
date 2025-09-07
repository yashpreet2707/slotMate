"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userNameSchema } from "@/lib/validator";
import useFetch from "@/hooks/useFetch";
import { updateUsername } from "@/actions/users";
import { BarLoader } from "react-spinners";

const page = () => {
  const { isLoaded, user } = useUser();

  const [origin, setOrigin] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userNameSchema),
  });

  useEffect(() => {
    setValue("username", user?.username ?? "");
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, [isLoaded]);


  const { loading, error, fn: fnUpdateUsername } = useFetch(updateUsername);

  const onSubmit = async (data: any) => {
    fnUpdateUsername(data.username);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Welcome, {user?.firstName}</CardTitle>
        </CardHeader>
        {/* Latest updates */}
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Your Unique Link</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <div className="flex items-center gap-2">
                <span>{origin}/</span>
                <Input {...register("username")} placeholder="username" />
              </div>

              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
              {error && (
                <p className="text-red-500 text-sm mt-1">{error?.message}</p>
              )}
            </div>
            {loading && (
              <BarLoader className="mb-4" width="100%" color="#36d7b7" />
            )}
            <Button type="submit">Update Username</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
