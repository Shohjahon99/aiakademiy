"use client"

import * as ToastPrimitive from "@radix-ui/react-toast"
import { useState } from "react"

export function Toaster() {
  return (
    <ToastPrimitive.Provider swipeDirection="right">
      <ToastPrimitive.Viewport className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-80" />
    </ToastPrimitive.Provider>
  )
}

export function Toast({
  title,
  description,
  variant = "default",
}: {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}) {
  const [open, setOpen] = useState(true)
  return (
    <ToastPrimitive.Root
      open={open}
      onOpenChange={setOpen}
      className={`rounded-lg border p-4 shadow-lg bg-white ${
        variant === "destructive" ? "border-red-500 text-red-700" : "border-gray-200"
      }`}
    >
      {title && <ToastPrimitive.Title className="font-bold text-sm">{title}</ToastPrimitive.Title>}
      {description && <ToastPrimitive.Description className="text-sm text-gray-600">{description}</ToastPrimitive.Description>}
    </ToastPrimitive.Root>
  )
}
