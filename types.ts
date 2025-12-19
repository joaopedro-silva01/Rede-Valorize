export enum Segment {
  HEALTH = 'SAÚDE',
  BEAUTY = 'BELEZA E BEM ESTAR',
  PET = 'PET',
  HOME = 'CASA',
  AUTO = 'VEÍCULOS',
  EDUCATION = 'EDUCAÇÃO',
  FITNESS = 'FITNESS',
  FOOD = 'ALIMENTAÇÃO E BEBIDAS',
  LEISURE = 'LAZER E CINEMA',
  OTHER = 'OUTROS'
}

export enum ContractStatus {
  ACTIVE = 'Ativo',
  REVIEW = 'Em Análise',
  RISK = 'Risco de Cancelamento'
}

export interface Partner {
  id: string;
  name: string;
  location: string; // Neighborhood in Uberlândia
  segment: Segment;
  contractStart: string;
  usageScore: number; // 0-100 score indicating generated value/usage
  monthlyRevenue: number; // Estimated value generated
  benefits: string[];
  status: ContractStatus;
  isOnWebsite: boolean; // Se está visível/vigente no site
  isTop20: boolean; // Calculated field
}

export interface AnalysisResult {
  partnerId: string;
  recommendation: string;
  strategy: string;
}