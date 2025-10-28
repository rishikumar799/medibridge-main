'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  HeartPulse,
  MessageSquare,
  Siren,
  Users,
  TestTube,
  FlaskConical,
  Headset,
  CalendarCheck,
  User,
  Heart,
  LayoutGrid,
  Activity,
  Search,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { PregnantLadyIcon } from '@/components/icons/pregnant-lady-icon';
import { HealthOverview } from '../health-overview';
import { OrganHealthDialog } from '@/components/layout/organ-health-dialog';
import { organHealthData } from '@/lib/organ-health-data';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

// Quick Access Base Items (without Pregnancy Care)
const baseQuickAccessItems = [
  { href: '/patient/dashboard', icon: LayoutGrid, label: 'Dashboard', description: 'హోమ్', color: 'hsl(var(--nav-home))' },
  { href: '/patient/symptom-checker', icon: HeartPulse, label: 'AI Symptom Checker', description: 'వైద్య లక్షణాలు తనిఖీ', color: 'hsl(var(--nav-symptoms))' },
  { href: '/patient/appointments', icon: CalendarCheck, label: 'Appointments', description: 'సమయం నమోదు చేసుకోండి', color: 'hsl(var(--nav-appointments))' },
  { href: '/patient/opd-queue', icon: MessageSquare, label: 'OP STATUS', description: 'OP స్థితి', color: 'hsl(var(--nav-chat))' },
  { href: '/patient/lab-reports', icon: TestTube, label: 'Diagnostics', description: 'రిపోర్టులు చూడండి', color: 'hsl(var(--nav-diagnostics))' },
  { href: '/patient/medicines', icon: Users, label: 'My Medicines', description: 'మీ మందులు', color: 'hsl(var(--nav-medicines))' },
  { href: '/patient/blood-bank', icon: Users, label: 'Blood Bank', description: 'రక్త నిధి', color: 'hsl(var(--nav-blood-bank))' },
  { href: '/patient/health-tracker', icon: Activity, label: 'Health Tracker', description: 'ఆరోగ్య ట్రాకర్', color: 'hsl(var(--nav-profile))' },
  { href: '/patient/junior-doctors', icon: Headset, label: '24/7 Jr. Doctors', description: 'ఉచిత సలహా', color: 'hsl(var(--nav-junior-doctors))' },
  { href: '/patient/profile', icon: User, label: 'Profile', description: 'ప్రొఫైల్', color: 'hsl(var(--nav-profile))' },
  { href: '/patient/emergency', icon: Siren, label: 'Emergency', description: 'తక్షణ సహాయం', color: 'hsl(var(--nav-emergency))' },
];

// Medicine Assistance
const medicineAssistanceItems = [
  { icon: FlaskConical, title: 'AI Medicine Assistant', description: 'Get instant answers about your medications.', buttonText: 'Ask AI', href: '/patient/medicine-assistant' },
  { icon: Users, title: 'Pharmacist Consultation', description: 'Speak with a licensed pharmacist for expert advice.', buttonText: 'Consult', href: '#' },
];

// Circular Progress Component
const CircularProgress = ({
  percentage,
  children,
  size = 100,
  strokeWidth = 8,
  color,
}: {
  percentage: number;
  children: React.ReactNode;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          className="text-muted/30"
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke={color || 'hsl(var(--primary))'}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute">{children}</div>
    </div>
  );
};

