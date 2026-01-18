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
const initialUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User", status: "Active" },
  { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "User", status: "Inactive" },
  { id: 4, name: "Sarah Williams", email: "sarah@example.com", role: "Editor", status: "Active" },
  { id: 5, name: "David Brown", email: "david@example.com", role: "User", status: "Banned" },
];

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers);

  const handleDelete = (id: number) => {
    if(confirm("Are you sure you want to delete this user?")) {
        setUsers(users.filter(user => user.id !== id));
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">Add New User</Button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                    <Badge variant="outline" className={user.role === 'Admin' ? 'bg-blue-50 text-blue-700 hover:bg-blue-50' : ''}>
                        {user.role}
                    </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    className={
                        user.status === 'Active' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 
                        user.status === 'Inactive' ? 'bg-gray-100 text-gray-700 hover:bg-gray-100' :
                        'bg-red-100 text-red-700 hover:bg-red-100'
                    }
                    variant="secondary"
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600">
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-600"
                        onClick={() => handleDelete(user.id)}
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
