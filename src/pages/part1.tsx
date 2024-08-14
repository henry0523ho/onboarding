"use client";
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
import React, { useState, useEffect } from "react";
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

async function getData() {
  const url =
    "http://localhost:3000/data/settle-value?startDate=2024-03-05&endDate=2024-03-10";
  const response = await fetch(url);
  const data = (await response.json()) as Data[];
  return data;
}
export default function Part1() {
  const [data, setData] = useState<Data[]|null>(null);
  const [dataError, setDataError] = useState<string>("");
  useEffect(() => {
    getData()
      .then((responseData) => setData(responseData))
      .catch((err) => {
        setDataError(err.message);
      });
  }, []);
  return (
    <div>
      {dataError === "" ? (
        data ? (
          <div className="w-2/5 bg-secondary p-8 rounded-lg mt-6 text-center">
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
          </div>
        ) : (
          "Loading..."
        )
      ) : (
        "error:" + dataError
      )}
    </div>
  );
}
