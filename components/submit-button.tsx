'use client';

import { Button, ButtonSize, ButtonVariant } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useFormStatus } from 'react-dom';
import { Spinner } from './ui/shadcn-io/spinner';

type SubmitButtonProps = {
    className?: string;
    children: React.ReactNode;
    loading?: boolean;
    disabled?: boolean;
    variant?: ButtonVariant;
    size?: ButtonSize;
    type?: 'submit' | 'button' | 'reset';
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const SubmitButton: React.FC<SubmitButtonProps> = ({
    className,
    children,
    loading = false,
    disabled = false,
    variant = 'primary',
    size = 'default',
    type = 'submit',
    ...rest
}) => {
    const { pending } = useFormStatus();

    return (
        <Button
            disabled={pending || loading || disabled}
            size={size}
            variant={variant === 'primary' ? 'default' : variant}
            type={type}
            className={cn(
                className,
                'disabled:opacity-50 disabled:cursor-not-allowed',
            )}
            {...rest}
        >
            {pending || loading ? (
                <span className="flex items-center gap-1.5">
                    <Spinner />
                </span>
            ) : (
                children
            )}
        </Button>
    );
};

export default SubmitButton;