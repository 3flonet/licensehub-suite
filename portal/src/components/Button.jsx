import { forwardRef } from 'react'
import { cn } from '@utils/cn'

const buttonVariants = {
  solid: 'bg-primary text-primary-foreground hover:bg-primary/90',
  outline: 'border border-input bg-background hover:bg-muted',
  ghost: 'hover:bg-muted hover:text-foreground',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
}

const sizeVariants = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4',
  lg: 'h-12 px-6',
  icon: 'h-10 w-10',
}

export const Button = forwardRef(
  ({ className, variant = 'solid', size = 'md', ...props }, ref) => (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        buttonVariants[variant],
        sizeVariants[size],
        className
      )}
      ref={ref}
      {...props}
    />
  )
)

Button.displayName = 'Button'

export default Button
