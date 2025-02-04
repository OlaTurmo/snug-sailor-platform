
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { BlogPost } from "@/types/blog";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('published_at', { ascending: false });

        if (error) throw error;

        setPosts(data);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load blog posts. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [toast]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-primary">Blogg</h1>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            // Loading skeletons
            [...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))
          ) : posts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-lg text-gray-600">Ingen blogginnlegg er publisert ennå.</p>
            </div>
          ) : (
            posts.map((post) => (
              <article 
                key={post.id} 
                className="bg-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <h2 className="text-2xl font-semibold mb-2 text-card-foreground">
                    {post.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    {format(new Date(post.published_at), 'dd.MM.yyyy')}
                  </p>
                  <p className="text-card-foreground mb-4">
                    {post.excerpt || post.content.slice(0, 150) + '...'}
                  </p>
                  <a 
                    href={`/blog/${post.slug}`} 
                    className="text-primary hover:text-primary/80"
                  >
                    Les mer →
                  </a>
                </div>
              </article>
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
