import React, { createContext, useContext, useEffect, useState,ReactNode } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import {
    Sidebar as SidebarPrimitive,
    SidebarHeader,
    SidebarContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarFooter,
    SidebarInset,
  } from '@/components/ui/sidebar'
  import { Skeleton } from '@/components/ui/skeleton'
  import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { HelpCircle } from 'lucide-react'
import { Link } from '@/i18n/routing';
interface ShopContextType {
 shopData: any; // Define the type based on your shop data structure
 loading: boolean;
 error: string | null;
}
const ShopContext = createContext<ShopContextType | undefined>(undefined);
export const ShopProvider: React.FC<{ userId: string;children: ReactNode }> = ({ userId, children }) => {
 const [shopData, setShopData] = useState<any>(null);
 const [loading, setLoading] = useState<boolean>(true);
 const [error, setError] = useState<string | null>(null);
  useEffect(() => {
   const fetchShopData = async () => {
     if (!userId) {
       setLoading(false);
       return;
     }
     try {
       const shopDoc = await getDoc(doc(db, "Shops", userId));
       if (shopDoc.exists()) {
        setShopData({...shopDoc.data(),id:shopDoc.id});
       } else {
         setError("No shop data found");
       }
     } catch (err) {
       setError("Error fetching shop data");
     } finally {
       setLoading(false);
     }
   };
    fetchShopData();
 }, [userId]);
 if(loading===false && shopData){
  return (
   <ShopContext.Provider value={{ shopData, loading, error }}>
     {children}
   </ShopContext.Provider>
 );
}
 return(
  <div className="flex h-screen overflow-hidden w-full">
 <SidebarPrimitive>
<SidebarHeader className="p-4">
  <Skeleton className="h-8 w-8 rounded-full" />
</SidebarHeader>
<SidebarContent>
  <SidebarMenu>
    {[...Array(5)].map((_, index) => (
      <SidebarMenuItem key={index}>
        <SidebarMenuButton asChild>
          <div className="flex items-center">
            <Skeleton className="h-4 w-4 mr-2" />
            <Skeleton className="h-4 w-24" />
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ))}
  </SidebarMenu>
</SidebarContent>
<SidebarFooter className="p-4">
  <SidebarMenuButton asChild className="w-full">
    <div className="flex items-center">
      <Skeleton className="h-4 w-4 mr-2" />
      <Skeleton className="h-4 w-16" />
    </div>
  </SidebarMenuButton>
</SidebarFooter>
</SidebarPrimitive>
  <SidebarInset className="flex-1 overflow-auto">
  <div className="min-h-screen bg-background p-2 sm:p-4 md:p-8">
<div className="container mx-auto space-y-4 sm:space-y-6 md:space-y-8">
  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
    <Skeleton className="h-8 w-64" />
    <div className="flex items-center gap-2">
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-8 w-8 rounded-md" />
    </div>
  </div>

  <div className="grid gap-2 sm:gap-4 md:gap-6 grid-cols-2 md:grid-cols-4">
    {[...Array(4)].map((_, index) => (
     <Card key={index} className="group transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 hover:bg-primary/5">
     <CardContent className="p-2 sm:p-4 md:p-6">
       <div className="flex items-center justify-between">
         <div>
           <Skeleton className="h-4 w-20 mb-2" />
           <Skeleton className="h-6 w-24" />
         </div>
         <Skeleton className="h-8 w-8 rounded-full" />
       </div>
       <div className="mt-2 sm:mt-4">
         <Skeleton className="h-2 w-full" />
       </div>
       <div className="mt-1 sm:mt-2">
         <Skeleton className="h-4 w-24" />
       </div>
     </CardContent>
   </Card>
    ))}
  </div>

  <div className="grid gap-2 sm:gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
    <Card>
      <CardHeader>
        <CardTitle><Skeleton className="h-6 w-40" /></CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[200px] w-full" />
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle><Skeleton className="h-6 w-48" /></CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[200px] w-full" />
      </CardContent>
    </Card>
  </div>

  <Card>
    <CardHeader>
      <CardTitle><Skeleton className="h-6 w-36" /></CardTitle>
    </CardHeader>
    <CardContent>
      <Skeleton className="h-[200px] w-full" />
    </CardContent>
  </Card>
</div>
</div>
  </SidebarInset>
</div>
)
}

export const useShop = () => {
 const context = useContext(ShopContext);
 if (context === undefined) {
   throw new Error("useShop must be used within a ShopProvider");
 }
 return context;
}