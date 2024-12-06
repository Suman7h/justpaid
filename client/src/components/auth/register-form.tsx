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
import { RegisterSchema } from "../../../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import  {useForm}  from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/components/userContext";

const RegisterForm = ({ redirect }: { redirect: string }) => {
 

  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"User" | "Expert" | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const { login } = useUser();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
      role: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
    setLoading(true);
    setError(null);
  
    try {
      // Prepare the user object with all fields
      const registeredUser = {
        email: data.email,
        username: data.name, // Use 'username' as expected by your backend
        password: data.password,
        role: selectedRole?.toLowerCase(), // Include the selected role (User/Expert)
      };
      console.log("Data sent to backend:", registeredUser);

      // Make a POST request to your backend API for registration
      const response = await fetch("http://localhost:8000/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registeredUser),
      });
  
      // Parse the response
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Registration failed.");
      }
  
      const result = await response.json();
  
      // Log in the user immediately after registration
      login({
        name: result.user.username,
        Id:result.user.userId,
        avatar: "https://via.placeholder.com/40",
        role:result.user.role, 
      });
  
      console.log("Registration successful", result);
  
      // Redirect based on the selected role
      if (selectedRole === "Expert") {
        console.log("Redirecting to expert registration...");
        router.push(
          `/auth/register/expert?user_id=${result.user.expertid}&redirect=${encodeURIComponent(redirect)}`
        );        
      } else {
        console.log("Redirecting to:", redirect);
        router.push(redirect);
      }
    } catch (err: any) {
      // Handle errors from the registration process
      setError(err.message || "An unexpected error occurred.");
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <CardWrapper
      label="Create an account"
      title="Register"
      backButtonHref="/auth/login"
      backButtonLabel="Already have an account? Login here."
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
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="John Doe" />
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
            {/* Confirm Password Field */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
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
            {loading ? "Loading..." : "Register"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default RegisterForm;
