
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, MapPin, HeartPulse, Bone, Brain, Stethoscope as StethoscopeIcon, Baby, Leaf, Phone, Globe, Share2, Copy } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const hospitalsData = {
    "Apollo Hospital, Jubilee Hills": {
        location: "Hyderabad",
        address: "Rd Number 72, opposite Bharatiya Vidya Bhavan School, Film Nagar, Jubilee Hills, Hyderabad, Telangana 500033",
        phone: "040 2360 7777",
        website: "https://apollohospitals.com/locations/india/hyderabad/jubilee-hills/"
    },
    "Care Hospital, Banjara Hills": {
        location: "Hyderabad",
        address: "Rd Number 1, Prem Nagar, Banjara Hills, Hyderabad, Telangana 500034",
        phone: "040 3041 8888",
        website: "https://www.carehospitals.com/locations/hyderabad/banjara-hills/"
    },
    "Guntur Kidney & Multispeciality Hospital": {
        location: "Guntur",
        address: "Kothapet, Guntur, Andhra Pradesh 522001",
        phone: "8008334948",
        website: "https://gunturkidneyhospital.com"
    },
    "Padmavathy Super Speciality Hospital": {
        location: "Guntur",
        address: "4/1, Arundelpet, Guntur, Andhra Pradesh 522002",
        phone: "0863 223 4567",
        website: "https://padmavathyhospital.com"
    },
    "Yashoda Hospital, Secunderabad": {
        location: "Hyderabad",
        address: "Alexander Rd, Kummari Guda, Shivaji Nagar, Secunderabad, Telangana 500003",
        phone: "040 4567 4567",
        website: "https://www.yashodahospitals.com/locations/secunderabad/"
    },
    "Lalitha Super Specialities Hospital": {
        location: "Guntur",
        address: "Brodipet, Guntur, Andhra Pradesh 522002",
        phone: "0863 224 5678",
        website: "https://lalithahospital.com"
    },
    "MaxCure Hospital, Madhapur": {
        location: "Hyderabad",
        address: "Behind Cyber Towers, Lane Next to McDonalds, Madhapur, Hyderabad, Telangana 500081",
        phone: "040 4242 4242",
        website: "https://maxcurehospitals.com/"
    },
    "Rainbow Children's Hospital, Banjara Hills": {
        location: "Hyderabad",
        address: "Rd Number 2, Sri Ram Nagar Colony, Banjara Hills, Hyderabad, Telangana 500034",
        phone: "1800 212 2",
        website: "https://www.rainbowhospitals.in/locations/hyderabad/banjara-hills-flagship"
    },
    "KIMS Hospital, Secunderabad": {
        location: "Hyderabad",
        address: "1-8-31/1, Minister Rd, Krishna Nagar Colony, Begumpet, Secunderabad, Telangana 500003",
        phone: "040 4488 5000",
        website: "https://www.kimshospitals.com/secunderabad/"
    },
     "Continental Hospitals, Gachibowli": {
        location: "Hyderabad",
        address: "Plot No 3, Road No 2, Financial District, Nanakramguda, Gachibowli, Hyderabad, Telangana 500032",
        phone: "040 6700 0000",
        website: "https://continentalhospitals.com/"
    },
    "Ahalya Ivf And Nursing Home": {
        location: "Guntur",
        address: "Backside Sivalayam, Kothapet, Guntur",
        phone: "N/A",
        website: "#"
    },
    "Amar Orthopaedic Hospital": {
        location: "Guntur",
        address: "13-2-12, 1st Lane, Old Club Road, Kothapet, Guntur",
        phone: "N/A",
        website: "#"
    },
    "Amaravathi Institute Of Medical Sciences Pvt Ltd": {
        location: "Guntur",
        address: "D.No:13-4-74, M.N.R Plaza, Oldclub Road, Kothapet, Guntur",
        phone: "N/A",
        website: "#"
    },
    "American Oncology Insititute": {
        location: "Mangalagiri",
        address: "Mangalagiri Road, NRI Hospital Campus, Chinakakani, Mangalagiri",
        phone: "N/A",
        website: "#"
    }
};

const doctors = [
    {
        name: "Dr. Chinta Ramana",
        specialty: "Cardiologist",
        experience: "18 years",
        hospital: "Apollo Hospital, Jubilee Hills",
        surgeries: "600+ successful cardiac surgeries",
        mainDealing: "Complex angioplasty and valve replacements.",
        avatar: "https://picsum.photos/seed/doc1/100/100",
        dataAiHint: "male doctor portrait",
    },
    {
        name: "Dr. Lakshmi Narasaiah",
        specialty: "Orthopedic Surgeon",
        experience: "14 years",
        hospital: "Care Hospital, Banjara Hills",
        surgeries: "900+ joint replacement surgeries",
        mainDealing: "Knee and hip replacements.",
        avatar: "https://picsum.photos/seed/doc2/100/100",
        dataAiHint: "female doctor",
    },
     {
        name: "Dr. Ramesh Babu",
        specialty: "Nephrologist",
        experience: "20 years",
        hospital: "Guntur Kidney & Multispeciality Hospital",
        surgeries: "300+ kidney transplants",
        mainDealing: "Chronic kidney disease and dialysis.",
        avatar: "https://picsum.photos/seed/doc8/100/100",
        dataAiHint: "male doctor professional",
    },
    {
        name: "Dr. Padmavathi",
        specialty: "Gynaecologist",
        experience: "25 years",
        hospital: "Padmavathy Super Speciality Hospital",
        surgeries: "1000+ successful deliveries",
        mainDealing: "High-risk pregnancies and IVF.",
        avatar: "https://picsum.photos/seed/doc9/100/100",
        dataAiHint: "female doctor professional",
    },
    {
        name: "Dr. Rupa",
        specialty: "Neurologist",
        experience: "22 years",
        hospital: "Yashoda Hospital, Secunderabad",
        surgeries: "400+ successful brain surgeries",
        mainDealing: "Epilepsy and stroke treatment.",
        avatar: "https://picsum.photos/seed/doc3/100/100",
        dataAiHint: "female doctor professional",
    },
     {
        name: "Dr. Gondi Siva Rama Krishna",
        specialty: "Consultant Nephrologist",
        experience: "15 years",
        hospital: "Guntur Kidney & Multispeciality Hospital",
        surgeries: "N/A",
        mainDealing: "Nephrology and kidney diseases.",
        avatar: "https://picsum.photos/seed/doc15/100/100",
        dataAiHint: "male doctor glasses",
    },
    {
        name: "Dr. Anjali",
        specialty: "General Physician",
        experience: "10 years",
        hospital: "MaxCure Hospital, Madhapur",
        surgeries: "N/A",
        mainDealing: "General health check-ups and infectious diseases.",
        avatar: "https://picsum.photos/seed/doc4/100/100",
        dataAiHint: "female doctor smile",
    },
     {
        name: "Dr. Srinivas",
        specialty: "General Surgeon",
        experience: "12 years",
        hospital: "Lalitha Super Specialities Hospital",
        surgeries: "700+ various surgeries",
        mainDealing: "Laparoscopic and general surgery.",
        avatar: "https://picsum.photos/seed/doc10/100/100",
        dataAiHint: "male doctor serious",
    },
    {
        name: "Dr. Anusha",
        specialty: "Pediatrician",
        experience: "9 years",
        hospital: "Rainbow Children's Hospital, Banjara Hills",
        surgeries: "N/A",
        mainDealing: "Child care and vaccinations.",
        avatar: "https://picsum.photos/seed/doc5/100/100",
        dataAiHint: "female doctor glasses",
    },
    {
        name: "Dr. V. Venkata Naidu",
        specialty: "Urologist",
        experience: "25+ years",
        hospital: "Guntur Kidney & Multispeciality Hospital",
        surgeries: "20,000+ Successful Surgeries",
        mainDealing: "Urology, advanced surgical procedures, and successful kidney transplants.",
        avatar: "https://picsum.photos/seed/doc11/100/100",
        dataAiHint: "male doctor experienced",
    },
    {
        name: "Dr. G. Ravi Shankara Reddy",
        specialty: "Orthopaedics",
        experience: "12 years",
        hospital: "Guntur Kidney & Multispeciality Hospital",
        surgeries: "N/A",
        mainDealing: "Orthopaedic consultations and treatments.",
        avatar: "https://picsum.photos/seed/doc14/100/100",
        dataAiHint: "male doctor professional",
    },
    {
        name: "Dr. Subbamma",
        specialty: "Dermatologist",
        experience: "7 years",
        hospital: "KIMS Hospital, Secunderabad",
        surgeries: "100+ cosmetic procedures",
        mainDealing: "Acne treatment and skin rejuvenation.",
        avatar: "https://picsum.photos/seed/doc6/100/100",
        dataAiHint: "female doctor professional",
    },
    {
        name: "Dr. V. Sasikala",
        specialty: "Intensivist",
        experience: "10 years",
        hospital: "Guntur Kidney & Multispeciality Hospital",
        surgeries: "N/A",
        mainDealing: "Critical care and intensive medical treatment.",
        avatar: "https://picsum.photos/seed/doc12/100/100",
        dataAiHint: "female doctor serious",
    },
    {
        name: "Dr. Jaya Lakshmi",
        specialty: "Gynaecologist",
        experience: "15 years",
        hospital: "Continental Hospitals, Gachibowli",
        surgeries: "500+ successful deliveries",
        mainDealing: "High-risk pregnancy and infertility.",
        avatar: "https://picsum.photos/seed/doc7/100/100",
        dataAiHint: "female doctor professional",
    },
    {
        name: "Dr. K. Sai Mounica Reddy",
        specialty: "General Physician & Diabetalogist",
        experience: "6 years",
        hospital: "Guntur Kidney & Multispeciality Hospital",
        surgeries: "N/A",
        mainDealing: "Diabetes management and general health.",
        avatar: "https://picsum.photos/seed/doc13/100/100",
        dataAiHint: "female doctor glasses",
    },
];

