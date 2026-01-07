'use client';

import { X, Zap, Check } from 'lucide-react';
import Link from 'next/link';
import { PLANS, PlanType } from '@/lib/plans';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: string;
  currentPlan?: PlanType;
}

export function UpgradeModal({ isOpen, onClose, feature, currentPlan = 'free' }: UpgradeModalProps) {
  if (!isOpen) return null;

  const recommendedPlan = currentPlan === 'free' ? PLANS.pro : PLANS.business;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="w-16 h-16 bg-violet-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Zap className="w-8 h-8 text-violet-500" />
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            Upgrade to unlock
          </h2>
          <p className="text-slate-400">
            <span className="text-violet-400 font-medium">{feature}</span> is available on {recommendedPlan.name} plan and above.
          </p>
        </div>

        {/* Plan Preview */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">{recommendedPlan.name}</h3>
              <p className="text-sm text-slate-400">{recommendedPlan.description}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">${recommendedPlan.price.monthly}</div>
              <div className="text-xs text-slate-500">/month</div>
            </div>
          </div>

          <div className="space-y-2">
            {recommendedPlan.id === 'pro' ? (
              <>
                <FeatureItem text="500 links per month" />
                <FeatureItem text="Unlimited QR codes" />
                <FeatureItem text="90 days analytics" />
                <FeatureItem text="Password protected links" />
                <FeatureItem text="Custom link aliases" />
              </>
            ) : (
              <>
                <FeatureItem text="Unlimited everything" />
                <FeatureItem text="10 custom domains" />
                <FeatureItem text="API access" />
                <FeatureItem text="10 team members" />
                <FeatureItem text="Priority support" />
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href="/pricing"
            className="block w-full py-3 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-xl text-center transition-colors"
          >
            Upgrade Now
          </Link>
          <button
            onClick={onClose}
            className="block w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl text-center transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Check className="w-4 h-4 text-green-500" />
      <span className="text-slate-300">{text}</span>
    </div>
  );
}

// Simple usage limit banner component
export function UsageLimitBanner({
  used,
  limit,
  feature,
  planId = 'free',
}: {
  used: number;
  limit: number;
  feature: string;
  planId?: PlanType;
}) {
  const percentage = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;
  const isNearLimit = percentage >= 80;
  const isAtLimit = percentage >= 100;

  if (limit === -1) return null; // Unlimited

  return (
    <div
      className={`rounded-xl p-4 mb-6 ${
        isAtLimit
          ? 'bg-red-500/10 border border-red-500/20'
          : isNearLimit
          ? 'bg-yellow-500/10 border border-yellow-500/20'
          : 'bg-slate-800/50 border border-slate-700'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={`text-sm font-medium ${isAtLimit ? 'text-red-400' : isNearLimit ? 'text-yellow-400' : 'text-slate-300'}`}>
          {feature}
        </span>
        <span className={`text-sm ${isAtLimit ? 'text-red-400' : isNearLimit ? 'text-yellow-400' : 'text-slate-400'}`}>
          {used} / {limit}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            isAtLimit ? 'bg-red-500' : isNearLimit ? 'bg-yellow-500' : 'bg-violet-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {isAtLimit && (
        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-red-400">You've reached your monthly limit</p>
          <Link
            href="/pricing"
            className="text-xs bg-red-500 hover:bg-red-400 text-white px-3 py-1 rounded-full transition-colors"
          >
            Upgrade
          </Link>
        </div>
      )}
    </div>
  );
}
