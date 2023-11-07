"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Thg 1",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Thg 2",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Thg 3",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Thg 4",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Thg 5",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Thg 6",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Thg 7",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Thg 8",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Thg 9",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Thg 10",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Thg 11",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Thg 12",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Bar dataKey="total" fill="#020817" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}