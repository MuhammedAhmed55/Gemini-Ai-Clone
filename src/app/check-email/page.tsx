import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export const metadata = {
  title: "Check your email | GOAT Notes",
};

export default function CheckEmailPage() {
  return (
    <div className="mx-auto flex w-full max-w-md items-center justify-center py-10">
      <Card className="w-full text-center">
        <CardHeader>
          <CardTitle className="text-2xl">🎉 Check your email!</CardTitle>
          <CardDescription>
            We sent you a confirmation link. Please open your inbox and follow the link to verify your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Didn&apos;t receive it? Also check your spam folder, or
            {" "}
            <Link className="underline underline-offset-4" href="/signup">
              try signing up again
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
