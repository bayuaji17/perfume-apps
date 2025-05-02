"use client";
import EditPerfume from "@/components/admin-component/perfumes/edit-perfume";
import { use } from "react";

export default function EditPerfumePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <div>
      <h1>EditPerfume</h1>
      <EditPerfume id={id} />
    </div>
  );
}
