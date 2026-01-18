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
import Image from "next/image";

// Mock Data
const initialTeams = [
  { id: 1, name: "Manchester United", league: "Premier League", country: "England", logo: "/placeholder-logo.png" },
  { id: 2, name: "Liverpool FC", league: "Premier League", country: "England", logo: "/placeholder-logo.png" },
  { id: 3, name: "Real Madrid", league: "La Liga", country: "Spain", logo: "/placeholder-logo.png" },
  { id: 4, name: "FC Barcelona", league: "La Liga", country: "Spain", logo: "/placeholder-logo.png" },
  { id: 5, name: "Bayern Munich", league: "Bundesliga", country: "Germany", logo: "/placeholder-logo.png" },
];

export default function TeamsPage() {
  const [teams, setTeams] = useState(initialTeams);

  const handleDelete = (id: number) => {
    if(confirm("Are you sure you want to delete this team?")) {
        setTeams(teams.filter(team => team.id !== id));
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-800">Team Management</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">Add New Team</Button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Logo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>League</TableHead>
              <TableHead>Country</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.map((team) => (
              <TableRow key={team.id}>
                <TableCell className="font-medium">{team.id}</TableCell>
                <TableCell>
                    <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-xs text-gray-500 overflow-hidden relative">
                         {/* Replace with actual image in production */}
                         <span className="font-bold">{team.name.charAt(0)}</span>
                    </div>
                </TableCell>
                <TableCell className="font-medium">{team.name}</TableCell>
                <TableCell>{team.league}</TableCell>
                <TableCell>{team.country}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600">
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-600"
                        onClick={() => handleDelete(team.id)}
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
