import * as React from "react"
import { cn } from "@/lib/utils"

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}

function Tabs({ value, defaultValue, onValueChange, children, className, ...props }: TabsProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue || "")
  
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue

  const handleValueChange = (newValue: string) => {
    onValueChange?.(newValue)
    if (!isControlled) {
      setInternalValue(newValue)
    }
  }

  return (
    <div className={cn(className)} data-value={currentValue} {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { 
            _value: currentValue, 
            _onValueChange: handleValueChange 
          })
        }
        return child
      })}
    </div>
  )
}

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  _value?: string
  _onValueChange?: (value: string) => void
}

function TabsList({ className, children, _value, _onValueChange, ...props }: TabsListProps) {
  return (
    <div className={cn("inline-flex items-center gap-1 rounded-lg bg-secondary p-1", className)} {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { _selectedValue: _value, _onSelect: _onValueChange })
        }
        return child
      })}
    </div>
  )
}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  _selectedValue?: string
  _onSelect?: (value: string) => void
}

function TabsTrigger({ className, value, _selectedValue, _onSelect, children, ...props }: TabsTriggerProps) {
  const isActive = value === _selectedValue
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all cursor-pointer",
        isActive ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground",
        className
      )}
      onClick={() => _onSelect?.(value)}
      {...props}
    >
      {children}
    </button>
  )
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  _value?: string
}

function TabsContent({ className, value, _value, children, ...props }: TabsContentProps) {
  const isSelected = value === _value
  if (!isSelected) return null
  return (
    <div
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
