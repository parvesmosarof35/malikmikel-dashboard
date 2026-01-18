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
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";

// Mock Data
const initialStadiums = [
  { id: 1, name: "Unknown Stadium 1", capacity: 55000, city: "London" },
  { id: 2, name: "Unknown Stadium 2", capacity: 81000, city: "Madrid" },
  { id: 3, name: "Unknown Stadium 3", capacity: 99000, city: "Barcelona" },
  { id: 4, name: "Unknown Stadium 4", capacity: 75000, city: "Munich" },
  { id: 5, name: "Unknown Stadium 5", capacity: 74000, city: "Manchester" },
];

export default function StadiumsPage() {
  const [stadiums, setStadiums] = useState(initialStadiums);

  const handleDelete = (id: number) => {
    if(confirm("Are you sure you want to delete this stadium?")) {
        setStadiums(stadiums.filter(s => s.id !== id));
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-800">Stadium Management</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">Add Stadium</Button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Stadium Name</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>City</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stadiums.map((stadium) => (
              <TableRow key={stadium.id}>
                <TableCell className="font-medium">{stadium.id}</TableCell>
                <TableCell className="font-medium">{stadium.name}</TableCell>
                <TableCell>{stadium.capacity.toLocaleString()}</TableCell>
                <TableCell>{stadium.city}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600">
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-600"
                        onClick={() => handleDelete(stadium.id)}
                    >
                        <Trash2 className="h-4 w-4" />
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
