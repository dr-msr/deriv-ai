import StockChart, { StockData } from "../chart/chart"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Company } from "@/lib/company"
import { AlertCircle } from "lucide-react"

interface HistoricalData {
    data: StockData[]
    company: Company
}

const HistoricalData = ({ data, company }: HistoricalData) => {
    return (
        <div className="flex flex-col whitespace-pre-wrap p-4 text-sm">
            {data.length === 0 ? (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>No Historical Data</AlertTitle>
                    <AlertDescription>
                        No historical data found for this company. This could be due to the company being newly listed or data being temporarily unavailable.
                    </AlertDescription>
                </Alert>
            ) : (
                <div className="mt-4">
                    <StockChart data={data} company={company} />
                </div>
            )}
        </div>
    )
}

export default HistoricalData
