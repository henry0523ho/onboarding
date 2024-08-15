import dayjs from "dayjs";
import { useEffect, useState } from "react";
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
async function getData() {
  const monthData: Data[][] = [];
  for (let month = 3; month <= 5; month++) {
    const url = `http://localhost:3001/data/settle-value?startDate=${dayjs()
      .month(month - 1)
      .startOf("month")
      .format("YYYY-MM-DD")}&endDate=${dayjs()
      .month(month - 1)
      .endOf("month")
      .format("YYYY-MM-DD")}`;
    const response = await fetch(url);
    const data = (await response.json()) as Data[];
    monthData.push(data);
  }
  return monthData;
}
interface Part4Props {
  monthData: Data[][];
}

export async function getServerSideProps() {
  const data = await getData();
  return {
    props: { monthData:data },
  } as { props: Part4Props};
}

function Part4(props: Part4Props) {
  const [dataMonth, setDataMonth] = useState(3);
  const [showData, setShowData] = useState<Data[]>([]);
  useEffect(() => {
    setShowData(props.monthData[dataMonth-3]);
    return () => {};
  }, [dataMonth]);
  return (
    <div className="w-2/5 bg-secondary p-8 rounded-lg mt-6 text-center">
      <h1>{dataMonth}月的資料</h1>
      <button onClick={() => setDataMonth(3)}>3月</button>
      <button onClick={() => setDataMonth(4)}>4月</button>
      <button onClick={() => setDataMonth(5)}>5月</button>
      {(function () {
        // Empty state
        if (showData.length === 0) {
          return "No data";
        }
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={showData}
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

export default Part4;
