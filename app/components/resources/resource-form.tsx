'use client';

import { useState, useActionState } from 'react';
import { createResource } from '@/app/actions/resources';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function ResourceForm() {
  const [description, setDescription] = useState('');
  const [state, formAction, isPending] = useActionState(
    async (_: unknown, formData: FormData) => createResource(_, formData),
    null
  );

  const maxDescriptionLength = 500;
  const remainingChars = maxDescriptionLength - description.length;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Submit a Resource</CardTitle>
        <CardDescription>
          Share a valuable learning resource with the community
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-red-700">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              type="text"
              placeholder="e.g., Advanced React Patterns Tutorial"
              required
              minLength={3}
              maxLength={100}
              disabled={isPending}
            />
            {state?.errors?.title && (
              <p className="text-sm text-red-700">{state.errors.title[0]}</p>
            )}
            <p className="text-xs text-zinc-600">3-100 characters</p>
          </div>

          {/* URL Field */}
          <div className="space-y-2">
            <Label htmlFor="url">
              URL <span className="text-red-700">*</span>
            </Label>
            <Input
              id="url"
              name="url"
              type="url"
              placeholder="https://example.com/resource"
              required
              disabled={isPending}
            />
            {state?.errors?.url && (
              <p className="text-sm text-red-700">{state.errors.url[0]}</p>
            )}
            <p className="text-xs text-zinc-600">Must start with http:// or https://</p>
          </div>

          {/* Type Field */}
          <div className="space-y-2">
            <Label htmlFor="type">
              Type <span className="text-red-700">*</span>
            </Label>
            <Select name="type" required disabled={isPending}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select resource type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="article">Article</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
              </SelectContent>
            </Select>
            {state?.errors?.type && (
              <p className="text-sm text-red-700">{state.errors.type[0]}</p>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Brief description of what this resource covers..."
              rows={4}
              maxLength={maxDescriptionLength}
              disabled={isPending}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {state?.errors?.description && (
              <p className="text-sm text-red-700">{state.errors.description[0]}</p>
            )}
            <p className="text-xs text-zinc-600">
              {remainingChars} characters remaining (max {maxDescriptionLength})
            </p>
          </div>

          {/* General Error Message */}
          {state?.error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
              {state.error}
            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" className="w-full bg-zinc-900 text-white hover:bg-zinc-800" disabled={isPending}>
            {isPending ? 'Creating Resource...' : 'Create Resource'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

