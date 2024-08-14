import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import React, { useState, useEffect, ReactNode } from "react";
interface Data {
  tranDate: string;
  tranHour: string;
  regBid: number;
  regBidQse: number;
  regPrice: number;
  edregBid: number;
  edregPrice: number;
  srBid: number;
  srBidQse: number;
  srPrice: number;
  supBid: number;
  supBidQse: number;
  supPrice: number;
}

async function getData(month: number) {
  const upperBound = ["31", "30", "31"];
  const url = `http://localhost:3000/data/settle-value?startDate=2024-${month
    .toString()
    .padStart(2, "0")}-01&endDate=2024-${month.toString().padStart(2, "0")}-${
    upperBound[month - 3]
  }`;
  const response = await fetch(url);
  const data = (await response.json()) as Data[];
  return data;
}
export default function Part1() {
  const [data, setData] = useState<Data[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [dataMonth, setDataMonth] = useState(3);
  useEffect(() => {
    console.log("fetching data");
    setData(null);
    setIsLoading(true);
    setDataError(null);
    getData(dataMonth)
      .then((responseData) => {
        setData(responseData);
        setIsLoading(false);
      })
      .catch((err) => {
        setDataError(err.message);
      });
  }, [dataMonth]);

  if (dataError !== null) {
    return "Error: " + dataError;
  }
  if (isLoading) {
    return "Loading...";
  }

  // Empty state
  if (data === null || data.length === 0) {
    return "No data";
  }

  return (
    <div className="w-2/5 bg-secondary p-8 rounded-lg mt-6 text-center">
      <h1>{dataMonth}月的資料</h1>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="tranDate" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="srBid"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <button onClick={() => setDataMonth(3)}>3月</button>
      <button onClick={() => setDataMonth(4)}>4月</button>
      <button onClick={() => setDataMonth(5)}>5月</button>
    </div>
  );
}
