"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import AuthHeader from "./auth-headerR";
import BackButton from "./back-button";

interface CardWrapperProps {
    label: string;
    title: string;
    backButtonHref: string;
    backButtonLabel: string;
    children: React.ReactNode;
    onSelectRole: (role: "User" | "Expert") => void; 
  }
  

const CardWrapper = ({
  label,
  title,
  backButtonHref,
  backButtonLabel,
  onSelectRole,
  children,
}: CardWrapperProps) => {
  return (
    <Card className="xl:w-1/4 md:w-1/2 shadow-md">
      <CardHeader>
        <AuthHeader label={label} title={title} onSelectRole={onSelectRole} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>
        <BackButton label={backButtonLabel} href={backButtonHref} />
      </CardFooter>
    </Card>
  );
};

export default CardWrapper;
