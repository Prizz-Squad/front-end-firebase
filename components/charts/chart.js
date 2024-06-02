import { useTheme } from "next-themes"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  {
    revenue: 10400,
    subscription: 240,
  },
  {
    revenue: 14405,
    subscription: 300,
  },
  {
    revenue: 9400,
    subscription: 200,
  },
  {
    revenue: 8200,
    subscription: 278,
  },
  {
    revenue: 7000,
    subscription: 189,
  },
  {
    revenue: 9600,
    subscription: 239,
  },
  {
    name: "Jul",
    revenue: 11244,
    subscription: 278,
  },
  {
    name: "Jan",
    revenue: 26475,
    subscription: 189,
  },
]

export function CardsStats({
  data,
  xDataKey,
  yDataKey,
  title,
  subTitle,
  description,
}) {
  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-normal">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{subTitle}</div>
          <p className="text-xs text-muted-foreground">
            {/* +180.1% from last month */}
            {description}
          </p>
          <div className="mt-4 h-[80px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey={xDataKey} />
                <Bar
                  dataKey={yDataKey}
                  style={{
                    fill: "var(--theme-primary)",
                    opacity: 1,
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
