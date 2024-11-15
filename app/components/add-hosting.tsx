"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { addYears } from "date-fns";

const formSchema = z.object({
  domain: z.string().min(1, "Domain gerekli"),
  username: z.string().min(1, "Kullanıcı adı gerekli"),
  startDate: z.string().min(1, "Başlangıç tarihi gerekli"),
  durationYears: z.number().min(1, "Süre gerekli"),
});

interface AddHostingProps {
  onAdd: () => void;
}

export function AddHosting({ onAdd }: AddHostingProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      durationYears: 1,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const startDate = new Date(values.startDate);
    const expiryDate = addYears(startDate, values.durationYears);

    try {
      const response = await fetch('/api/hosting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          startDate,
          expiryDate,
        }),
      });

      if (response.ok) {
        onAdd();
        setOpen(false);
        form.reset();
      }
    } catch (error) {
      console.error('Hosting eklenirken hata:', error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Yeni Hosting
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Yeni Hosting Ekle</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="domain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Domain</FormLabel>
                  <FormControl>
                    <Input placeholder="example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kullanıcı Adı</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Başlangıç Tarihi</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="durationYears"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Süre (Yıl)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1" 
                      {...field} 
                      onChange={e => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Ekle</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}