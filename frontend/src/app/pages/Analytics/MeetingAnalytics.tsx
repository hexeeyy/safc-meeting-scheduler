'use client';

import { Calendar, CheckCircle2, XCircle } from 'lucide-react';
import { CalendarEvent } from '@/components/calendar/ReusableCalendar';
import { departments } from '@/components/calendar/calendarConstants';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

interface MeetingAnalyticsProps {
  events: CalendarEvent[];
}

export default function MeetingAnalytics({ events }: MeetingAnalyticsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const today = new Date();

  // Calculate analytics metrics
  const totalMeetings = events.length;
  const upcomingMeetings = events.filter((event) => event.start >= today && !event.canceled).length;
  const doneMeetings = events.filter((event) => event.end < today && !event.canceled).length;
  const canceledMeetings = events.filter((event) => event.canceled).length;

  // Meetings by department with filtering
  const meetingsByDepartment = departments.map((dept) => ({
    department: dept,
    count: events.filter((event) => event.department === dept).length,
    upcoming: events.filter((event) => event.department === dept && event.start >= today && !event.canceled).length,
    done: events.filter((event) => event.department === dept && event.end < today && !event.canceled).length,
    canceled: events.filter((event) => event.department === dept && event.canceled).length,
  }));

  // Filter meetings by search query and status
  const filteredMeetingsByDepartment = meetingsByDepartment
    .filter((item) => item.department.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((item) => {
      if (selectedStatus === 'all') return true;
      if (selectedStatus === 'upcoming') return item.upcoming > 0;
      if (selectedStatus === 'done') return item.done > 0;
      if (selectedStatus === 'canceled') return item.canceled > 0;
      return true;
    });

  return (
    <div className="p-6 bg-green-50 dark:bg-gray-900 min-h-screen">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-2xl font-semibold text-green-900 dark:text-green-100 font-poppins">
          Meeting Analytics
        </h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-white dark:bg-gray-800 border-green-300 dark:border-green-600">
          <CardHeader className="flex flex-row items-center gap-2">
            <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
            <CardTitle className="text-lg font-medium text-green-900 dark:text-green-100 font-poppins">
              Total Meetings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-700 dark:text-green-300">{totalMeetings}</p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800 border-green-300 dark:border-green-600">
          <CardHeader className="flex flex-row items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
            <CardTitle className="text-lg font-medium text-green-900 dark:text-green-100 font-poppins">
              Completed Meetings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-700 dark:text-green-300">{doneMeetings}</p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800 border-green-300 dark:border-green-600">
          <CardHeader className="flex flex-row items-center gap-2">
            <XCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            <CardTitle className="text-lg font-medium text-green-900 dark:text-green-100 font-poppins">
              Canceled Meetings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-700 dark:text-green-300">{canceledMeetings}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search departments..."
          className="border-green-300 dark:border-green-600 focus:border-green-500 text-green-900 dark:text-green-100 placeholder-gray-400 dark:placeholder-gray-500 font-poppins"
        />
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="border-green-300 dark:border-green-600 focus:border-green-500 text-green-900 dark:text-green-100 font-poppins">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Meetings</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="done">Completed</SelectItem>
            <SelectItem value="canceled">Canceled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Meetings by Department Table */}
      <Card className="bg-white dark:bg-gray-800 border-green-300 dark:border-green-600">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-green-900 dark:text-green-100 font-poppins">
            Meetings by Department
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-green-900 dark:text-green-100 font-poppins">Department</TableHead>
                <TableHead className="text-green-900 dark:text-green-100 font-poppins">Total</TableHead>
                <TableHead className="text-green-900 dark:text-green-100 font-poppins">Upcoming</TableHead>
                <TableHead className="text-green-900 dark:text-green-100 font-poppins">Completed</TableHead>
                <TableHead className="text-green-900 dark:text-green-100 font-poppins">Canceled</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMeetingsByDepartment.length > 0 ? (
                filteredMeetingsByDepartment.map((item) => (
                  <TableRow key={item.department}>
                    <TableCell className="text-green-800 dark:text-green-200 font-poppins">{item.department}</TableCell>
                    <TableCell className="text-green-800 dark:text-green-200 font-poppins">
                      <Badge variant="secondary" className="bg-green-200 dark:bg-green-700 text-green-900 dark:text-green-100">
                        {item.count}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-green-800 dark:text-green-200 font-poppins">{item.upcoming}</TableCell>
                    <TableCell className="text-green-800 dark:text-green-200 font-poppins">{item.done}</TableCell>
                    <TableCell className="text-green-800 dark:text-green-200 font-poppins">{item.canceled}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-green-800 dark:text-green-200 font-poppins">
                    No departments match the current filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}