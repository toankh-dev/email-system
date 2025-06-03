import { Loader2Icon } from 'lucide-react';

import { Button, buttonVariants } from '@/components/ui/button';
import { VariantProps } from 'class-variance-authority';

type ButtonLoadingProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    title?: string;
    loading?: boolean;
  };

export const ButtonLoading: React.FC<ButtonLoadingProps> = props => {
  return (
    <Button {...props}>
      {props.loading ? (
        <div className="flex items-center gap-2">
          <Loader2Icon className="animate-spin" />
          <span>{props.title}</span>
        </div>
      ) : (
        <span>{props.title}</span>
      )}
    </Button>
  );
};
