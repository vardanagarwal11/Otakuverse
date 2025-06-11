import { useState, useCallback } from 'react';
import { z } from 'zod';
import { notifications } from '@/components/ui/notifications';

interface UseFormValidationProps<T> {
  schema: z.ZodSchema<T>;
  onSubmit: (data: T) => Promise<void> | void;
  onError?: (error: z.ZodError) => void;
}

interface UseFormValidationReturn<T> {
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  resetErrors: () => void;
}

export function useFormValidation<T extends Record<string, any>>({
  schema,
  onSubmit,
  onError,
}: UseFormValidationProps<T>): UseFormValidationReturn<T> {
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetErrors = useCallback(() => {
    setErrors({});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    resetErrors();

    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    try {
      const validatedData = schema.parse(data);
      await onSubmit(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof T, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof T] = err.message;
          }
        });
        setErrors(newErrors);
        onError?.(error);
        notifications.error('Please check the form for errors');
      } else {
        notifications.error('An unexpected error occurred');
        console.error('Form submission error:', error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    errors,
    isSubmitting,
    resetErrors,
  };
}

// Example usage:
/*
const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const MyForm = () => {
  const { handleSubmit, errors, isSubmitting } = useFormValidation({
    schema: formSchema,
    onSubmit: async (data) => {
      // Handle form submission
    },
  });

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" />
      {errors.email && <span>{errors.email}</span>}
      
      <input name="password" type="password" />
      {errors.password && <span>{errors.password}</span>}
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};
*/ 