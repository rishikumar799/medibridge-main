'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { LucideProps } from "lucide-react";
import {
  HeartPulse,
  MessageSquare,
  Siren,
  User,
  TestTube,
  Pill,
  CalendarCheck,
  LayoutGrid,
  Headset,
  Activity,
  ChevronRight,
  Heart,
  ChevronLeft,
  Droplets,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "../ui/button";
export const PregnantLadyIcon = React.forwardRef<SVGSVGElement, LucideProps>((props, ref) => (
  <svg
    ref={ref}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="6" r="2" />
    <path d="M12 8c-2 0-4 2-4 4v5h8v-5c0-2-2-4-4-4z" />
  </svg>
));

PregnantLadyIcon.displayName = "PregnantLadyIcon";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const defaultMenuItems = [
  { href: "/patient/dashboard", label: "Home", telugu: "హోమ్", icon: LayoutGrid, color: "hsl(var(--nav-home))" },
  { href: "/patient/symptom-checker", label: "AI Symptom Checker", telugu: "లక్షణాలు", icon: HeartPulse, color: "hsl(var(--nav-symptoms))" },
  { href: "/patient/appointments", label: "Appointments", telugu: "నమోదులు", icon: CalendarCheck, color: "hsl(var(--nav-appointments))" },
  { href: "/patient/opd-queue", label: "OP STATUS", telugu: "OP స్థితి", icon: MessageSquare, color: "hsl(var(--nav-chat))" },
  { href: "/patient/lab-reports", label: "Diagnostics", telugu: "రిపోర్టులు", icon: TestTube, color: "hsl(var(--nav-diagnostics))" },
  { href: "/patient/medicines", label: "Medicines", telugu: "మందులు", icon: Pill, color: "hsl(var(--nav-medicines))" },
  { href: "/patient/blood-bank", label: "Blood Bank", telugu: "రక్త నిధి", icon: Droplets, color: "hsl(var(--nav-blood-bank))" },
  { href: "/patient/health-tracker", label: "Health Tracker", telugu: "ఆరోగ్య ట్రాకర్", icon: Heart, color: "hsl(var(--nav-profile))" },
  { href: "/patient/junior-doctors", label: "Jr. Doctors", telugu: "డాక్టర్లు", icon: Headset, color: "hsl(var(--nav-junior-doctors))" },
  { href: "/patient/profile", label: "Profile", telugu: "ప్రొఫైల్", icon: User, color: "hsl(var(--nav-profile))" },
  { href: "/patient/emergency", label: "Emergency", telugu: "తక్షణ సహాయం", icon: Siren, color: "hsl(var(--destructive))" },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = React.useState(false);
  const [userGender, setUserGender] = React.useState<string | null>(null);

  React.useEffect(() => {
    setIsClient(true);

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUserGender(null);
        return;
      }

      try {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserGender(data?.gender || null);
        } else {
          setUserGender(null);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setUserGender(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const menuItems = React.useMemo(() => {
    let items = [...defaultMenuItems];
    // Insert Pregnancy Care for female users only
    if (userGender?.toLowerCase() === "female") {
      items.splice(9, 0, {
        href: "/patient/pregnancy-tracker",
        label: "Pregnancy Care",
        telugu: "గర్భం",
        icon: PregnantLadyIcon,
        color: "hsl(var(--nav-appointments))",
      });
    }
    return items;
  }, [userGender]);

  const handleScrollRight = () => {
    if (viewportRef.current) {
      viewportRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  const handleScrollLeft = () => {
    if (viewportRef.current) {
      viewportRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between p-3 bg-background border-b border-t-4 border-t-primary">
        <img src="/images/MEDIBRIDGE.png" alt="MedBridge Logo" className="h-8 object-contain" />
        <Avatar className="h-8 w-8">
          <AvatarImage src="/images/profile.jpg" />
          <AvatarFallback>CLB</AvatarFallback>
        </Avatar>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24">{children}</main>

      {/* Footer Navigation */}
      <footer className="sticky bottom-0 z-20 mt-auto bg-background border-t">
        <div className="relative">
          <div className="absolute top-0 left-0 h-full flex items-center pl-2 bg-gradient-to-r from-background to-transparent w-12 z-10">
            <Button variant="ghost" size="icon" className="bg-muted rounded-full h-8 w-8" onClick={handleScrollLeft}>
              <ChevronLeft className="h-5 w-5 text-foreground" />
            </Button>
          </div>

          <ScrollArea className="w-full" viewportRef={viewportRef}>
            <nav className="flex w-max space-x-1 p-2 px-12 justify-center">
              {menuItems.map((item) => {
                const isActive = isClient && pathname === item.href;
                const isSpecial = item.label === "Emergency" || item.label === "Blood Bank";
                const specialColor = item.label === "Emergency" ? "hsl(var(--destructive))" : "hsl(var(--nav-blood-bank))";

                return (
                  <Link href={item.href} key={item.label} className="flex-shrink-0">
                    <div
                      className={cn(
                        "flex flex-col items-center justify-center gap-1 rounded-lg transition-transform duration-200 ease-in-out w-24 py-1",
                        isActive ? "scale-105" : "scale-100",
                        isSpecial ? "bg-destructive/10" : "",
                        item.label === "Blood Bank" && "bg-red-500/10"
                      )}
                    >
                      <div
                        className="p-2 rounded-full"
                        style={{
                          backgroundColor: isActive && !isSpecial ? `${item.color.replace(")", " / 0.1)")}` : "transparent",
                        }}
                      >
                        <item.icon className="h-6 w-6" style={{ color: isSpecial ? specialColor : item.color }} />
                      </div>
                      <div className="text-center leading-tight">
                        <p
                          className="text-xs font-bold"
                          style={{
                            color: isActive || isSpecial ? (isSpecial ? specialColor : item.color) : "hsl(var(--foreground))",
                          }}
                        >
                          {item.label}
                        </p>
                        <p
                          className="text-[10px] font-medium"
                          style={{
                            color: isActive || isSpecial ? (isSpecial ? specialColor : item.color) : "hsl(var(--muted-foreground))",
                          }}
                        >
                          {item.telugu}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </nav>
            <ScrollBar orientation="horizontal" className="invisible" />
          </ScrollArea>

          <div className="absolute top-0 right-0 h-full flex items-center pr-2 bg-gradient-to-l from-background to-transparent w-12">
            <Button variant="ghost" size="icon" className="bg-muted rounded-full h-8 w-8" onClick={handleScrollRight}>
              <ChevronRight className="h-5 w-5 text-foreground" />
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
