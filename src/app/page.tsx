'use client'

import DynamicTable from "./components/table";
import { useEffect, useState } from "react";

const columns = ["ID", "name", "email", "role", "createdAt"];
const columnDisplayMap = {
  ID: "ID",
  name: "Full Name",
  email: "Email Address",
  role: "User Role",
  createdAt: "Date Created",
};

export default function Home() {
  const [rows, setRows] = useState<Record<string, any>[]>([]);

  useEffect(() => {
    fetch("/data.json")
      .then((response) => response.json())
      .then((data) => setRows(data));
  }, []);

  return (
    <div className="">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-semibold text-center mb-8">User Data</h1>
        <DynamicTable columns={columns} rows={rows} columnDisplayMap={columnDisplayMap} />
      </div>
    </div>
  );
}
