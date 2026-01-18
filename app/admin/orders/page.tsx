"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";
import { useState } from "react";

// Mock Data
const initialOrders = [
  { id: "#ORD-001", user: "John Doe", match: "Man Utd vs Liverpool", amount: "$150.00", date: "2024-03-01", status: "Completed" },
  { id: "#ORD-002", user: "Jane Smith", match: "Real Madrid vs Barcelona", amount: "$320.00", date: "2024-03-02", status: "Processing" },
  { id: "#ORD-003", user: "Mike Johnson", match: "PSG vs Marseille", amount: "$90.00", date: "2024-03-02", status: "Failed" },
  { id: "#ORD-004", user: "David Brown", match: "Arsenal vs Chelsea", amount: "$180.00", date: "2024-03-03", status: "Completed" },
  { id: "#ORD-005", user: "Sarah Williams", match: "Bayern vs Dortmund", amount: "$210.00", date: "2024-03-03", status: "Pending" },
];

export default function OrdersPage() {
  const [orders] = useState(initialOrders);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-800">Order Management</h1>
        <Button variant="outline">Export CSV</Button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Match</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.user}</TableCell>
                <TableCell>{order.match}</TableCell>
                <TableCell>{order.amount}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>
                  <Badge 
                    className={
                        order.status === 'Completed' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' :
                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100' :
                        'bg-red-100 text-red-700 hover:bg-red-100'
                    }
                    variant="outline"
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                        <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
