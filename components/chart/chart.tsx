"use client"

import { useState, useMemo, useEffect } from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ReferenceArea, Legend, Tooltip } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "../ui/card"
import { Company } from "@/lib/company"

export type StockData = {
  Date: string
  Open: number
  High: number
  Low: number
  Close: number
  Volume: number
}

export default function StockChart({ data, company }: { data: StockData[]; company: Company }) {
  const [left, setLeft] = useState<string | undefined>()
  const [right, setRight] = useState<string | undefined>()
  const [refAreaLeft, setRefAreaLeft] = useState<string | undefined>()
  const [refAreaRight, setRefAreaRight] = useState<string | undefined>()
  const [startDate, setStartDate] = useState<string>(data[0].Date)
  const [endDate, setEndDate] = useState<string>(data[data.length - 1].Date)
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const filteredData = useMemo(() => {
    return data.filter((item) => new Date(item.Date) >= new Date(startDate) && new Date(item.Date) <= new Date(endDate))
  }, [data, startDate, endDate])

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            startDate,
            endDate,
            symbol: company.symbol,
            stockData: filteredData,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }

        const data = await response.json();
        setEvents(data.events || []);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    setEvents([]);

    if (startDate && endDate && company.symbol) {
      fetchEvents();
    }
  }, [startDate, endDate, company.symbol, filteredData]);

  const zoomIn = () => {
    if (refAreaLeft && refAreaRight) {
      const [start, end] = [refAreaLeft, refAreaRight].sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

      setStartDate(start)
      setEndDate(end)
      setRefAreaLeft(undefined)
      setRefAreaRight(undefined)
    }
  }

  const zoomOut = () => {
    setStartDate(data[0].Date)
    setEndDate(data[data.length - 1].Date)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    return `${day}-${month}`
  }

  const chartConfig = {
    open: {
      label: "Open",
      color: "hsl(var(--chart-1))",
    },
    close: {
      label: "Close",
      color: "hsl(var(--chart-2))",
    },
    high: {
      label: "High",
      color: "hsl(var(--chart-3))",
    },
    low: {
      label: "Low",
      color: "hsl(var(--chart-4))",
    },
  }

  return (
    <div className="flex flex-col gap-2">
      <ChartContainer config={chartConfig} className="w-full max-h-[400px]">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-full items-center justify-center flex flex-wrap gap-4">
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              max={endDate}
              className="w-auto"
            />
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
              className="w-auto"
            />
            <Button onClick={zoomOut}>Reset Zoom</Button>
          </div>
          <div className="w-full flex flex-col items-center justify-center h-[300px] max-h-[300px]">
            <AreaChart
              width={768}
              height={300}
              data={filteredData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              onMouseDown={(e) => e && setRefAreaLeft(e.activeLabel)}
              onMouseMove={(e) => refAreaLeft && e && setRefAreaRight(e.activeLabel)}
              onMouseUp={zoomIn}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Date" tickFormatter={formatDate} />
              <YAxis domain={["auto", "auto"]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} />
              <Area
                type="monotone"
                dataKey="Open"
                name={chartConfig.open.label}
                stroke={chartConfig.open.color}
                fill="none"
              />
              <Area
                type="monotone"
                dataKey="Close"
                name={chartConfig.close.label}
                stroke={chartConfig.close.color}
                fill="none"
              />
              <Area
                type="monotone"
                dataKey="High"
                name={chartConfig.high.label}
                stroke={chartConfig.high.color}
                fill="none"
              />
              <Area
                type="monotone"
                dataKey="Low"
                name={chartConfig.low.label}
                stroke={chartConfig.low.color}
                fill="none"
              />
              {refAreaLeft && refAreaRight && (
                <ReferenceArea x1={refAreaLeft} x2={refAreaRight} strokeOpacity={0.3} />
              )}
            </AreaChart>
          </div>
        </div>
      </ChartContainer>
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-2">Analysis</h3>
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Opening Price</p>
              <p className="text-lg font-medium">${filteredData[0]?.Open.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Latest Price</p>
              <p className="text-lg font-medium">${filteredData[filteredData.length - 1]?.Close.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Period High</p>
              <p className="text-lg font-medium">${Math.max(...filteredData.map(d => d.High)).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Period Low</p>
              <p className="text-lg font-medium">${Math.min(...filteredData.map(d => d.Low)).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-2">Significant Events</h3>
        <div className="space-y-2">
          {loading ? (
            <div className="text-sm text-muted-foreground">Loading events...</div>
          ) : events.length > 0 ? (
            <div className="space-y-4">
              {events.map((event, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-medium">{event.headline}</h4>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                    <div className="text-right text-sm">
                      <div className="font-medium">Impact: {event.impact}/10</div>
                      <div className="text-muted-foreground">Probability: {event.probability}%</div>
                    </div>
                  </div>
                  {event.url && (
                    <a 
                      href={event.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs text-blue-500 hover:underline"
                    >
                      Read more
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              No significant events found for this period.
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const date = new Date(label)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const formattedDate = `${day}-${month}`
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="text-sm font-bold">{formattedDate}</div>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="text-xs">
            {entry.name}: ${entry.value.toFixed(2)}
          </div>
        ))}
      </div>
    )
  }

  return null
}
