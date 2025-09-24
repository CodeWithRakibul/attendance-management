'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Modal } from './ui/modal';
import SubmitButton from './submit-button';

interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    loading: boolean;
    confirmLabel?: string;
}

export const AlertModal: React.FC<AlertModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Are you sure?",
    description = 'This action cannot be undone.',
    loading,
    confirmLabel
}) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <Modal
            title={title}
            description={description}
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className='flex w-full items-center justify-end space-x-2 pt-6'>
                <Button disabled={loading} variant='outline' size="sm" onClick={onClose}>
                    Cancel
                </Button>
                <SubmitButton loading={loading} variant='destructive' onClick={onConfirm}>
                    {confirmLabel || "Continue"}
                </SubmitButton>
            </div>
        </Modal>
    );
};