import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ReactNode } from "react"

export interface FormInputProps {
  label: string
  name: string
  type: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  icon?: ReactNode
  startContent?: ReactNode
}

export function FormInput({
  label,
  name,
  type,
  value,
  onChange,
  placeholder,
  icon,
  startContent,
}: FormInputProps) {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor={name}>{label}</Label>
      <div className="relative">
        {(icon || startContent) && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            {icon || startContent}
          </div>
        )}
        <Input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={icon || startContent ? "pl-10" : ""}
        />
      </div>
    </div>
  )
} 