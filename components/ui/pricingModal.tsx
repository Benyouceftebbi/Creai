"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PricingPlans } from "./pricingPlans"
import { Crown, X } from "lucide-react"

interface PricingModalProps {
  isOpen: boolean
  onClose: () => void
}
export function PricingModal({ isOpen, onClose }: PricingModalProps) {

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger asChild>
      <Button 
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
        size="sm"
        
      >
        <Crown className="h-4 w-4 " />
        <div className="ml-1 md:inline-block hidden">
        TopUp
        </div>
      </Button>

      </DialogTrigger>
      <DialogContent className="max-w-[1100px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select the plan that best fits your needs</DialogTitle>
        </DialogHeader>
       
        <PricingPlans className="max-h-[calc(90vh-100px)] overflow-y-auto pr-4" />
      </DialogContent>
    </Dialog>
  )
}
