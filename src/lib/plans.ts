// Pricing Plans Configuration

export type PlanType = 'free' | 'pro' | 'business';

export interface PlanFeatures {
  linksPerMonth: number;
  qrCodesPerMonth: number;
  bioPages: number;
  analyticsRetentionDays: number;
  customDomains: number;
  teamMembers: number;
  apiAccess: boolean;
  passwordProtectedLinks: boolean;
  linkExpiry: boolean;
  customAliases: boolean;
  exportAnalytics: boolean;
  advancedAnalytics: boolean; // heatmaps, referrers detail
  prioritySupport: boolean;
  clicksPerMonth: number; // -1 = unlimited
}

export interface Plan {
  id: PlanType;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: PlanFeatures;
  popular?: boolean;
}

export const PLANS: Record<PlanType, Plan> = {
  free: {
    id: 'free',
    name: 'Free',
    description: 'Perfect for getting started',
    price: {
      monthly: 0,
      yearly: 0,
    },
    features: {
      linksPerMonth: 25,
      qrCodesPerMonth: 10,
      bioPages: 1,
      analyticsRetentionDays: 7,
      customDomains: 0,
      teamMembers: 1,
      apiAccess: false,
      passwordProtectedLinks: false,
      linkExpiry: false,
      customAliases: false,
      exportAnalytics: false,
      advancedAnalytics: false,
      prioritySupport: false,
      clicksPerMonth: 1000,
    },
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    description: 'For growing businesses',
    price: {
      monthly: 12,
      yearly: 99,
    },
    popular: true,
    features: {
      linksPerMonth: 500,
      qrCodesPerMonth: -1, // unlimited
      bioPages: 5,
      analyticsRetentionDays: 90,
      customDomains: 1,
      teamMembers: 3,
      apiAccess: false,
      passwordProtectedLinks: true,
      linkExpiry: true,
      customAliases: true,
      exportAnalytics: true,
      advancedAnalytics: true,
      prioritySupport: false,
      clicksPerMonth: 50000,
    },
  },
  business: {
    id: 'business',
    name: 'Business',
    description: 'For teams and enterprises',
    price: {
      monthly: 29,
      yearly: 249,
    },
    features: {
      linksPerMonth: -1, // unlimited
      qrCodesPerMonth: -1,
      bioPages: -1,
      analyticsRetentionDays: 365,
      customDomains: 10,
      teamMembers: 10,
      apiAccess: true,
      passwordProtectedLinks: true,
      linkExpiry: true,
      customAliases: true,
      exportAnalytics: true,
      advancedAnalytics: true,
      prioritySupport: true,
      clicksPerMonth: -1,
    },
  },
};

// Helper functions
export function getPlan(planId: PlanType): Plan {
  return PLANS[planId] || PLANS.free;
}

export function getPlanFeatures(planId: PlanType): PlanFeatures {
  return getPlan(planId).features;
}

export function canUseFeature(planId: PlanType, feature: keyof PlanFeatures): boolean {
  const features = getPlanFeatures(planId);
  const value = features[feature];

  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'number') {
    return value !== 0;
  }
  return false;
}

export function getLimit(planId: PlanType, feature: keyof PlanFeatures): number {
  const features = getPlanFeatures(planId);
  const value = features[feature];
  return typeof value === 'number' ? value : 0;
}

export function isUnlimited(planId: PlanType, feature: keyof PlanFeatures): boolean {
  return getLimit(planId, feature) === -1;
}

export function formatLimit(value: number): string {
  if (value === -1) return 'Unlimited';
  if (value === 0) return 'Not available';
  return value.toLocaleString();
}

// Feature display names for UI
export const FEATURE_NAMES: Record<keyof PlanFeatures, string> = {
  linksPerMonth: 'Links per month',
  qrCodesPerMonth: 'QR codes per month',
  bioPages: 'Bio pages',
  analyticsRetentionDays: 'Analytics retention',
  customDomains: 'Custom domains',
  teamMembers: 'Team members',
  apiAccess: 'API access',
  passwordProtectedLinks: 'Password protected links',
  linkExpiry: 'Link expiry dates',
  customAliases: 'Custom aliases',
  exportAnalytics: 'Export analytics',
  advancedAnalytics: 'Advanced analytics',
  prioritySupport: 'Priority support',
  clicksPerMonth: 'Clicks per month',
};
