"use client";

import { Check, Copy, Ticket } from "lucide-react";
import toast from "react-hot-toast";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ApiAlertProps {
    title: string;
    description: string;
    notice: any;
}

export const ApiAlert: React.FC<ApiAlertProps> = ({
    title,
    description,
    notice,
}) => {
    const [check, setCheck] = useState(false);

    const onCopy = (description: string) => {
        setCheck(true);
        setTimeout(() => {
            setCheck(false);
        }, 500);
        navigator.clipboard.writeText(description);

        toast.success("Đã sao chép mã giảm giá");
    };
    return (
        <Alert>
            <Ticket className="h-5 w-5" />
            <AlertTitle className="flex gap-x-2 align-middle leading-2">
            {title}
            <Badge className={`flex w-[120px] justify-center text-center rounded-full text-xs px-2 py-1 ${notice && (new Date() > new Date(notice) ? "bg-red-100 text-red-600 hover:bg-red-100/90" : "bg-green-100 text-green-600 hover:bg-green-100/90")}`}>
                {notice && (new Date() > new Date(notice) ? "Đã hết hạn" : "Đang diễn ra")}
            </Badge>
            </AlertTitle>
            <AlertDescription className="mt-4 flex items-center justify-between">
                <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                    {description}
                </code>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onCopy(description)}
                >
                    {(!check && <Copy className="h-4 w-4" />) || (
                        <Check className="h-4 w-4 text-green-500" />
                    )}
                </Button>
            </AlertDescription>
        </Alert>
    );
};