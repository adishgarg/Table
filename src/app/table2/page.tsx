'use client'

import DynamicTable from "../components/table";
import { useEffect, useState } from "react";

const columns = ["id", "product", "category", "price", "stock", "releaseDate", "rating"];
const columnDisplayMap = {
    id: "ID",
    product: "Product",
    category: "Category",
    price: "Price",
    stock: "Stock",
    releaseDate: "Release Date",
    rating: "Rating"
  };

export default function Home() {
  const [rows, setRows] = useState<Record<string, any>[]>([]);

  useEffect(() => {
    fetch("/data2.json")
      .then((response) => response.json())
      .then((data) => setRows(data));
  }, []);

  return (
    <>
    <div className="">
      <DynamicTable columns={columns} rows={rows} columnDisplayMap={columnDisplayMap}/>
    </div>
    </>
  );
}
