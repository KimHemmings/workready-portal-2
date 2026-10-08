import { useMemo } from 'react';

export type MarketSegment = 'workforce_au' | 'des' | 'parentsnext_ttw' | 'rto_tafe';

export interface DemoUrlParams {
  mode: 'prospect' | 'sales_rep';
  market?: MarketSegment;
  providerName: string;
  repName?: string;
  isProspect: boolean;
}

export function useDemoParams(): DemoUrlParams {
  return useMemo(() => {
    const searchParams = new URLSearchParams(window.location.search);
    
    // Parse 'mode' (defaulting to internal sales_rep view if empty)
    const rawMode = searchParams.get('mode') || searchParams.get('role');
    const mode = rawMode === 'prospect' ? 'prospect' : 'sales_rep';
    
    // Parse 'market' preset if specified in URL
    const rawMarket = searchParams.get('market');
    const validMarkets: MarketSegment[] = ['workforce_au', 'des', 'parentsnext_ttw', 'rto_tafe'];
    const market = validMarkets.includes(rawMarket as MarketSegment) 
      ? (rawMarket as MarketSegment) 
      : undefined;

    // Parse personalization strings
    const providerName = searchParams.get('provider') || searchParams.get('name') || 'Partner Provider';
    const repName = searchParams.get('rep') || undefined;

    return {
      mode,
      market,
      providerName,
      repName,
      isProspect: mode === 'prospect'
    };
  }, [window.location.search]);
}