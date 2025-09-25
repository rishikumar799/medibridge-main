
'use client';

import React, { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileDown, Eye, Upload, Search, MapPin, TestTube, Sparkles, Bone, Scan, FileText, Loader2, User, Calendar, Stethoscope as StethoscopeIcon, FlaskConical } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { analyzeReport, ReportAnalysisInput, ReportAnalysisOutput } from '@/ai/flows/ai-report-analysis';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const getStatusBadgeClass = (status: string) => {
    switch (status) {
        case "Completed":
            return "bg-green-100 text-green-800 border-green-200";
        case "Processing":
            return "bg-blue-100 text-blue-800 border-blue-200";
        case "Pending":
            return "bg-yellow-100 text-yellow-800 border-yellow-200";
        default:
            return "";
    }
}

const ReportTable = ({ reports, onAnalyze, onView }: { reports: any[], onAnalyze: (report: any) => void, onView: (report: any) => void }) => (
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead>Test/Prescription Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Ordered By</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {reports.map((report, index) => (
                <TableRow key={index} className='border-b'>
                    <TableCell className="font-medium">{report.testName}</TableCell>
                    <TableCell>{report.date}</TableCell>
                    <TableCell>{report.doctor}</TableCell>
                    <TableCell>
                        <Badge variant="outline" className={getStatusBadgeClass(report.status)}>
                            {report.status}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        {report.status === "Completed" ? (
                            <div className="flex gap-2 justify-end">
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onView(report)}>
                                    <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon" className="h-8 w-8">
                                    <FileDown className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon" className="h-8 w-8 border-primary/50 text-primary hover:text-primary hover:bg-primary/10" onClick={() => onAnalyze(report)}>
                                    <Sparkles className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <span className="text-xs text-muted-foreground">Not Available</span>
                        )}
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
);

const ReportViewer = ({ content }: { content: string }) => {
    const lines = content.trim().split('\n');
    const patientInfo: { [key: string]: string } = {};
    const testResults: any[] = [];
    const otherSections: {title: string, content: string[]}[] = [];
    let currentSection: {title: string, content: string[]} | null = null;
    let isParsingResults = false;
    let isParsingOtherSections = false;

    lines.forEach(line => {
        if (line.trim() === '') {
            if(!isParsingOtherSections && Object.keys(patientInfo).length > 0){
                isParsingResults = true;
            }
            return;
        }

        const sectionTitleMatch = line.match(/^([A-Z\s]+):$/);
         if (sectionTitleMatch && !line.includes(': ')) {
             isParsingResults = false;
             isParsingOtherSections = true;
            if(currentSection){
                otherSections.push(currentSection);
            }
            currentSection = { title: sectionTitleMatch[1].trim(), content: [] };
        } else if (currentSection && isParsingOtherSections) {
             currentSection.content.push(line.trim());
        } else if (!isParsingResults && !isParsingOtherSections) {
            const [key, ...valueParts] = line.split(':');
            if (key && valueParts.length > 0) {
                patientInfo[key.trim()] = valueParts.join(':').trim();
            }
        } else if(isParsingResults) {
            const resultMatch = line.match(/(.*?):\s*(.*?)\s*\((.*?)\)(.*)/);
            if (resultMatch) {
                const [, test, value, normalRange, remark] = resultMatch;
                const isAbnormal = remark && (remark.toLowerCase().includes('high') || remark.toLowerCase().includes('low'));
                testResults.push({
                    test: test.trim(),
                    value: value.trim(),
                    normalRange: `(${normalRange.trim()})`,
                    remark: remark.trim(),
                    isAbnormal
                });
            } else {
                 const simpleResultMatch = line.match(/(.*?):\s*(.*)/);
                 if(simpleResultMatch){
                    const [, test, value] = simpleResultMatch;
                    testResults.push({ test: test.trim(), value: value.trim(), normalRange: '', remark: '', isAbnormal: false });
                 }
            }
        }
    });

    if(currentSection) {
        otherSections.push(currentSection);
    }

    return (
        <div className="font-sans space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FlaskConical className="h-5 w-5 text-primary" style={{color: 'hsl(var(--nav-diagnostics))'}} /> {patientInfo['Test'] || 'Report Details'}</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <strong>Patient:</strong> {patientInfo['Patient Name']}
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <strong>Date:</strong> {patientInfo['Date']}
                    </div>
                    {patientInfo['Doctor'] && (
                         <div className="flex items-center gap-2 col-span-2">
                            <StethoscopeIcon className="h-4 w-4 text-muted-foreground" />
                            <strong>Doctor:</strong> {patientInfo['Doctor']}
                        </div>
                    )}
                </CardContent>
            </Card>

            {testResults.length > 0 && (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Test</TableHead>
                            <TableHead>Result</TableHead>
                            <TableHead>Normal Range</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {testResults.map((result, index) => (
                            <TableRow key={index} className={cn('border-b', result.isAbnormal ? 'bg-red-50 dark:bg-red-900/20' : '')}>
                                <TableCell className="font-semibold">{result.test}</TableCell>
                                <TableCell className={`font-bold ${result.isAbnormal ? 'text-red-600' : ''}`}>
                                    {result.value} {result.remark && <span className="text-xs font-normal"> - {result.remark.replace('-','').trim()}</span>}
                                </TableCell>
                                <TableCell className="text-muted-foreground">{result.normalRange}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
            
            {otherSections.map((section, index) => (
                <div key={index}>
                    <h3 className="font-bold text-lg mb-2">{section.title}</h3>
                    <div className="text-muted-foreground space-y-1 text-sm">
                        {section.content.map((line, i) => <p key={i}>{line}</p>)}
                    </div>
                </div>
            ))}
        </div>
    );
};

interface LabReportsClientProps {
    labReports: any[];
    imagingReports: any[];
    prescriptionReports: any[];
    diagnosticTests: any[];
    dummyReportData: Record<string, { content: string, image?: string, dataAiHint?: string }>;
}

export function LabReportsClient({
    labReports,
    imagingReports,
    prescriptionReports,
    diagnosticTests,
    dummyReportData
}: LabReportsClientProps) {
    const [isAnalyzeOpen, setAnalyzeOpen] = useState(false);
    const [isViewOpen, setViewOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState<any | null>(null);
    const [analysisResult, setAnalysisResult] = useState<ReportAnalysisOutput | null>(null);
    const [isPending, startTransition] = useTransition();
    const [reportContent, setReportContent] = useState('');
    const [reportImage, setReportImage] = useState<string | undefined>(undefined);
    const [reportImageHint, setReportImageHint] = useState<string | undefined>(undefined);
    const [fileName, setFileName] = useState('');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFileName(event.target.files[0].name);
        } else {
            setFileName('');
        }
    };

    const handleView = (report: any) => {
        const reportKey = `${report.testName}-${report.date}`;
        const data = dummyReportData[reportKey] || { content: "Report details not found." };
        
        setSelectedReport(report);
        setReportContent(data.content);
        setReportImage(data.image);
        setReportImageHint(data.dataAiHint);
        setViewOpen(true);
    };

    const handleAnalyze = (report: any) => {
        const reportKey = `${report.testName}-${report.date}`;
        const data = dummyReportData[reportKey] || { content: "No content to analyze." };

        setSelectedReport(report);
        setReportContent(data.content);
        setAnalysisResult(null);
        setAnalyzeOpen(true);
    };

    const handleRunAnalysis = () => {
        if (!reportContent) return;

        startTransition(async () => {
            const result = await analyzeReport({ reportContent });
            setAnalysisResult(result);
        });
    };

    return (
        <div className="space-y-8">
             <div>
                <h1 className="text-3xl font-bold" style={{color: 'hsl(var(--nav-diagnostics))'}}>Diagnostics + Reports</h1>
                <p className="text-muted-foreground">Find diagnostic tests and view your reports.</p>
            </div>
            <Tabs defaultValue="diagnostics" className="w-full">
                <TabsList className="grid w-full grid-cols-2 border p-0 h-auto" style={{borderColor: 'hsl(var(--nav-diagnostics))'}}>
                    <TabsTrigger value="diagnostics" className="data-[state=active]:bg-[hsl(var(--nav-diagnostics))] data-[state=active]:text-white rounded-none border-r" >Find Diagnostics</TabsTrigger>
                    <TabsTrigger value="reports" className="data-[state=active]:bg-[hsl(var(--nav-diagnostics))] data-[state=active]:text-white rounded-none">My Reports</TabsTrigger>
                </TabsList>
                <TabsContent value="diagnostics" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Find a Test</CardTitle>
                            <CardDescription>Search for labs and tests near you.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <div className="relative md:col-span-2">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input placeholder="Search test name, lab, or package..." className="pl-10" />
                                </div>
                                <Select>
                                    <SelectTrigger>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            <SelectValue placeholder="Location" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="guntur">Guntur</SelectItem>
                                        <SelectItem value="hyderabad">Hyderabad</SelectItem>
                                        <SelectItem value="vijayawada">Vijayawada</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Categories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        <SelectItem value="blood">Blood Tests</SelectItem>
                                        <SelectItem value="imaging">Imaging</SelectItem>
                                        <SelectItem value="packages">Health Packages</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-4">
                                {diagnosticTests.map(test => (
                                    <Card key={test.name} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center">
                                        <div className="mb-4 sm:mb-0">
                                            <p className="font-bold text-lg">{test.name}</p>
                                            <p className="text-sm text-muted-foreground">{test.lab}</p>
                                            <Badge variant="outline" className="mt-2">{test.category}</Badge>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <p className="text-xl font-bold" style={{color: 'hsl(var(--nav-diagnostics))'}}>₹{test.price}</p>
                                            <Button style={{backgroundColor: 'hsl(var(--nav-diagnostics))'}}>Book Now</Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="reports" className="mt-6">
                    <Card>
                        <CardHeader className="flex flex-row justify-between items-start">
                            <div>
                                <CardTitle>My Reports</CardTitle>
                                <CardDescription>View, download, and analyze your medical test results.</CardDescription>
                            </div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button style={{backgroundColor: 'hsl(var(--nav-diagnostics))'}}>
                                        <Upload className="mr-2 h-4 w-4" />
                                        Upload Report
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Upload New Report</DialogTitle>
                                        <DialogDescription>
                                            Add a new medical document to your records. You can upload an image or PDF file.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="report-type" className="text-right">Type</Label>
                                            <Select>
                                                <SelectTrigger id="report-type" className="col-span-3">
                                                    <SelectValue placeholder="Select report type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="lab">Lab Report</SelectItem>
                                                    <SelectItem value="imaging">Imaging</SelectItem>
                                                    <SelectItem value="prescription">Prescription</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="report-name" className="text-right">Name</Label>
                                            <Input id="report-name" placeholder="e.g., Complete Blood Count" className="col-span-3" />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="report-file" className="text-right">File</Label>
                                            <div className="col-span-3">
                                                <Button asChild variant="outline">
                                                    <label htmlFor="file-upload" className="cursor-pointer w-full">
                                                        <Upload className="mr-2 h-4 w-4" />
                                                        {fileName || 'Choose File'}
                                                    </label>
                                                </Button>
                                                <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*,.pdf" />
                                                {fileName && <p className="text-xs text-muted-foreground mt-2">{fileName}</p>}
                                            </div>
                                        </div>
                                    </div>
                                    <CardFooter className="p-0 pt-4">
                                        <Button type="submit" className="w-full" style={{backgroundColor: 'hsl(var(--nav-diagnostics))'}}>Save Report</Button>
                                    </CardFooter>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent>
                           <Tabs defaultValue="lab" className="w-full">
                                <TabsList>
                                    <TabsTrigger value="lab" className="flex items-center gap-2"><TestTube className="h-4 w-4"/> Lab Reports</TabsTrigger>
                                    <TabsTrigger value="imaging" className="flex items-center gap-2"><Scan className="h-4 w-4"/> Imaging</TabsTrigger>
                                    <TabsTrigger value="prescriptions" className="flex items-center gap-2"><FileText className="h-4 w-4"/> Prescriptions</TabsTrigger>
                                </TabsList>
                                <TabsContent value="lab" className="mt-4">
                                     <ReportTable reports={labReports} onAnalyze={handleAnalyze} onView={handleView} />
                                </TabsContent>
                                <TabsContent value="imaging" className="mt-4">
                                    <ReportTable reports={imagingReports} onAnalyze={handleAnalyze} onView={handleView} />
                                </TabsContent>
                                <TabsContent value="prescriptions" className="mt-4">
                                     <ReportTable reports={prescriptionReports} onAnalyze={handleAnalyze} onView={handleView} />
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
            
            <Dialog open={isViewOpen} onOpenChange={setViewOpen}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>View Report: {selectedReport?.testName}</DialogTitle>
                        <DialogDescription>Date: {selectedReport?.date} | Ordered by: {selectedReport?.doctor}</DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[70vh] overflow-y-auto p-1 space-y-4">
                        {reportImage && (
                            <div className="mb-6">
                                <Image 
                                    src={reportImage} 
                                    alt="Report Image" 
                                    width={600} 
                                    height={400} 
                                    className="rounded-lg border"
                                    data-ai-hint={reportImageHint || ''}
                                />
                            </div>
                        )}
                        <ReportViewer content={reportContent} />
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isAnalyzeOpen} onOpenChange={setAnalyzeOpen}>
                <DialogContent className="sm:max-w-4xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-primary" style={{color: 'hsl(var(--nav-diagnostics))'}}><Sparkles /> AI Report Analysis</DialogTitle>
                        <DialogDescription>Analyzing: {selectedReport?.testName} from {selectedReport?.date}</DialogDescription>
                    </DialogHeader>
                    <div className="grid md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
                        <div className="space-y-4">
                            <h3 className="font-semibold">Original Report Content</h3>
                            <Textarea 
                                className="h-96 font-mono text-xs" 
                                value={reportContent} 
                                onChange={(e) => setReportContent(e.target.value)}
                            />
                            <Button onClick={handleRunAnalysis} disabled={isPending || !reportContent} className="w-full" style={{backgroundColor: 'hsl(var(--nav-diagnostics))'}}>
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Analyzing...
                                    </>
                                ) : "Run AI Analysis"}
                            </Button>
                        </div>
                        <div className="space-y-4">
                             <h3 className="font-semibold">AI Summary & Findings</h3>
                            {isPending && !analysisResult && (
                                <div className="flex flex-col items-center justify-center h-96 rounded-lg bg-muted/50">
                                    <Loader2 className="h-10 w-10 animate-spin text-primary" style={{color: 'hsl(var(--nav-diagnostics))'}}/>
                                    <p className="mt-4 text-muted-foreground">The AI is analyzing your report...</p>
                                </div>
                            )}
                            {analysisResult && (
                                <div className="space-y-4">
                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-lg">Summary</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground">{analysisResult.summary}</p>
                                        </CardContent>
                                    </Card>
                                    {analysisResult.abnormalities.length > 0 ? (
                                        <Card>
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-lg">Abnormal Findings</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                {analysisResult.abnormalities.map((item, index) => (
                                                    <div key={index} className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg">
                                                        <div className="flex justify-between font-bold">
                                                            <p>{item.item}</p>
                                                            <p>{item.result}</p>
                                                        </div>
                                                         <p className="text-xs text-muted-foreground">Normal Range: {item.normalRange}</p>
                                                        <p className="text-sm mt-2">{item.explanation}</p>
                                                    </div>
                                                ))}
                                            </CardContent>
                                        </Card>
                                    ) : (
                                        <Card>
                                            <CardContent className="p-4 text-center">
                                                <p className="font-semibold text-green-600">No major abnormalities were found in this report.</p>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

    