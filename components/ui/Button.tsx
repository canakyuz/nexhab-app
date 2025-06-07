import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Pressable } from 'react-native';
import { TextClassContext } from '~/components/ui/text';
import { cn } from '~/lib/utils';

const buttonVariants = cva(
  'group flex items-center justify-center web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-primary shadow-md shadow-primary/20 web:hover:opacity-90 active:opacity-90 rounded-xl',
        destructive: 'bg-destructive shadow-md shadow-destructive/20 web:hover:opacity-90 active:opacity-90 rounded-xl',
        outline:
          'border border-input bg-background shadow-sm web:hover:bg-accent web:hover:text-accent-foreground active:bg-accent rounded-xl',
        secondary: 'bg-secondary shadow-sm web:hover:opacity-80 active:opacity-80 rounded-xl',
        ghost: 'web:hover:bg-accent web:hover:text-accent-foreground active:bg-accent',
        link: 'web:underline-offset-4 web:hover:underline web:focus:underline',
        rounded: 'bg-primary shadow-md shadow-primary/20 web:hover:opacity-90 active:opacity-90 rounded-full',
        success: 'bg-success shadow-md shadow-success/20 web:hover:opacity-90 active:opacity-90 rounded-full',
        warning: 'bg-warning shadow-md shadow-warning/20 web:hover:opacity-90 active:opacity-90 rounded-full',
        destructiveRounded: 'bg-destructive shadow-md shadow-destructive/20 web:hover:opacity-90 active:opacity-90 rounded-full',
      },
      size: {
        default: 'h-12 px-5 py-3 native:h-14 native:px-6 native:py-4',
        sm: 'h-10 px-4 py-2',
        lg: 'h-14 px-8 py-3 native:h-16 native:px-10 native:py-4',
        icon: 'h-12 w-12',
        circle: 'h-14 w-14',
        fab: 'h-16 w-16',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const buttonTextVariants = cva(
  'web:whitespace-nowrap text-base native:text-lg font-semibold text-foreground web:transition-colors',
  {
    variants: {
      variant: {
        default: 'text-primary-foreground',
        destructive: 'text-destructive-foreground',
        outline: 'group-active:text-accent-foreground',
        secondary: 'text-secondary-foreground group-active:text-secondary-foreground',
        ghost: 'group-active:text-accent-foreground',
        link: 'text-primary group-active:underline',
        rounded: 'text-primary-foreground',
        success: 'text-success-foreground',
        warning: 'text-warning-foreground',
        destructiveRounded: 'text-destructive-foreground',
      },
      size: {
        default: '',
        sm: 'text-sm native:text-base',
        lg: 'text-lg native:text-xl',
        icon: '',
        circle: '',
        fab: 'text-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

type ButtonProps = React.ComponentProps<typeof Pressable> & VariantProps<typeof buttonVariants>;

function Button({ ref, className, variant, size, ...props }: ButtonProps) {
  return (
    <TextClassContext.Provider
      value={buttonTextVariants({ variant, size, className: 'web:pointer-events-none' })}
    >
      <Pressable
        className={cn(
          props.disabled && 'opacity-50 web:pointer-events-none',
          buttonVariants({ variant, size, className })
        )}
        ref={ref}
        role='button'
        {...props}
      />
    </TextClassContext.Provider>
  );
}

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };
