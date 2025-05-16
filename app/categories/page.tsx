import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Search, Vote } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface Category {
  id: string;
  name: string;
  description: string;
  candidate_count: number;
  top_candidate_name: string | null;
  top_candidate_votes: number | null;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data);
        setFilteredCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!categories.length) return;

    const filtered = categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [categories, searchTerm]);

  return (
    <div className="container mx-auto py-12">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
        <Link href="/" className="hover:text-purple-600 dark:hover:text-purple-400">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900 dark:text-white">Categories</span>
      </div>

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
          Award Categories
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Browse through our award categories and discover talented candidates in each field.
        </p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-500 dark:text-gray-400" />
          <Input
            placeholder="Search categories..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          // Loading skeletons
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
              <Skeleton className="mb-3 h-6 w-3/4" />
              <Skeleton className="mb-4 h-4 w-full" />
              <Skeleton className="mb-4 h-4 w-full" />
              <div className="mb-4 flex items-center justify-between">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
          ))
        ) : filteredCategories.length === 0 ? (
          <div className="col-span-full rounded-lg bg-white p-8 text-center shadow-md dark:bg-gray-800">
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              No categories found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              No categories match your search criteria.
            </p>
          </div>
        ) : (
          filteredCategories.map((category) => (
            <div
              key={category.id}
              className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg dark:bg-gray-800"
            >
              <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                {category.name}
              </h2>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                {category.description}
              </p>
              <div className="mb-4 flex items-center justify-between">
                <Badge variant="outline" className="bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300">
                  {category.candidate_count} {category.candidate_count === 1 ? 'Candidate' : 'Candidates'}
                </Badge>
                {category.top_candidate_name && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Vote className="mr-1 h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <span>
                      Leading: {category.top_candidate_name} ({category.top_candidate_votes})
                    </span>
                  </div>
                )}
              </div>
              <Button className="w-full" asChild>
                <Link href={`/candidates?category=${encodeURIComponent(category.name)}`}>
                  View Candidates
                </Link>
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Apply CTA */}
      <div className="mt-12 rounded-lg bg-purple-50 p-6 text-center shadow-sm dark:bg-purple-900/20">
        <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
          Want to participate as a candidate?
        </h2>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Apply now to be featured in our award election and get a chance to win!
        </p>
        <Button asChild>
          <Link href="/apply">Apply as Candidate</Link>
        </Button>
      </div>
    </div>
  );
}