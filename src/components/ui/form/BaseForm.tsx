'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, UseFormProps, UseFormReturn, FieldValues } from 'react-hook-form';
import { z } from 'zod';

import { ButtonLoading } from '@/components/ui/button';
import { forwardRef, useImperativeHandle } from 'react';
import { Form } from './Form';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

interface FormProps<TFieldValues extends FieldValues = FieldValues> extends Omit<UseFormProps<TFieldValues>, 'resolver'> {
  schema: z.ZodRawShape;
  children: (form: UseFormReturn<TFieldValues>) => React.ReactNode;
  className?: string;
  onSubmit: (data: TFieldValues) => void;
}

function BaseFormInner<TFieldValues extends FieldValues = FieldValues>(
  props: FormProps<TFieldValues>,
  ref: React.Ref<UseFormReturn<TFieldValues>>
) {
  const { schema, children, className, onSubmit, ...rest } = props;
  const text = useTranslations('BaseForm');

  const formSchema = z.object(schema);

  const form = useForm<TFieldValues>({
    resolver: zodResolver(formSchema) as any,
    ...rest,
  });

  useImperativeHandle(ref, () => form);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={clsx('space-y-8', className)}>
        {children(form)}
        <div className="flex justify-end">
          <ButtonLoading
            className="rounded-md bg-gray-600 px-6 py-2 text-white hover:bg-gray-700"
            loading={form.formState.isSubmitting}
            title={text('save')}
            type="submit"
          />
        </div>
      </form>
    </Form>
  );
}

export const BaseForm = forwardRef(BaseFormInner) as <TFieldValues extends FieldValues = FieldValues>(
  props: FormProps<TFieldValues> & { ref?: React.Ref<UseFormReturn<TFieldValues>> }
) => React.ReactElement;
