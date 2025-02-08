"use client"

import * as React from "react"
import { FaComputer } from "react-icons/fa6"
import { Button } from "./ui/button"

interface AccountSwitcherProps {
  isCollapsed: boolean
  accounts: {
    label: string
    email: string
    icon: React.ReactNode
  }[]
}

export function AccountSwitcher({
  isCollapsed,
}: AccountSwitcherProps) {
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    isCollapsed ? (
      <Button size={"icon"}><FaComputer /></Button>
    ) : (
      <Button 
        className="w-full" 
        variant={isHovered ? "destructive" : "outline"}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isHovered ? "Reset Data" : "Unleashed.AI"}
      </Button>
    )
  )
}