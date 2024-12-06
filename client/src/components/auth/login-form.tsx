"use client";

import CardWrapper from "./card-wrapperR";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoginSchema } from "../../../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/components/userContext";

const LoginForm = ({ redirect }: { redirect: string }) => {
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"User" | "Expert" | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const { login } = useUser();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    setLoading(true);
    setError(null);
  
    try {
      console.log("Data being sent to backend:", {
        email: data.email,
        password: data.password,
        role: selectedRole?.toLowerCase(),
      });
      const response = await fetch("http://localhost:8000/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          role: selectedRole?.toLowerCase(),
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }
      const result = await response.json();
      console.log("this is esutl",result)
      // Simulate user login
      if (selectedRole?.toLowerCase() === "expert"){
        login({
          name: result.user.username,
          Id:result.user.expertId,
          role: result.user.role,
          avatar: "https://via.placeholder.com/40", // Placeholder for avatar
        });
      }
      else{
        login({
          name: result.user.username,
          Id:result.user.userId,
          role: result.user.role,
          avatar: "https://via.placeholder.com/40", // Placeholder for avatar
        });
      }

  
      console.log("Login successful", result);
  
      // Redirect to the original page or default
      router.push(redirect);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <CardWrapper
      label="Login to your account"
      title="Login"
      backButtonHref="/auth/register"
      backButtonLabel="Don't have an account? Register here."
      onSelectRole={(role: "User" | "Expert") => {
        setSelectedRole(role);
        form.setValue("role", role); // Set role value in form
      }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="johndoe@gmail.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="******" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button
            type="submit"
            className="w-full"
            disabled={!selectedRole || loading} // Disable if role is not selected
          >
            {loading ? "Loading..." : "Login"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default LoginForm;
