"use client";

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export function MainNavClient({
    className,
    ...props
}: React.HtmlHTMLAttributes<HTMLElement>) {
    const pathname = usePathname();
    
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem key="iphone">
                    <Link href="/category/iphone"
                        className={cn("text-sm font-medium transition-colors hover:text-primary",
                                pathname.startsWith(`/category/iphone`) ? 'text-black dark:text-white' : 'text-muted-foreground'
                        )} legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        <TooltipProvider>
                            <p className="h-auto capitalize">Iphone</p>
                        </TooltipProvider>
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem key="ipad">
                    <Link href="/category/ipad"
                        className={cn("text-sm font-medium transition-colors hover:text-primary",
                                pathname.startsWith(`/category/ipad`) ? 'text-black dark:text-white' : 'text-muted-foreground'
                        )} legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        <TooltipProvider>
                            <p className="h-auto capitalize">Ipad</p>
                        </TooltipProvider>
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem key="mac">
                    <Link href="/category/mac"
                        className={cn("text-sm font-medium transition-colors hover:text-primary",
                                pathname.startsWith(`/category/mac`) ? 'text-black dark:text-white' : 'text-muted-foreground'
                        )} legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        <TooltipProvider>
                            <p className="h-auto capitalize">Mac</p>
                        </TooltipProvider>
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem key="apple-watch">
                    <Link href="/category/apple-watch"
                        className={cn("text-sm font-medium transition-colors hover:text-primary",
                                pathname.startsWith(`/category/apple-watch`) ? 'text-black dark:text-white' : 'text-muted-foreground'
                        )} legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        <TooltipProvider>
                            <p className="h-auto capitalize">Apple watch</p>
                        </TooltipProvider>
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem key="phu-kien">
                    <Link href="/category/phu-kien"
                        className={cn("text-sm font-medium transition-colors hover:text-primary",
                                pathname.startsWith(`/category/phu-kien`) ? 'text-black dark:text-white' : 'text-muted-foreground'
                        )} legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        <TooltipProvider>
                            <p className="h-auto capitalize">Phụ kiện</p>
                        </TooltipProvider>
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem key="blog">
                    <Link href="/blog"
                        className={cn("text-sm font-medium transition-colors hover:text-primary",
                                pathname.startsWith(`/blog`) ? 'text-black dark:text-white' : 'text-muted-foreground'
                        )} legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        <TooltipProvider>
                            <p className="h-auto capitalize">Blog</p>
                        </TooltipProvider>
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu> 
    )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          href={String(href)}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";