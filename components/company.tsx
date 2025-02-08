
import { cn } from "@/lib/utils"
import { Badge } from "./ui/badge"
import { ScrollArea } from "./ui/scroll-area"
import { Company } from "@/lib/company"
import { useState } from "react"

interface CompanyListProps {
  companies: Company[]
  setSelected: (company: Company | null) => void
}

export function CompanyList({ companies, setSelected }: CompanyListProps) {
  const [company, setCompany] = useState<Company>(companies[0])

  return (
    <ScrollArea className="h-screen">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {companies.map((item) => (
          <button
            key={item.symbol}
            className={cn(
              "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
              company.symbol === item.symbol && "bg-muted"
            )}
            onClick={() =>{
                setCompany(item)
                setSelected(item)
            }
            }
          >
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center">
                <div className="w-full flex flex-row justify-between gap-2">
                  <div className="font-semibold">{item.name}</div>
                  <div className="flex flex-row gap-2">
                    <Badge>{item.exchange}</Badge>

                  <Badge variant="secondary">{item.symbol}</Badge>
                    </div>
                </div>
                <div
                  className={cn(
                    "ml-auto text-xs",
                    company.symbol === item.symbol
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                </div>
              </div>
              <div className="text-xs font-medium">{item.industry}</div>
            </div>
            <div className="line-clamp-2 text-xs text-muted-foreground">
              {item.description.substring(0, 300)}
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  )
}
