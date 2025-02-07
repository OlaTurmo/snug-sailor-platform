
import { useState, useEffect } from "react";
import { Asset, Liability } from "@/types/finance";
import { supabase } from "@/lib/supabase";
import { User } from "@/types/user";
import { toast } from "@/components/ui/use-toast";

export const useFinanceData = (user: User | null) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [liabilities, setLiabilities] = useState<Liability[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        console.log('No user provided to useFinanceData');
        setIsLoading(false);
        return;
      }

      try {
        console.log('Fetching project data for user:', user.id);
        
        // First try to get existing project
        let { data: projectData, error: projectError } = await supabase
          .from('estate_projects')
          .select('id')
          .eq('responsible_heir_id', user.id)
          .maybeSingle();

        if (projectError) {
          console.error('Error fetching project:', projectError);
          toast({
            title: "Feil ved henting av prosjekt",
            description: "Kunne ikke hente prosjektdata",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        // If no project exists, create one
        if (!projectData) {
          console.log('No project found, creating new project for user');
          const { data: newProject, error: createError } = await supabase
            .from('estate_projects')
            .insert([
              {
                name: 'Dødsbo',
                responsible_heir_id: user.id
              }
            ])
            .select('id')
            .single();

          if (createError) {
            console.error('Error creating project:', createError);
            toast({
              title: "Feil ved opprettelse av prosjekt",
              description: "Kunne ikke opprette nytt prosjekt",
              variant: "destructive",
            });
            setIsLoading(false);
            return;
          }

          projectData = newProject;
          console.log('Created new project:', projectData);
        }

        // Now fetch assets and liabilities using the project ID
        const [assetsResult, liabilitiesResult] = await Promise.all([
          supabase
            .from('assets')
            .select('*')
            .eq('estate_project_id', projectData.id),
          supabase
            .from('liabilities')
            .select('*')
            .eq('estate_project_id', projectData.id)
        ]);

        if (assetsResult.error) {
          console.error('Error fetching assets:', assetsResult.error);
          toast({
            title: "Feil ved henting av eiendeler",
            description: "Kunne ikke hente eiendeler",
            variant: "destructive",
          });
        } else {
          console.log('Fetched assets:', assetsResult.data);
          setAssets(assetsResult.data || []);
        }

        if (liabilitiesResult.error) {
          console.error('Error fetching liabilities:', liabilitiesResult.error);
          toast({
            title: "Feil ved henting av gjeld",
            description: "Kunne ikke hente gjeld",
            variant: "destructive",
          });
        } else {
          console.log('Fetched liabilities:', liabilitiesResult.data);
          setLiabilities(liabilitiesResult.data || []);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        toast({
          title: "Uventet feil",
          description: "En uventet feil oppstod ved henting av data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return { assets, setAssets, liabilities, setLiabilities, isLoading };
};
