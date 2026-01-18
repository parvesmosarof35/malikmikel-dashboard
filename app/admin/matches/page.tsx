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
import { Edit, Trash2, Calendar, MapPin } from "lucide-react";
import { useState } from "react";

// Mock Data
const initialMatches = [
  { id: 1, home: "Manchester United", away: "Liverpool", date: "2024-03-15", stadium: "Old Trafford", status: "Scheduled" },
  { id: 2, home: "Real Madrid", away: "Barcelona", date: "2024-03-20", stadium: "Santiago Bernabéu", status: "Sold Out" },
  { id: 3, home: "Bayern Munich", away: "Dortmund", date: "2024-03-22", stadium: "Allianz Arena", status: "Scheduled" },
  { id: 4, home: "PSG", away: "Marseille", date: "2024-03-25", stadium: "Parc des Princes", status: "Live" },
  { id: 5, home: "Arsenal", away: "Chelsea", date: "2024-03-28", stadium: "Emirates Stadium", status: "Finished" },
];

export default function MatchesPage() {
  const [matches, setMatches] = useState(initialMatches);

  const handleDelete = (id: number) => {
    if(confirm("Are you sure you want to delete this match?")) {
        setMatches(matches.filter(match => match.id !== id));
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Match Management</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">Create New Match</Button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Stadium</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {matches.map((match) => (
              <TableRow key={match.id}>
                <TableCell className="font-medium">#{match.id}</TableCell>
                <TableCell>
                    <div className="flex flex-col">
                        <span className="font-semibold">{match.home} vs {match.away}</span>
                    </div>
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {match.date}
                    </div>
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {match.stadium}
                    </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    className={
                        match.status === 'Scheduled' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' : 
                        match.status === 'Live' ? 'bg-red-100 text-red-700 hover:bg-red-100 animate-pulse' :
                        match.status === 'Finished' ? 'bg-gray-100 text-gray-700 hover:bg-gray-100' :
                        'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                    }
                    variant="outline"
                  >
                    {match.status}
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
                        onClick={() => handleDelete(match.id)}
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
