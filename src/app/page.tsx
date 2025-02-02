'use client'

import DynamicTable from "./components/table";
import { useEffect, useState } from "react";

const columns = ["id", "name", "email", "role", "createdAt"];
const columnDisplayMap = {
  id: "ID",
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
    <div className="bg-gray-900 text-white min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-semibold text-center mb-8">User Data</h1>
        <DynamicTable columns={columns} rows={rows} columnDisplayMap={columnDisplayMap} />
      </div>
    </div>
  );
}
