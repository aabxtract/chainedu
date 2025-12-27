"use client";
import {
  BookOpen,
  CheckCircle,
  ClipboardCopy,
  PlusCircle,
  ShieldCheck,
  User,
  Loader2,
  AlertTriangle,
  Wallet,
} from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useAuth } from "@/contexts/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { generateVerificationLink } from "@/app/actions";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

const recordFormSchema = z.object({
  course: z.string().min(2, "Course name is too short"),
  grade: z.string().min(1, "Grade is required"),
  year: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
  institution: z.string().min(3, "Institution name is too short"),
});

function AddRecordForm({ onAdd }: { onAdd: (data: any) => void }) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof recordFormSchema>>({
    resolver: zodResolver(recordFormSchema),
    defaultValues: {
      course: "",
      grade: "",
      year: new Date().getFullYear(),
      institution: "",
    },
  });

  function onSubmit(values: z.infer<typeof recordFormSchema>) {
    onAdd(values);
    form.reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Record
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Academic Record</DialogTitle>
          <DialogDescription>
            Enter the details of the academic record to add to the student's profile.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="course"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Blockchain Fundamentals" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="institution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Institution</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., NextGen University" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="grade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grade</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., A+" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 2023" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full">
              Add Record to Chain
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [records, setRecords] = useState(user?.records || []);
  const [verificationLink, setVerificationLink] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  if (!user) return null;

  const handleAddRecord = (data: any) => {
    const newRecord = {
      id: `REC-${Math.floor(Math.random() * 1000)}`,
      ...data,
      verified: false, // New records are unverified until mined
      transactionId: 'Pending...',
    };
    setRecords([newRecord, ...records]);
    toast({
      title: "Record Submitted",
      description: "Your new academic record is being added to the blockchain.",
    });
  };

  const handleGenerateLink = async () => {
    setIsGenerating(true);
    setVerificationLink("");
    const result = await generateVerificationLink(user.studentId);
    if (result.success && result.link) {
      setVerificationLink(result.link);
      toast({
        title: "Link Generated!",
        description: "Your verification link is ready to be shared.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
    }
    setIsGenerating(false);
  };

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(verificationLink);
    toast({
      title: "Copied to clipboard!",
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-lg mx-auto">
          <TabsTrigger value="profile">
            <User className="mr-2 h-4 w-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="records">
            <BookOpen className="mr-2 h-4 w-4" /> Records
          </TabsTrigger>
          {user.role === 'student' && (
            <TabsTrigger value="verification">
              <ShieldCheck className="mr-2 h-4 w-4" /> Verification
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <CardDescription>
                Role: <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>{user.role}</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4 p-3 bg-muted rounded-md">
                  <User className="w-5 h-5 text-muted-foreground"/>
                  <div>
                      <p className="text-sm text-muted-foreground">Student ID</p>
                      <p className="font-mono">{user.studentId}</p>
                  </div>
              </div>
              <div className="flex items-center space-x-4 p-3 bg-muted rounded-md">
                  <Wallet className="w-5 h-5 text-muted-foreground"/>
                  <div>
                      <p className="text-sm text-muted-foreground">Wallet Address</p>
                      <p className="font-mono truncate">{user.walletAddress}</p>
                  </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="records" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Academic Records</CardTitle>
                <CardDescription>
                  Your immutable academic history on the blockchain.
                </CardDescription>
              </div>
              {user.role === "admin" && <AddRecordForm onAdd={handleAddRecord} />}
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>Institution</TableHead>
                    <TableHead className="text-center">Year</TableHead>
                    <TableHead className="text-center">Grade</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.course}</TableCell>
                      <TableCell>{record.institution}</TableCell>
                      <TableCell className="text-center">{record.year}</TableCell>
                      <TableCell className="text-center font-bold">
                        {record.grade}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={record.verified ? "default" : "outline"} className={record.verified ? "bg-green-100 text-green-800" : ""}>
                          {record.verified ? "Verified" : "Pending"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {records.length === 0 && <p className="text-center text-muted-foreground py-8">No records found.</p>}
            </CardContent>
          </Card>
        </TabsContent>
        {user.role === 'student' && (
          <TabsContent value="verification" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Share Your Records</CardTitle>
                <CardDescription>
                  Generate a temporary, secure link to share your verified
                  academic records with employers or other institutions.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-6">
                <Button
                  size="lg"
                  onClick={handleGenerateLink}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ShieldCheck className="mr-2 h-4 w-4" />
                  )}
                  {isGenerating ? "Generating..." : "Generate Verification Link"}
                </Button>
                {verificationLink && (
                  <Card className="w-full bg-muted animate-in fade-in-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <CheckCircle className="text-green-500" />
                        Link Generated Successfully!
                      </CardTitle>
                      <CardDescription>
                        This link expires in 24 hours.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center space-x-2">
                      <Input
                        readOnly
                        value={verificationLink}
                        className="font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={copyLinkToClipboard}
                      >
                        <ClipboardCopy className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                )}
                 {!isGenerating && !verificationLink && (
                    <Alert className="max-w-md text-center">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Ready to Share?</AlertTitle>
                        <AlertDescription>
                        Click the button above to create a unique verification link.
                        </AlertDescription>
                    </Alert>
                 )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