export default function DashboardPage() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingBloodGroup, setEditingBloodGroup] = useState(false);
  const [newBloodGroup, setNewBloodGroup] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUserData(null);
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData({ ...data, uid: currentUser.uid });
          setNewBloodGroup(data?.bloodGroup || '');
        } else {
          setUserData({ uid: currentUser.uid });
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleUpdateBloodGroup = async () => {
    if (!newBloodGroup) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select a blood group.',
      });
      return;
    }

    try {
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error('Not authenticated');

      const docRef = doc(db, 'users', uid);
      await updateDoc(docRef, { bloodGroup: newBloodGroup });
      setUserData((prev: any) => ({ ...prev, bloodGroup: newBloodGroup }));
      setEditingBloodGroup(false);

      toast({
        title: 'Blood Group Updated',
        description: 'Your blood group has been updated successfully.',
      });
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: err?.message || 'Error occurred.',
      });
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  // Build quick access list dynamically
  const quickAccessItems = [
    ...baseQuickAccessItems,
    ...(userData?.gender?.toLowerCase() === 'female'
      ? [{
          href: '/patient/pregnancy-tracker',
          icon: PregnantLadyIcon,
          label: 'Pregnancy Care',
          description: 'గర్భం',
          color: 'hsl(var(--nav-appointments))',
        }]
      : [])
  ];

  return (
    <div className="space-y-8">
      {/* Search */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search for doctors, medicines, reports..." className="pl-10 h-12 text-base" />
        </div>
      </div>

      {/* User Info */}
      <Card className="bg-primary text-primary-foreground">
        <CardContent className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary-foreground/50">
              <AvatarImage src="/images/profile.jpg" />
              <AvatarFallback>
                {userData?.firstName?.[0] || 'U'}
                {userData?.lastName?.[0] || 'N'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">
                {userData?.firstName || 'User'} {userData?.lastName || ''}
              </h2>
              <p className="text-sm opacity-80">Patient ID: {userData?.uid?.slice(0, 6)?.toUpperCase() || '—'}</p>
            </div>
          </div>

          {/* Blood Group Edit */}
          <div className="text-right flex flex-col items-end gap-2">
            {editingBloodGroup ? (
              <div className="flex gap-2 items-center">
                <select
                  className="border px-2 py-1 rounded text-black"
                  value={newBloodGroup}
                  onChange={(e) => setNewBloodGroup(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
                <Button size="sm" onClick={handleUpdateBloodGroup}>Save</Button>
                <Button size="sm" onClick={() => setEditingBloodGroup(false)}>Cancel</Button>
              </div>
            ) : (
              <>
                <p className="font-bold text-lg">{userData?.bloodGroup || 'Not Set'}</p>
                <p className="text-sm opacity-80">Blood Group</p>
                <Button size="sm" onClick={() => setEditingBloodGroup(true)}>Edit</Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Organ Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: 'hsl(var(--primary))' }}>
            <Heart style={{ color: 'hsl(var(--primary))' }} />
            Organ Health Overview
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            <p>A summary of your key organ health based on recent reports.</p>
            <p>మీ గత నివేదికల ప్రకారం, మీ ముఖ్య అవయవాల ఆరోగ్య స్థితి యొక్క సారాంశం ఇది.</p>
          </div>
        </CardHeader>

        <CardContent className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {organHealthData.map((organ) => (
            <OrganHealthDialog key={organ.name} organ={organ}>
              <Card className="p-2 flex flex-col items-center text-center cursor-pointer hover:bg-muted/50">
                <CircularProgress percentage={organ.health} size={80} strokeWidth={6} color={organ.color}>
                  <Image src={organ.image} alt={organ.name} width={40} height={40} className="rounded-full object-cover" />
                </CircularProgress>
                <p className="mt-2 text-sm font-bold">{organ.name}</p>
                <p className="font-semibold text-base" style={{ color: organ.color }}>
                  {organ.health}%
                </p>
                <p className="text-xs text-muted-foreground">Healthy</p>
              </Card>
            </OrganHealthDialog>
          ))}
        </CardContent>
      </Card>

      {/* Quick Access */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {quickAccessItems.map((item) => (
            <Link key={item.href} href={item.href} prefetch={false}>
              <Card className="text-center p-4 hover:bg-muted/50 transition-colors cursor-pointer h-full flex flex-col items-center justify-center aspect-square">
                <div
                  className="p-3 rounded-full mb-3"
                  style={{ backgroundColor: `${item.color.replace(')', ' / 0.1)')}` }}
                >
                  <item.icon className="h-10 w-10" style={{ color: item.color }} />
                </div>
                <p className="font-bold text-sm">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Health & Medicine Assistance */}
      <div className="grid md:grid-cols-2 gap-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Health Overview</h2>
          <HealthOverview />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Medicine Assistance</h2>
          <div className="space-y-4">
            {medicineAssistanceItems.map((item) => (
              <Link key={item.title} href={item.href} prefetch={false}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <Button size="sm" variant="ghost" style={{ color: 'hsl(var(--nav-medicines))' }}>
                      {item.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
