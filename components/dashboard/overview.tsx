"use client";

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from "recharts";
import { useTheme } from "next-themes";

const data = [
  { name: "Jan", users: 40, courses: 24, pageViews: 240 },
  { name: "Feb", users: 30, courses: 13, pageViews: 139 },
  { name: "Mar", users: 20, courses: 8, pageViews: 980 },
  { name: "Apr", users: 27, courses: 10, pageViews: 390 },
  { name: "May", users: 18, courses: 7, pageViews: 480 },
  { name: "Jun", users: 23, courses: 11, pageViews: 380 },
  { name: "Jul", users: 34, courses: 15, pageViews: 430 },
  { name: "Aug", users: 38, courses: 19, pageViews: 520 },
  { name: "Sep", users: 45, courses: 22, pageViews: 590 },
  { name: "Oct", users: 53, courses: 25, pageViews: 630 },
  { name: "Nov", users: 57, courses: 30, pageViews: 710 },
  { name: "Dec", users: 60, courses: 32, pageViews: 830 },
];

export function Overview() {
  const { theme } = useTheme();
  
  // Use CSS variables for chart colors to support both light and dark themes
  const usersColor = "hsl(var(--chart-1))";
  const coursesColor = "hsl(var(--chart-2))";
  const pageViewsColor = "hsl(var(--chart-3))";
  
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis dataKey="name" fontSize={12} tickMargin={10} />
        <YAxis fontSize={12} tickMargin={10} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: theme === "dark" ? "hsl(var(--background))" : "white",
            borderColor: "hsl(var(--border))"
          }}
          labelStyle={{
            color: "hsl(var(--foreground))"
          }}
        />
        <Legend 
          verticalAlign="top" 
          height={36}
          wrapperStyle={{ paddingTop: "10px" }} 
        />
        <Area
          type="monotone"
          dataKey="pageViews"
          stroke={pageViewsColor}
          fill={pageViewsColor}
          fillOpacity={0.2}
          name="Page Views"
        />
        <Area
          type="monotone"
          dataKey="users"
          stroke={usersColor}
          fill={usersColor}
          fillOpacity={0.2}
          name="Users"
        />
        <Area
          type="monotone"
          dataKey="courses"
          stroke={coursesColor}
          fill={coursesColor}
          fillOpacity={0.2}
          name="Courses"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}