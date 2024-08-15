import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useState } from "react";
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

async function getData(month: number = 3) {
  if (month === 4) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  const url = `/data/settle-value?startDate=${dayjs()
    .month(month - 1)
    .startOf("month")
    .format("YYYY-MM-DD")}&endDate=${dayjs()
    .month(month - 1)
    .endOf("month")
    .format("YYYY-MM-DD")}`;
  const response = await fetch(url);
  const data = (await response.json()) as Data[];
  return data;
}

function Part3() {
  const [dataMonth, setDataMonth] = useState(3);
  const { data, status, error } = useQuery({
    queryFn: () => getData(dataMonth),
    queryKey: [dataMonth],
  });
  return (
    <div className="w-2/5 bg-secondary p-8 rounded-lg mt-6 text-center">
      <h1>{dataMonth}月的資料</h1>
      <button onClick={() => setDataMonth(3)}>3月</button>
      <button onClick={() => setDataMonth(4)}>4月</button>
      <button onClick={() => setDataMonth(5)}>5月</button>
      {(function () {
        if (status === "error") {
          return "Error: " + error;
        }
        if (status === "pending") {
          return "Loading...";
        }

        // Empty state
        if (data.length === 0) {
          return "No data";
        }
        return (
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
        );
      })()}
    </div>
  );
}

export default Part3;
