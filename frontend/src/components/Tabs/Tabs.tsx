import { ElementRef, ComponentPropsWithoutRef, forwardRef } from "react";
import * as RadixTabs from "@radix-ui/react-tabs";
import classNames from "classnames";

import styles from "./Tabs.module.css";

const Tabs = forwardRef<
    ElementRef<typeof RadixTabs.Root>,
    ComponentPropsWithoutRef<typeof RadixTabs.Root>
>(({ className, ...props }, ref) => (
    <RadixTabs.Root
        ref={ref}
        className={classNames(
            styles.tabLayout,
            className
        )}
        {...props}
    />
));

const TabsList = forwardRef<
    ElementRef<typeof RadixTabs.List>,
    ComponentPropsWithoutRef<typeof RadixTabs.List>
>(({ className, ...props }, ref) => (
    <RadixTabs.List
        ref={ref}
        className={className}
        {...props}
    />
));

TabsList.displayName = RadixTabs.List.displayName;

const TabsTrigger = forwardRef<
    ElementRef<typeof RadixTabs.Trigger>,
    ComponentPropsWithoutRef<typeof RadixTabs.Trigger>
>(({ className, ...props }, ref) => (
    <RadixTabs.Trigger
        ref={ref}
        className={classNames(
            styles.tabSelector,
            className
        )}
        {...props}
    />
));

TabsTrigger.displayName = RadixTabs.Trigger.displayName;

const TabsContent = forwardRef<
    ElementRef<typeof RadixTabs.Content>,
    ComponentPropsWithoutRef<typeof RadixTabs.Content>
>(({ className, ...props }, ref) => (
    <RadixTabs.Content
        ref={ref}
        className={classNames(
            styles.tabPanel,
            className
        )}
        {...props}
    />
));

TabsContent.displayName = RadixTabs.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };