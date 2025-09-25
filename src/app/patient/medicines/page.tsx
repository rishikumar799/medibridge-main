
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FlaskConical, Stethoscope, Microscope, LifeBuoy, Bell, Utensils, Award, AlarmClock, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { cn } from "@/lib/utils";

const medicineSchedule = [
    { name: "Paracetamol", teluguName: "పారాసిటమాల్", use: "For fever and pain relief", teluguUse: "జ్వరం మరియు నొప్పి నివారణకు", dosage: "500mg", time: "After Breakfast", teluguTime: "అల్పాహారం తర్వాత", taken: true, frequency: "3 times a day", alertTime: "9:00 AM" },
    { name: "Vitamin D3", teluguName: "విటమిన్ డి3", use: "For bone health", teluguUse: "ఎముకల ఆరోగ్యానికి", dosage: "60000 IU", time: "After Lunch", teluguTime: "భోజనం తర్వాత", taken: true, frequency: "Once a week", alertTime: "1:00 PM" },
    { name: "Metformin", teluguName: "మెట్‌ఫార్మిన్", use: "To control blood sugar", teluguUse: "రక్తంలో చక్కెరను నియంత్రించడానికి", dosage: "1000mg", time: "After Dinner", teluguTime: "రాత్రి భోజనం తర్వాత", taken: false, frequency: "Twice a day", alertTime: "9:00 PM" },
    { name: "Omega-3", teluguName: "ఒమేగా-3", use: "For heart health", teluguUse: "గుండె ఆరోగ్యానికి", dosage: "1 capsule", time: "After Dinner", teluguTime: "రాత్రి భోజనం తర్వాత", taken: false, frequency: "Once a day", alertTime: "9:30 PM" },
];

const medicineAssistanceItems = [
    { href: '/medicine-assistant', icon: FlaskConical, label: 'AI Medicine Assistant' },
    { href: '#', icon: Stethoscope, label: 'Nearby Pharmacies' },
    { href: '#', icon: Microscope, label: 'Drug Interaction Check' },
    { href: '#', icon: LifeBuoy, label: 'Pharmacist Consultation' },
];

export default function MyMedicinesPage() {
    return (
        <div className="space-y-8">
            <div className="text-left">
                <h1 className="text-3xl font-bold" style={{color: 'hsl(var(--nav-medicines))'}}>My Medicines</h1>
                <p className="text-muted-foreground">Your daily medication schedule and recovery plan.</p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Bell /> Today's Schedule</CardTitle>
                            <CardDescription>Wednesday, July 17, 2024</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {medicineSchedule.map((med, index) => (
                                    <div key={index} className={cn('p-4 rounded-lg flex items-center justify-between transition-all', med.taken ? 'bg-green-100/60 border border-green-200' : 'bg-muted/40')}>
                                        <div className="flex items-start gap-4">
                                            <div className="pt-1">
                                                <AlarmClock className="h-5 w-5" style={{color: 'hsl(var(--nav-medicines))'}} />
                                            </div>
                                            <div>
                                                <div className="flex items-baseline gap-2">
                                                    <p className="font-extrabold text-xl">{med.name}</p>
                                                    <p className="font-bold text-lg text-muted-foreground">{med.teluguName}</p>
                                                </div>
                                                <div className="font-semibold text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                                                    <Info className="h-4 w-4" />
                                                    <div>
                                                        <p>{med.use}</p>
                                                        <p className="text-sm">{med.teluguUse}</p>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-2 font-semibold">{med.dosage} • {med.time} ({med.teluguTime})</p>
                                                <div className="text-xs font-semibold mt-2 p-1 px-2.5 rounded-full inline-flex items-center gap-1.5" style={{backgroundColor: 'hsla(var(--nav-medicines)/0.1)', color: 'hsl(var(--nav-medicines))'}}>
                                                    <Bell className="h-3 w-3"/>
                                                    {med.alertTime} • {med.frequency}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Label htmlFor={`med-${index}`} className="text-sm font-medium">{med.taken ? 'Taken' : 'Take'}</Label>
                                            <Checkbox id={`med-${index}`} checked={med.taken} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                             <CardTitle className="flex items-center gap-2"><Award /> Weekly Progress</CardTitle>
                             <CardDescription>Your adherence to medication and diet plan this week.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <div className="flex justify-between mb-1"><p>Medication</p><p className="font-semibold">90%</p></div>
                                <Progress value={90} className="h-2"/>
                            </div>
                             <div>
                                <div className="flex justify-between mb-1"><p>Diet</p><p className="font-semibold">75%</p></div>
                                <Progress value={75} className="h-2"/>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Diet & Recovery Plan (ఆహారం & కోలుకునే ప్రణాళిక)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <Label>Recovery Probability (కోలుకునే సంభావ్యత)</Label>
                                <div className="flex items-center gap-2 mt-1">
                                    <Progress value={85} className="w-full" />
                                    <span className="font-bold" style={{color: 'hsl(var(--nav-medicines))'}}>85%</span>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold flex items-center gap-2 mb-2"><Utensils style={{color: 'hsl(var(--nav-medicines))'}}/> Recommended Diet (సిఫార్సు చేయబడిన ఆహారం)</h3>
                                <div className="text-sm text-muted-foreground p-3 bg-muted/40 rounded-lg space-y-1">
                                    <p>• Low-carb, high-protein diet.</p>
                                    <p>• Avoid sugary drinks and processed foods.</p>
                                    <p>• Drink at least 8 glasses of water daily.</p>
                                </div>
                                <Button variant="link" className="p-0 h-auto mt-2 text-sm" style={{color: 'hsl(var(--nav-medicines))'}}>View Detailed Plan (వివరణాత్మక ప్రణాళిక చూడండి)</Button>
                            </div>
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader><CardTitle>Medicine Assistance</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                           {medicineAssistanceItems.map((item) => (
                             <Link key={item.label} href={item.href} passHref>
                                <Button variant="outline" className="w-full justify-start gap-3">
                                    <item.icon className="h-5 w-5" style={{color: 'hsl(var(--nav-medicines))'}} />
                                    <span>{item.label}</span>
                                </Button>
                            </Link>
                           ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
