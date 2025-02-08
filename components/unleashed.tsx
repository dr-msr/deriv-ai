"use client"

import * as React from "react"
import {
  AlertCircle,
  Archive,
  ArchiveX,
  ChartArea,
  File,
  Inbox,
  MessagesSquare,
  Search,
  Send,
  ShoppingCart,
  Trash2,
  Users2,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Nav } from "./nav"
import { type Mail } from "../lib/data"
import { useMail } from "../lib/use-mail"
import { Input } from "./ui/input"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable"
import { Separator } from "./ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { TooltipProvider } from "./ui/tooltip"
import { AccountSwitcher } from "./account-switcher"
import { MailDisplay } from "./mail-display"
import { MailList } from "./mail-list"
import { FaChartLine } from "react-icons/fa6"
import { CompanyList } from "./company"
import { Company } from "@/lib/company"
import { CompanyDisplay } from "./company-display"
import { useCompany } from "@/lib/use-company"
import { useState, useEffect } from "react"

interface UnleashedProps {
  accounts: {
    label: string
    email: string
    icon: React.ReactNode
  }[]
  companies: Company[]
  defaultLayout: number[] | undefined
  defaultCollapsed?: boolean
  navCollapsedSize: number
}

export function Unleashed({
  accounts,
  companies,
  defaultLayout = [20, 32, 48],
  defaultCollapsed = false,
  navCollapsedSize,
}: UnleashedProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)
  const [company, setCompany] = useState<Company | null>(null)


  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(
            sizes
          )}`
        }}
        className="h-full max-h-[800px] items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={15}
          maxSize={20}
          onCollapse={() => {
            setIsCollapsed(true)
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              true
            )}`
          }}
          onResize={() => {
            setIsCollapsed(false)
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              false
            )}`
          }}
          className={cn(
            isCollapsed &&
              "min-w-[50px] transition-all duration-300 ease-in-out"
          )}
        >
          <div
            className={cn(
              "flex h-[52px] items-center justify-center",
              isCollapsed ? "h-[52px]" : "px-2"
            )}
          >
            <AccountSwitcher isCollapsed={isCollapsed} accounts={accounts} />
          </div>
          <Separator />
          <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: "Stock Companies",
                label: "128",
                icon: ChartArea,
                variant: "default",
              },
              // {
              //   title: "Drafts",
              //   label: "9",
              //   icon: File,
              //   variant: "ghost",
              // },
              // {
              //   title: "Sent",
              //   label: "",
              //   icon: Send,
              //   variant: "ghost",
              // },
              // {
              //   title: "Junk",
              //   label: "23",
              //   icon: ArchiveX,
              //   variant: "ghost",
              // },
              // {
              //   title: "Trash",
              //   label: "",
              //   icon: Trash2,
              //   variant: "ghost",
              // },
              // {
              //   title: "Archive",
              //   label: "",
              //   icon: Archive,
              //   variant: "ghost",
              // },
            ]}
          />
          {/* <Separator />
          <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: "Social",
                label: "972",
                icon: Users2,
                variant: "ghost",
              },
              {
                title: "Updates",
                label: "342",
                icon: AlertCircle,
                variant: "ghost",
              },
              {
                title: "Forums",
                label: "128",
                icon: MessagesSquare,
                variant: "ghost",
              },
              {
                title: "Shopping",
                label: "8",
                icon: ShoppingCart,
                variant: "ghost",
              },
              {
                title: "Promotions",
                label: "21",
                icon: Archive,
                variant: "ghost",
              },
            ]}
          /> */}
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <Tabs defaultValue="all">
            <div className="flex items-center px-4 py-2">
              <h1 className="text-xl font-bold">Companies</h1>
              <TabsList className="ml-auto">
                <TabsTrigger
                  value="all"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  All Companies
                </TabsTrigger>
                <TabsTrigger
                  value="favourite"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  Favourite
                </TabsTrigger>
              </TabsList>
            </div>
            <Separator />
            <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <form>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search" className="pl-8" />
                </div>
              </form>
            </div>
            <TabsContent value="all" className="m-0">
              <CompanyList companies={companies} setSelected={setCompany} />
            </TabsContent>
            <TabsContent value="favourite" className="m-0">
              <CompanyList companies={companies.filter((item) => item.stock_price)} setSelected={setCompany}   />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]} minSize={30}>
          <CompanyDisplay
            company={company}
          />          
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  )
}