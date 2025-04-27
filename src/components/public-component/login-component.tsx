"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Loader } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { loginAction } from "@/lib/actions/login";

const signInScheme = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, "Password is required"),
});

type formData = z.infer<typeof signInScheme>;

function SubmitButton({ isLoading }: { isLoading: boolean }) {
  return (
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
            <>
              <Loader className="mr-2 animate-spin" />
              Loading
            </>
        ) : (
            "Login"
        )}
      </Button>
  );
}
export default function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<formData>({
    resolver: zodResolver(signInScheme),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: formData) => {
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);
      const result = await loginAction(formData);

      if (result?.error) {
        setError(result.error);
      }
    } catch (error) {
      if (error instanceof Error && error.message.startsWith("NEXT_REDIRECT")) {
        throw error;
      }
      setError("Email or password wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <Card className="w-xl">
        <CardHeader>
          <CardTitle className="text-3xl">Sign In</CardTitle>
          <CardDescription>Enter your information to login</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                              type="email"
                              placeholder="Enter your email address"
                              {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                  )}
              />
              <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                              type="password"
                              placeholder="Enter your password"
                              {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                  )}
              />

              {error && <p className="text-sm text-red-500">{error}</p>}

              <SubmitButton isLoading={isLoading} />
            </form>
          </Form>
        </CardContent>
      </Card>
  );
}