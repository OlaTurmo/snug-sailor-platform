
import { useState, useEffect } from "react";
import { Asset, Liability } from "@/types/finance";
import { supabase } from "@/lib/supabase";
import { User } from "@/types/user";

export const useFinanceData = (user: User | null) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [liabilities, setLiabilities] = useState<Liability[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        console.log('Fetching data for user:', user.id);
        const { data: projectData, error: projectError } = await supabase
          .from('estate_projects')
          .select('id')
          .eq('responsible_heir_id', user.id)
          .maybeSingle();

        if (projectError) {
          console.error('Error fetching project:', projectError);
          return;
        }

        if (!projectData) {
          console.log('No project found for user');
          return;
        }

        console.log('Found project:', projectData);

        const { data: assetsData, error: assetsError } = await supabase
          .from('assets')
          .select('*')
          .eq('estate_project_id', projectData.id);

        if (assetsError) {
          console.error('Error fetching assets:', assetsError);
        } else {
          console.log('Fetched assets:', assetsData);
          setAssets(assetsData as Asset[] || []);
        }

        const { data: liabilitiesData, error: liabilitiesError } = await supabase
          .from('liabilities')
          .select('*')
          .eq('estate_project_id', projectData.id);

        if (liabilitiesError) {
          console.error('Error fetching liabilities:', liabilitiesError);
        } else {
          console.log('Fetched liabilities:', liabilitiesData);
          setLiabilities(liabilitiesData as Liability[] || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return { assets, setAssets, liabilities, setLiabilities, isLoading };
};
