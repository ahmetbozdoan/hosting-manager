"use client";

import { useEffect, useState } from "react";
import { HostingTable } from "./components/hosting-table";
import { AddHosting } from "./components/add-hosting";
import { HostingAccount } from "./types/hosting";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function Home() {
  const [accounts, setAccounts] = useState<HostingAccount[]>([]);
  const { toast } = useToast();

  const fetchAccounts = async () => {
    try {
      const response = await fetch('/api/hosting');
      const data = await response.json();
      setAccounts(data);
      
      toast({
        title: "Başarılı",
        description: "Hosting listesi güncellendi.",
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Hosting listesi alınırken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <main className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Hosting Yönetimi</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={fetchAccounts}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <AddHosting onAdd={fetchAccounts} />
        </div>
      </div>
      
      <HostingTable accounts={accounts} onDelete={fetchAccounts} />
    </main>
  );
}