"use client";

import { useMemo } from "react";
import { getDocuments } from "@/lib/store";
import { FileText, Receipt, DollarSign, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation"; 
import Dashboard from '@/pages/Dashboard';

export default Dashboard;
