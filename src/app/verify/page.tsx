"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { verifyRecord } from "@/app/actions";
import type { AcademicRecord } from "@/lib/mock-data";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, Shield, AlertTriangle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const FormSchema = z.object({
  identifier: z.string().min(10, {
    message: "Student ID or Wallet Address must be at least 10 characters.",
  }),
});

type VerificationResult = {
  user: { name: string; studentId: string };
  records: AcademicRecord[];
} | null;

export default function VerifyPage() {
  const [result, setResult] = useState<VerificationResult>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      identifier: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    setError(null);
    setResult(null);
    const response = await verifyRecord(data.identifier);
    if (response.success && response.user) {
      setResult({ user: response.user, records: response.records || [] });
    } else {
      setError(response.error || "Verification failed.");
    }
    setIsLoading(false);
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-primary" />
              <div>
                <CardTitle className="text-2xl font-bold">
                  Verify Academic Record
                </CardTitle>
                <CardDescription>
                  Enter a student ID or wallet address to verify their credentials.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="identifier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student ID or Wallet Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., STU-2024-001 or wallet address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isLoading ? "Verifying..." : "Verify Credentials"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive" className="mt-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Verification Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <Card className="mt-6 animate-in fade-in-50 duration-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="text-green-500" />
                Verification Successful
              </CardTitle>
              <CardDescription>
                Displaying verified academic records for{" "}
                <span className="font-semibold text-foreground">
                  {result.user.name}
                </span>{" "}
                (ID: {result.user.studentId}).
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result.records.length > 0 ? (
                <div className="space-y-4">
                  {result.records.map((record) => (
                    <div
                      key={record.id}
                      className="p-4 border rounded-lg bg-background/50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-primary">
                            {record.course}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {record.institution} - {record.year}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">{record.grade}</p>
                           <Badge variant="secondary" className="mt-1">
                            Verified
                          </Badge>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-3 truncate">
                        TxID: {record.transactionId}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center">
                  No verified records found for this student.
                </p>
              )}
            </CardContent>
             <CardFooter>
                <p className="text-xs text-muted-foreground">Record data is immutable and stored on the Stacks blockchain.</p>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
