import { nextSaturday, format, addHours, addDays } from "date-fns"
import {
    Archive,
    ArchiveX,
    Clock,
    Forward,
    MoreVertical,
    Reply,
    ReplyAll,
    Trash2,
} from "lucide-react"

import {
    DropdownMenuContent,
    DropdownMenuItem,
} from "./ui/dropdown-menu"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "./ui/avatar"
import { Button } from "./ui/button"
import { Calendar } from "./ui/calendar"
import {
    DropdownMenu,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Label } from "./ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "./ui/popover"
import { Separator } from "./ui/separator"
import { Switch } from "./ui/switch"
import { Textarea } from "./ui/textarea"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "./ui/tooltip"
import { ScrollArea } from "./ui/scroll-area"
import { Company } from "@/lib/company"
import { Comment, CommentSection } from "./company-comment"
import { useEffect, useState } from "react"
import { StockData } from "./chart/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import HistoricalData from "./tabs/historical"
import { Badge } from "./ui/badge"
import { LiveAnalysis } from "./tabs/live"
import { AnalysisResult } from "@/app/api/analysis/types"
import TickerData from "./ticker"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { cuid } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast"

const initialComments: Comment[] = [
    {
        id: 1,
        author: "Alice Johnson",
        avatarUrl: "/placeholder.svg?height=40&width=40",
        content: "Great company! I've been a customer for years.",
        likes: 15,
        dislikes: 2,
    },
    {
        id: 2,
        author: "Bob Smith",
        avatarUrl: "/placeholder.svg?height=40&width=40",
        content: "Their customer service is top-notch.",
        likes: 8,
        dislikes: 1,
    },
]

interface CompanyDisplayProps {
    company: Company | null
}

