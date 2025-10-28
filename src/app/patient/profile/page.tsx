'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Heart,
  MapPin,
  Pencil,
  Shield,
  FileDown,
  Trash2,
  Palette,
  ShieldAlert,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { HealthOverview } from '../health-overview';

// Sample Data
const recentVisits = [
  { date: "2024-07-15", reason: "Fever & Cold", doctor: "Dr. Shashank" },
  { date: "2024-06-20", reason: "Regular Checkup", doctor: "Dr. Siva Parvathi" },
  { date: "2024-03-10", reason: "Stomach Pain", doctor: "Dr. Nageswarao" },
];

const medicalReports = [
  { name: "Complete Blood Count", date: "2024-07-15" },
  { name: "Lipid Profile", date: "2024-06-20" },
  { name: "X-Ray Chest", date: "2023-11-05" },
];

const networkHospitals = [
  { name: "Ahalya Ivf And Nursing Home", address: "Backside Sivalayam, Kothapet ( City - Guntur )" },
  { name: "Amar Orthopaedic Hospital", address: "13-2-12, 1St Lane, Old Club Road, Kothapet" },
];

interface UserProfile {
  firstName: string;
  lastName: string;
  age: number | '';
  gender: string;
  bloodGroup: string;
  address: string;
  email: string;
  phone: string;
  uid?: string;
}

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [form, setForm] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    bloodGroup: '',
    address: '',
    email: '',
    phone: '',
  });

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data() as UserProfile;
          setUserData({ ...data, uid: user.uid });
          setForm(data);
          setEditing(false);
        } else {
          setEditing(true); // No data yet
        }
      } else {
        setEditing(true);
        setUserData(null);
      }
    });

    return () => unsubscribe(); // Cleanup
  }, []);

  const startEditing = () => {
    if (userData) setForm(userData);
    setEditing(true);
  };

const handleUpdate = async () => {
  if (!auth.currentUser) return;

  try {
    const userDocRef = doc(db, "users", auth.currentUser.uid);
    await setDoc(userDocRef, form, { merge: true });

   
    window.location.reload();
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("Failed to update profile. Please try again.");
  }
};


  const handleDownloadData = () => {
    const data = { profile: userData, recentVisits, medicalReports };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "profile-data.json";
    link.click();
  };

  const filteredHospitals = networkHospitals.filter(hospital =>
    hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hospital.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Profile Card */}
      <Card>
        <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
          <Avatar className="h-28 w-28 border-4" style={{ borderColor: 'hsl(var(--nav-profile))' }}>
            <AvatarImage src="/images/profile.jpg" />
            <AvatarFallback className="text-3xl">
              {userData?.firstName?.[0] || 'U'}{userData?.lastName?.[0] || 'N'}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 text-center md:text-left space-y-2">
            {editing ? (
              <div className="grid md:grid-cols-2 gap-4">
                <Input placeholder="First Name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                <Input placeholder="Last Name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                <Input placeholder="Age" type="number" value={form.age} onChange={(e) => setForm({ ...form, age: Number(e.target.value) || '' })} />
                <Select value={form.gender} onValueChange={(value) => setForm({ ...form, gender: value })}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Gender" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={form.bloodGroup} onValueChange={(value) => setForm({ ...form, bloodGroup: value })}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Blood Group" /></SelectTrigger>
                  <SelectContent>
                    {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(bg => (
                      <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold">{userData?.firstName} {userData?.lastName}</h2>
                <p className="text-sm opacity-80">Patient ID: {userData?.uid?.slice(0,6).toUpperCase()}</p>
                <p className="text-sm">Blood Group: {userData?.bloodGroup || "Not Set"}</p>
                <p className="text-sm">Email: {userData?.email}</p>
                <div className="flex flex-wrap justify-start gap-x-4 gap-y-2 text-muted-foreground mt-2">
                  <div className="flex items-center gap-2"><User /> {userData?.age} years old</div>
                  <div className="flex items-center gap-2"><Heart /> {userData?.gender}</div>
                  <div className="flex items-center gap-2"><MapPin /> {userData?.address}</div>
                </div>
              </>
            )}
          </div>

          <div>
            {editing ? (
              <div className="flex flex-col gap-2">
                <Button type="button" onClick={handleUpdate} className="border-2 border-white text-white rounded-md px-4 py-1 hover:bg-[#615EFC]">Save</Button>
                <Button type="button" onClick={() => setEditing(false)} className="border-2 border-white text-white rounded-md px-4 py-1 hover:bg-[#615EFC]">Cancel</Button>
              </div>
            ) : (
              <Button type="button" onClick={startEditing} className="border-2 border-white text-white rounded-md px-4 py-1 hover:bg-[#615EFC]">
                <Pencil className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bottom Sections */}
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Health Overview</h2>
            <HealthOverview />
          </section>

          <Card>
            <CardHeader>
              <CardTitle>Health Insurance</CardTitle>
              <CardDescription>Star Health - Family Plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 font-semibold text-lg">
                <Shield style={{color: 'hsl(var(--nav-profile))'}}/> Status: 
                <Badge className="bg-green-100 text-green-800 text-base">Active</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Settings & Data */}
          <Card>
            <CardHeader><CardTitle>Settings & Data</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {/* Theme */}
              <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                <div className="flex items-center gap-3">
                  <Palette className="h-5 w-5" style={{color: 'hsl(var(--nav-profile))'}}/>
                  <p className="font-semibold">Theme</p>
                </div>
                <ThemeToggle />
              </div>

              {/* Export Data */}
              <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileDown className="h-5 w-5" style={{color: 'hsl(var(--nav-profile))'}}/>
                  <p className="font-semibold">Export My Data</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleDownloadData}>Download</Button>
              </div>

              {/* Logout */}
              <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5" style={{color: 'hsl(var(--nav-profile))'}}/>
                  <p className="font-semibold">Logout</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={async () => {
                    await auth.signOut();
                    window.location.href = "/";
                  }}
                >
                  Logout
                </Button>
              </div>

              {/* Delete Account */}
              <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                <div className="flex items-center gap-3">
                  <Trash2 className="h-5 w-5 text-destructive"/>
                  <p className="font-semibold">Account</p>
                </div>
                <Button variant="destructive" size="sm">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <Card>
            <CardHeader><CardTitle>Recent Visits</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {recentVisits.map((visit, index) => (
                  <li key={index} className="flex justify-between items-center p-3 bg-muted/40 rounded-lg">
                    <div>
                      <p className="font-semibold">{visit.reason}</p>
                      <p className="text-sm text-muted-foreground">{visit.doctor}</p>
                    </div>
                    <p className="text-sm font-medium">{visit.date}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Medical Reports</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {medicalReports.map((report, index) => (
                  <li key={index} className="flex justify-between items-center p-3 border-b last:border-b-0">
                    <div>
                      <p className="font-semibold">{report.name}</p>
                      <p className="text-sm text-muted-foreground">Date: {report.date}</p>
                    </div>
                    <Button variant="outline" size="sm"><FileDown className="mr-2 h-4 w-4" />Download</Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Button variant="destructive" className="w-full"><ShieldAlert className="mr-2 h-4 w-4" /> Manage Emergency Contacts</Button>
        </div>
      </div>
    </div>
  );
}
