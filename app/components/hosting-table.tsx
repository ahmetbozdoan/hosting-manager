"use client";

import { HostingAccount } from "../types/hosting";
import { differenceInDays } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface HostingTableProps {
  accounts: HostingAccount[];
  onDelete: () => void;
}

export function HostingTable({ accounts, onDelete }: HostingTableProps) {
  const { toast } = useToast();

  const getDaysUntilExpiry = (expiryDate: Date) => {
    return differenceInDays(new Date(expiryDate), new Date());
  };

  const getRowClassName = (expiryDate: Date) => {
    const daysLeft = getDaysUntilExpiry(expiryDate);
    if (daysLeft <= 60) {
      return "bg-red-50 dark:bg-red-900/20";
    }
    return "";
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/hosting?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: "Başarılı",
          description: "Hosting kaydı silindi.",
        });
        onDelete();
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Hosting silinirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Domain</TableHead>
            <TableHead>Kullanıcı Adı</TableHead>
            <TableHead>Başlangıç Tarihi</TableHead>
            <TableHead>Süre (Yıl)</TableHead>
            <TableHead>Bitiş Tarihi</TableHead>
            <TableHead>Kalan Gün</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.map((account) => (
            <TableRow
              key={account.id}
              className={getRowClassName(account.expiryDate)}
            >
              <TableCell className="font-medium">{account.domain}</TableCell>
              <TableCell>{account.username}</TableCell>
              <TableCell>
                {new Date(account.startDate).toLocaleDateString()}
              </TableCell>
              <TableCell>{account.durationYears}</TableCell>
              <TableCell>
                {new Date(account.expiryDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {getDaysUntilExpiry(account.expiryDate)} gün
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(account.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}