export function CompanyDisplay({ company }: CompanyDisplayProps) {
    const [comments, setComments] = useState(initialComments)
    const today = new Date()
    const [data, setData] = useState<StockData[]>([])
    const [activeTab, setActiveTab] = useState("live")
    const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
    const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
    const [analysisError, setAnalysisError] = useState<string | null>(null);
    const [userId, setUserId] = useState<string>("");
    const [showAnalysisDialog, setShowAnalysisDialog] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        // Initialize or get userId from localStorage
        let storedUserId = localStorage.getItem('userId');
        if (!storedUserId) {
            storedUserId = cuid();
            localStorage.setItem('userId', storedUserId);
        }
        setUserId(storedUserId);
    }, []);

    const handleTransaction = async (type: 'buy' | 'sell') => {
        if (!analysisData) {
            setShowAnalysisDialog(true);
            return;
        }

        if (!company) return

        try {
            const response = await fetch('/api/transaction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    companySymbol: company.symbol,
                    buyerId: userId,
                    type,
                }),
            });

            const result = await response.json();

            if (result.success) {
                // Store transaction in localStorage
                const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
                transactions.push({
                    ...result.data,
                    timestamp: new Date().toISOString(),
                });
                localStorage.setItem('transactions', JSON.stringify(transactions));

                toast({
                    title: 'Transaction Successful',
                    description: `Successfully ${type === 'buy' ? 'bought' : 'sold'} ${company.symbol}`,
                });
            } else {
                toast({
                    title: 'Transaction Failed',
                    description: result.error || 'An error occurred during the transaction',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.log(JSON.stringify(error))
            toast({
                title: 'Transaction Failed',
                description: 'An error occurred while processing the transaction',
                variant: 'destructive',
            });
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!company?.symbol) return;

            try {
                const response = await fetch(`/api/getData?companyId=${company.symbol}`);
                if (!response.ok) {
                    setData([]);
                    throw new Error('Failed to fetch data');
                }
                const jsonData = await response.json();
                setData(jsonData);
            } catch (error) {
                console.log(error)
            }
        };  
        setIsLoadingAnalysis(false);
        setAnalysisData(null);
        setAnalysisError(null);
        setActiveTab("live")      
        fetchData();
    }, [company?.symbol]);

    return (
        <div className="flex h-full flex-col">
            <div className="flex items-center p-2">
                <div className="flex items-center gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" disabled={!company}>
                                <Archive className="h-4 w-4" />
                                <span className="sr-only">Archive</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Archive</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" disabled={!company}>
                                <ArchiveX className="h-4 w-4" />
                                <span className="sr-only">Move to junk</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Move to junk</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" disabled={!company}>
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Move to trash</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Move to trash</TooltipContent>
                    </Tooltip>
                    <Separator orientation="vertical" className="mx-1 h-6" />
                    <Tooltip>
                        <Popover>
                            <PopoverTrigger asChild>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" disabled={!company}>
                                        <Clock className="h-4 w-4" />
                                        <span className="sr-only">Snooze</span>
                                    </Button>
                                </TooltipTrigger>
                            </PopoverTrigger>
                            <PopoverContent className="flex w-[535px] p-0">
                                <div className="flex flex-col gap-2 border-r px-2 py-4">
                                    <div className="px-4 text-sm font-medium">Snooze until</div>
                                    <div className="grid min-w-[250px] gap-1">
                                        <Button
                                            variant="ghost"
                                            className="justify-start font-normal"
                                        >
                                            Later today{" "}
                                            <span className="ml-auto text-muted-foreground">
                                                {format(addHours(today, 4), "E, h:m b")}
                                            </span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="justify-start font-normal"
                                        >
                                            Tomorrow
                                            <span className="ml-auto text-muted-foreground">
                                                {format(addDays(today, 1), "E, h:m b")}
                                            </span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="justify-start font-normal"
                                        >
                                            This weekend
                                            <span className="ml-auto text-muted-foreground">
                                                {format(nextSaturday(today), "E, h:m b")}
                                            </span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="justify-start font-normal"
                                        >
                                            Next week
                                            <span className="ml-auto text-muted-foreground">
                                                {format(addDays(today, 7), "E, h:m b")}
                                            </span>
                                        </Button>
                                    </div>
                                </div>
                                <div className="p-2">
                                    <Calendar />
                                </div>
                            </PopoverContent>
                        </Popover>
                        <TooltipContent>Snooze</TooltipContent>
                    </Tooltip>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" disabled={!company}>
                                <Reply className="h-4 w-4" />
                                <span className="sr-only">Reply</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Reply</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" disabled={!company}>
                                <ReplyAll className="h-4 w-4" />
                                <span className="sr-only">Reply all</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Reply all</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" disabled={!company}>
                                <Forward className="h-4 w-4" />
                                <span className="sr-only">Forward</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Forward</TooltipContent>
                    </Tooltip>
                </div>
                <Separator orientation="vertical" className="mx-2 h-6" />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={!company}>
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">More</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>Mark as unread</DropdownMenuItem>
                        <DropdownMenuItem>Star thread</DropdownMenuItem>
                        <DropdownMenuItem>Add label</DropdownMenuItem>
                        <DropdownMenuItem>Mute thread</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <Separator />
            {company ? (
                <ScrollArea className="flex-1 h-[calc(100vh-200px)]">
                    <div className="w-full flex-1 flex-col">
                        <div className="w-full flex items-start p-4">
                            <div className="w-full flex items-start gap-4 text-sm">
                                <Avatar>
                                    <AvatarImage alt={company.name} />
                                    <AvatarFallback>
                                        {company.name
                                            .split(" ")
                                            .map((chunk) => chunk[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="w-full grid gap-2">
                                    <div className="w-full flex flex-row justify-between">
                                    <div>
                                    <div className="font-semibold">{company.name}</div>
                                    <div className="line-clamp-1 text-xs">{company.description}</div>

                                    </div>
                                    <div className="flex flex-row gap-2">
                                        <Button 
                                            variant="outline" 
                                            size="lg" 
                                            className="text-lg px-6"
                                            onClick={() => handleTransaction('buy')}
                                        >
                                            Buy
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            size="lg" 
                                            className="text-lg px-6"
                                            onClick={() => handleTransaction('sell')}
                                        >
                                            Sell
                                        </Button>
                                        <Dialog open={showAnalysisDialog} onOpenChange={setShowAnalysisDialog}>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Analysis Required</DialogTitle>
                                                    <DialogDescription>
                                                        Please perform analysis first before making any transactions.
                                                        This helps ensure informed trading decisions.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="flex justify-end">
                                                    <Button onClick={() => setShowAnalysisDialog(false)}>
                                                        Close
                                                    </Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                    </div>

                                    <div className="w-full flex flex-row line-clamp-1 text-xs justify-between">
                                        <div className="space-x-2">
                                        <Badge>{company.sector}</Badge>
                                        <Badge>{company.industry}</Badge>
                                        <Badge>{company.employees} employees</Badge>

                                        </div>

                                        <div className="flex flex-row gap-2">
                                        <Badge className="bg-red-500">${company.stock_price.high_52_week} </Badge>
                                        <Badge> $ {company.stock_price.current} </Badge>
                                        <Badge className="bg-green-500">$ {company.stock_price.low_52_week} </Badge>
                                        </div>


                                    </div>
                                </div>
                            </div>

                        </div>

                        <Separator />
                        <div className="flex items-center p-4">
                            <div className="w-full flex items-center gap-4 text-sm">
                                <Tabs defaultValue="live" className="w-full" value={activeTab} onValueChange={setActiveTab}>
                                    <TabsList className="grid w-full grid-cols-3">
                                        <TabsTrigger value="live">Live</TabsTrigger>
                                        <TabsTrigger value="historical">Historical</TabsTrigger>
                                        <TabsTrigger value="forecast">Forecast</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="live" className="w-full">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Live Analysis</CardTitle>
                                                <CardDescription>
                                                    Real-time market analysis and AI insights
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-2">
                                                <TickerData company={company} />
                                                {isLoadingAnalysis ? (
                                                    <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
                                                        <div className="text-sm text-muted-foreground">
                                                            Loading analysis...
                                                        </div>
                                                    </div>
                                                ) : analysisError ? (
                                                    <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed border-destructive">
                                                        <div className="text-sm text-destructive">
                                                            {analysisError}
                                                        </div>
                                                    </div>
                                                ) : analysisData ? (
                                                    <LiveAnalysis data={analysisData} />
                                                ) : (
                                                    <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
                                                        <div className="text-sm text-muted-foreground">
                                                            <Button 
                                                                onClick={async () => {
                                                                    if (!company?.symbol) return;
                                                                    
                                                                    setIsLoadingAnalysis(true);
                                                                    setAnalysisError(null);
                                                                    
                                                                    try {
                                                                        const response = await fetch(`/api/analysis/${company.symbol}`);
                                                                        if (!response.ok) {
                                                                            throw new Error('Failed to fetch analysis');
                                                                        }
                                                                        const data = await response.json();
                                                                        if (!data.success) {
                                                                            throw new Error(data.error || 'Analysis failed');
                                                                        }
                                                                        setAnalysisData(data.data);
                                                                    } catch (error) {
                                                                        setAnalysisError(error instanceof Error ? error.message : 'Failed to perform analysis');
                                                                    } finally {
                                                                        setIsLoadingAnalysis(false);
                                                                    }
                                                                }}
                                                                disabled={isLoadingAnalysis || !company?.symbol}
                                                            >
                                                                Perform AI Analysis
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                    <TabsContent value="historical" className="w-full">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Historical Data For {company.symbol}</CardTitle>
                                                <CardDescription>
                                                    Unleashed AI will analyze the historical data and generate insights.
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-2">

                                               <HistoricalData data={data} company={company} />
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                    <TabsContent value="forecast" className="w-full">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Predictions</CardTitle>
                                                <CardDescription>
                                                    AI-powered market predictions and trend analysis.
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-2">
                                                <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
                                                    <div className="text-sm text-muted-foreground">
                                                        Coming soon - AI predictions and trend analysis
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>                                    
                                </Tabs>
                            </div>

                        </div>
                        <Separator />
                        <Separator className="mt-auto" />
                        <CommentSection comments={comments} setComments={setComments} />
                        <div className="p-4">
                            <form>
                                <div className="grid gap-4">
                                    <Textarea
                                        className="p-4"
                                        placeholder={`Reply ${company.name}...`}
                                    />
                                    <div className="flex items-center">
                                        <Label
                                            htmlFor="mute"
                                            className="flex items-center gap-2 text-xs font-normal"
                                        >
                                            <Switch id="mute" aria-label="Mute thread" /> Mute this
                                            thread
                                        </Label>
                                        <Button
                                            onClick={(e) => e.preventDefault()}
                                            size="sm"
                                            className="ml-auto"
                                        >
                                            Send
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </ScrollArea>

            ) : (
                <div className="p-8 text-center text-muted-foreground">
                    No company selected
                </div>
            )}
        </div>
    )
}