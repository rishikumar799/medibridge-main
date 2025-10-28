
import React from "react";

export const organHealthData = [
    {
      name: "Heart",
      health: 95,
      icon: "Heart",
      image: "https://picsum.photos/seed/heart/100/100",
      dataAiHint: "heart organ",
      color: "hsl(var(--nav-emergency))",
      details: {
          abnormal: [],
          normal: [
              { name: "Lipid Profile", value: "Normal", normalRange: "", trend: "stable", description: "Cholesterol levels are within a healthy range." },
              { name: "Blood Pressure", value: "120/80 mmHg", normalRange: "< 130/85 mmHg", trend: "stable", description: "Blood pressure is well-controlled." },
          ]
      }
    },
    {
      name: "Liver",
      health: 92,
      icon: "Leaf",
      image: "https://picsum.photos/seed/liver/100/100",
      dataAiHint: "liver organ",
      color: "hsl(var(--nav-diagnostics))",
      details: {
          abnormal: [],
          normal: [
              { name: "Liver Function Test", value: "Normal", normalRange: "", trend: "stable", description: "Liver enzymes are at healthy levels, indicating good liver function." },
          ]
      }
    },
    {
      name: "Kidneys",
      health: 90,
      icon: "Droplets",
      image: "https://picsum.photos/seed/kidneys/100/100",
      dataAiHint: "kidneys organ",
      color: "hsl(var(--nav-chat))",
      details: {
          abnormal: [],
          normal: [
              { name: "Urinalysis", value: "Normal", normalRange: "", trend: "stable", description: "No signs of kidney stress or infection." },
              { name: "Serum Creatinine", value: "0.9 mg/dL", normalRange: "0.6-1.2 mg/dL", trend: "stable", description: "Kidney filtration rate is normal." },
          ]
      }
    },
    {
      name: "Lungs",
      health: 88,
      icon: "Wind",
      image: "https://picsum.photos/seed/lungs/100/100",
      dataAiHint: "lungs organ",
      color: "hsl(var(--nav-junior-doctors))",
      details: {
          abnormal: [
              { name: "Allergic Rhinitis", value: "Active", normalRange: "Inactive", trend: "stable", description: "Ongoing allergy symptoms can impact overall respiratory health score." }
          ],
          normal: [
              { name: "Chest X-Ray", value: "Clear", normalRange: "Clear", trend: "stable", description: "Lungs are clear with no signs of infection or abnormalities." },
          ]
      }
    },
    {
      name: "Brain",
      health: 98,
      icon: "Brain",
      image: "https://picsum.photos/seed/brain/100/100",
      dataAiHint: "brain organ",
      color: "hsl(var(--nav-symptoms))",
      details: {
          abnormal: [],
          normal: [
              { name: "MRI Brain Scan", value: "Unremarkable", normalRange: "Unremarkable", trend: "stable", description: "No structural abnormalities detected." },
          ]
      }
    },
    {
        name: "Stomach (Gut)",
        health: 93,
        icon: "Activity",
        image: "https://picsum.photos/seed/stomach/100/100",
        dataAiHint: "stomach organ",
        color: "hsl(var(--nav-medicines))",
        details: {
          abnormal: [],
          normal: [
              { name: "CT Scan Abdomen", value: "Normal", normalRange: "Normal", trend: "stable", description: "Digestive organs appear healthy with no signs of inflammation." },
          ]
      }
    }
];
