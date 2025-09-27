'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Request = {
  id: string;
  type: string;
  name: string;
  status: 'Pending' | 'Approved' | 'Rejected';
};

const dummyRequests: Request[] = [
  { id: 'REQ001', type: 'Doctor Signup', name: 'Dr. Kevin Lee', status: 'Pending' },
  { id: 'REQ002', type: 'Hospital Registration', name: 'Sunrise Hospital', status: 'Pending' },
  { id: 'REQ003', type: 'Receptionist Signup', name: 'Mary Jane', status: 'Approved' },
  { id: 'REQ004', type: 'Lab Technician Signup', name: 'John Doe', status: 'Rejected' },
];

export default function RequestsPage() {
  const [requests, setRequests] = useState(dummyRequests);
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');

  const handleAction = (id: string, action: 'Approved' | 'Rejected') => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: action } : req))
    );
  };

  const filteredRequests =
    filter === 'All' ? requests : requests.filter((r) => r.status === filter);

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Requests Dashboard</h1>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2">
        {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            onClick={() => setFilter(f)}
          >
            {f}
          </Button>
        ))}
      </div>

      {/* Requests Table */}
      <Card className="rounded-2xl border border-border bg-white/70 dark:bg-neutral-900/60 backdrop-blur-sm shadow-sm">
        <CardHeader>
          <CardTitle>All Requests</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="text-left p-3">Request ID</th>
                <th className="text-left p-3">Type</th>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Status</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((r, i) => (
                <tr
                  key={r.id}
                  className={`${
                    i % 2 === 0 ? 'bg-muted/20' : ''
                  } border-b hover:bg-muted/30 transition-colors`}
                >
                  <td className="p-3 font-medium">{r.id}</td>
                  <td className="p-3">{r.type}</td>
                  <td className="p-3">{r.name}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        r.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : r.status === 'Approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    {r.status === 'Pending' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-green-50 text-green-700 hover:bg-green-100"
                          onClick={() => handleAction(r.id, 'Approved')}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-red-50 text-red-700 hover:bg-red-100"
                          onClick={() => handleAction(r.id, 'Rejected')}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
