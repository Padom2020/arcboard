'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Category } from '@/lib/types/dapp';
import { useToast } from '@/components/ui/toast';

interface DAppSubmissionFormProps {
  categories: Category[];
}

interface FormData {
  name: string;
  description: string;
  category: string;
  websiteUrl: string;
  contactEmail: string;
  logoUrl: string;
  features: string;
}

interface FormErrors {
  [key: string]: string;
}

export function DAppSubmissionForm({ categories }: DAppSubmissionFormProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    category: '',
    websiteUrl: '',
    contactEmail: '',
    logoUrl: '',
    features: '',
  });

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Name must be less than 100 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.websiteUrl.trim()) {
      newErrors.websiteUrl = 'Website URL is required';
    } else {
      try {
        new URL(formData.websiteUrl);
      } catch {
        newErrors.websiteUrl = 'Please enter a valid URL';
      }
    }

    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Contact email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }

    if (formData.logoUrl && formData.logoUrl.trim()) {
      try {
        new URL(formData.logoUrl);
      } catch {
        newErrors.logoUrl = 'Please enter a valid URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const features = formData.features
        .split('\n')
        .map((f) => f.trim())
        .filter((f) => f.length > 0);

      const response = await fetch('/api/dapps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim(),
          category: formData.category,
          websiteUrl: formData.websiteUrl.trim(),
          contactEmail: formData.contactEmail.trim(),
          logoUrl: formData.logoUrl.trim() || undefined,
          features,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error?.details) {
          setErrors(data.error.details);
          addToast({
            title: 'Validation Error',
            description: 'Please check the form for errors',
            variant: 'error',
          });
        } else {
          setErrors({ general: data.error?.message || 'Failed to submit DApp' });
          addToast({
            title: 'Submission Failed',
            description: data.error?.message || 'Failed to submit DApp',
            variant: 'error',
          });
        }
        return;
      }

      setIsSuccess(true);
      addToast({
        title: 'Success!',
        description: 'Your DApp has been submitted for review',
        variant: 'success',
      });
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        category: '',
        websiteUrl: '',
        contactEmail: '',
        logoUrl: '',
        features: '',
      });

      // Redirect to directory after 3 seconds
      setTimeout(() => {
        router.push('/dapps');
      }, 3000);
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
      addToast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Submission Successful!</h3>
            <p className="text-muted-foreground mb-4">
              Your DApp has been submitted and is pending approval.
            </p>
            <p className="text-sm text-muted-foreground">
              Redirecting to directory...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Your DApp</CardTitle>
        <CardDescription>
          Fill out the form below to submit your DApp to the directory. All submissions are reviewed before being published.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <Alert variant="destructive">
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              DApp Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="My Awesome DApp"
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe your DApp and what makes it unique..."
              rows={4}
              className={errors.description ? 'border-destructive' : ''}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {formData.description.length}/1000 characters
            </p>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">
              Category <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleChange('category', value)}
            >
              <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-destructive">{errors.category}</p>
            )}
          </div>

          {/* Website URL */}
          <div className="space-y-2">
            <Label htmlFor="websiteUrl">
              Website URL <span className="text-destructive">*</span>
            </Label>
            <Input
              id="websiteUrl"
              type="url"
              value={formData.websiteUrl}
              onChange={(e) => handleChange('websiteUrl', e.target.value)}
              placeholder="https://example.com"
              className={errors.websiteUrl ? 'border-destructive' : ''}
            />
            {errors.websiteUrl && (
              <p className="text-sm text-destructive">{errors.websiteUrl}</p>
            )}
          </div>

          {/* Contact Email */}
          <div className="space-y-2">
            <Label htmlFor="contactEmail">
              Contact Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={(e) => handleChange('contactEmail', e.target.value)}
              placeholder="contact@example.com"
              className={errors.contactEmail ? 'border-destructive' : ''}
            />
            {errors.contactEmail && (
              <p className="text-sm text-destructive">{errors.contactEmail}</p>
            )}
          </div>

          {/* Logo URL (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="logoUrl">Logo URL (Optional)</Label>
            <Input
              id="logoUrl"
              type="url"
              value={formData.logoUrl}
              onChange={(e) => handleChange('logoUrl', e.target.value)}
              placeholder="https://example.com/logo.png"
              className={errors.logoUrl ? 'border-destructive' : ''}
            />
            {errors.logoUrl && (
              <p className="text-sm text-destructive">{errors.logoUrl}</p>
            )}
          </div>

          {/* Features (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="features">Features (Optional)</Label>
            <Textarea
              id="features"
              value={formData.features}
              onChange={(e) => handleChange('features', e.target.value)}
              placeholder="Enter each feature on a new line&#10;Feature 1&#10;Feature 2&#10;Feature 3"
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Enter each feature on a new line
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit DApp'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dapps')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