const departments = [
    { value: "all", label: "All Departments", icon: StethoscopeIcon },
    { value: "cardiology", label: "Cardiology", icon: HeartPulse },
    { value: "orthopedics", label: "Orthopedics", icon: Bone },
    { value: "neurology", label: "Neurology", icon: Brain },
    { value: "gynaecology", label: "Gynaecology", icon: Baby },
    { value: "pediatrics", label: "Pediatrics", icon: Baby },
    { value: "dermatology", label: "Dermatology", icon: Leaf },
    { value: "general", label: "General Physician", icon: StethoscopeIcon },
];

const hospitals = [
    "All Hospitals",
    ...Object.keys(hospitalsData),
];

export default function AppointmentsPage() {
    const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);
    const [isProfileOpen, setProfileOpen] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const handleViewProfile = (doctor: any) => {
        setSelectedDoctor(doctor);
        setProfileOpen(true);
    };
    
    const handleShare = (doctor: any) => {
        const hospital = hospitalsData[doctor.hospital as keyof typeof hospitalsData];
        const shareText = `Check out Dr. ${doctor.name}, ${doctor.specialty} at ${doctor.hospital}.\nAddress: ${hospital.address}\nContact: ${hospital.phone}`;
        navigator.clipboard.writeText(shareText);
        toast({
            title: "Copied to Clipboard",
            description: "Doctor's details have been copied.",
        });
    };

    const handleBookAppointment = (doctor: any) => {
        toast({
            title: "Appointment Confirmed!",
            description: `Your appointment with ${doctor.name} is booked. Check the OP Status page for live updates.`,
        });
        router.push('/opd-queue');
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold" style={{color: 'hsl(var(--nav-appointments))'}}>Book an Appointment</h1>
                <p className="text-muted-foreground mt-2">Find the right doctor for your needs.</p>
            </div>

            <Card className="p-4 shadow-sm">
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input placeholder="Doctor or hospital..." className="pl-10" />
                    </div>
                    <Select defaultValue="all">
                        <SelectTrigger>
                            <SelectValue placeholder="Select Department" />
                        </SelectTrigger>
                        <SelectContent>
                            {departments.map(dep => (
                                <SelectItem key={dep.value} value={dep.value}>
                                    <div className="flex items-center gap-2">
                                        <dep.icon className="h-4 w-4" />
                                        {dep.label}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Hospital" />
                        </SelectTrigger>
                        <SelectContent>
                            {hospitals.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Select>
                         <SelectTrigger>
                            <div className="flex items-center gap-2">
                               <MapPin className="h-4 w-4" />
                               <SelectValue placeholder="Location" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="hyderabad">Hyderabad</SelectItem>
                             <SelectItem value="guntur">Guntur</SelectItem>
                            <SelectItem value="mumbai">Mumbai</SelectItem>
                            <SelectItem value="bangalore">Bangalore</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {doctors.map((doctor, index) => (
                    <Card key={index} className="transition-shadow hover:shadow-md">
                        <CardContent className="p-6">
                            <div className="flex flex-col sm:flex-row gap-6">
                                <Avatar className="h-28 w-28 border-4" style={{borderColor: 'hsl(var(--nav-appointments))'}}>
                                    <AvatarImage src={doctor.avatar} data-ai-hint={doctor.dataAiHint} />
                                    <AvatarFallback>{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold">{doctor.name}</h3>
                                    <p style={{color: 'hsl(var(--nav-appointments))'}} className="font-semibold">{doctor.specialty}</p>
                                    <p className="text-sm text-muted-foreground">{doctor.experience} experience</p>
                                    <p className="text-sm text-muted-foreground font-medium mt-1">{doctor.hospital}</p>
                                </div>
                            </div>
                            <div className="mt-4 space-y-3 text-sm">
                                <p><strong className="font-semibold">Successful Surgeries:</strong> {doctor.surgeries}</p>
                                <p><strong className="font-semibold">Main Focus:</strong> {doctor.mainDealing}</p>
                            </div>
                             <div className="mt-6 flex justify-end gap-2">
                                <Button variant="outline" onClick={() => handleViewProfile(doctor)}>View Profile</Button>
                                <Button style={{backgroundColor: 'hsl(var(--nav-appointments))'}} onClick={() => handleBookAppointment(doctor)}>Book Appointment</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={isProfileOpen} onOpenChange={setProfileOpen}>
                <DialogContent className="sm:max-w-2xl">
                    {selectedDoctor && (
                        <>
                            <DialogHeader>
                                <div className="flex items-center gap-4">
                                     <Avatar className="h-20 w-20 border-4" style={{borderColor: 'hsl(var(--nav-appointments))'}}>
                                        <AvatarImage src={selectedDoctor.avatar} data-ai-hint={selectedDoctor.dataAiHint} />
                                        <AvatarFallback>{selectedDoctor.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <DialogTitle className="text-2xl">{selectedDoctor.name}</DialogTitle>
                                        <DialogDescription className="text-base" style={{color: 'hsl(var(--nav-appointments))'}}>{selectedDoctor.specialty}</DialogDescription>
                                        <p className="text-sm text-muted-foreground">{selectedDoctor.experience} of experience</p>
                                    </div>
                                </div>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="p-4 rounded-lg bg-muted/50">
                                    <h4 className="font-semibold text-lg mb-2">{selectedDoctor.hospital}</h4>
                                    <div className="space-y-2 text-sm">
                                        <p className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-1 flex-shrink-0"/> {hospitalsData[selectedDoctor.hospital as keyof typeof hospitalsData]?.address}</p>
                                        <p className="flex items-center gap-2"><Phone className="h-4 w-4"/> {hospitalsData[selectedDoctor.hospital as keyof typeof hospitalsData]?.phone}</p>
                                        <a href={hospitalsData[selectedDoctor.hospital as keyof typeof hospitalsData]?.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                                            <Globe className="h-4 w-4"/> Visit Website
                                        </a>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => handleShare(selectedDoctor)}>
                                        <Copy className="mr-2 h-4 w-4" /> Copy Details
                                    </Button>
                                     <Button style={{backgroundColor: 'hsl(var(--nav-appointments))'}} onClick={() => handleBookAppointment(selectedDoctor)}>
                                        Book Appointment
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

        </div>
    );
}
