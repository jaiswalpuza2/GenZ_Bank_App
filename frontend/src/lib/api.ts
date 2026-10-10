// ─── API client ──────────────────────────────────────────────────────────────
// This module wraps @appdeploy/client which is injected at runtime by the
// AppDeploy platform. The import is marked external in vite.config.ts so the
// build succeeds — the platform provides the module via its script loader.
//
// When running outside the platform (e.g. local dev without AppDeploy), the
// functions throw a descriptive error instead of silently failing.

// @ts-expect-error — @appdeploy/client is provided by the AppDeploy runtime,
// not a local npm package. It is marked external in the Vite build config.
import { auth as _auth, api as _api } from '@appdeploy/client';

import type { AccountData } from '../types';

// ─── Platform type stubs ──────────────────────────────────────────────────────
// These describe the shape of the runtime-injected auth and api objects.
// The actual implementations are provided by the AppDeploy platform.

interface PlatformAuth {
  getUser(): Promise<unknown>;
  signIn(options: { scope: string }): Promise<void>;
  signOut(): Promise<void>;
}

interface PlatformApi {
  get(path: string): Promise<{ data: unknown }>;
  post(path: string, body: unknown): Promise<{ data: unknown }>;
  put(path: string, body: unknown): Promise<{ data: unknown }>;
}

const auth = _auth as PlatformAuth | undefined;
const api = _api as PlatformApi | undefined;

function requireAuth(): PlatformAuth {
  if (!auth) {
    throw new Error(
      'Authentication is not available. ' +
        'This app must be deployed on the AppDeploy platform to use auth.'
    );
  }
  return auth;
}

function requireApi(): PlatformApi {
  if (!api) {
    throw new Error(
      'The API client is not available. ' +
        'This app must be deployed on the AppDeploy platform to use the API.'
    );
  }
  return api;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function getAuthUser(): Promise<unknown> {
  return requireAuth().getUser();
}

export async function signIn(): Promise<void> {
  return requireAuth().signIn({
    scope: 'openid email profile offline_access',
  });
}

export async function signOut(): Promise<void> {
  return requireAuth().signOut();
}

// ─── Account data ─────────────────────────────────────────────────────────────

export async function fetchAccountData(): Promise<AccountData> {
  const response = await requireApi().get('/api/me');
  return response.data as AccountData;
}

// ─── Money movement ───────────────────────────────────────────────────────────

export async function recordMoneyMovement(
  kind: 'deposit' | 'withdrawal',
  /** Amount in NPR (not paisa) */
  amountNpr: number,
  description: string
): Promise<{ transaction: { reference: string } }> {
  const response = await requireApi().post('/api/money-movement', {
    kind,
    amount: amountNpr,
    description,
  });
  return response.data as { transaction: { reference: string } };
}

// ─── Savings goals ────────────────────────────────────────────────────────────

export async function createSavingsGoal(
  name: string,
  /** Target amount in NPR (not paisa) */
  targetAmountNpr: number,
  targetDate: string
): Promise<void> {
  await requireApi().post('/api/goals', {
    name,
    targetAmount: targetAmountNpr,
    targetDate,
  });
}

export async function contributeToGoal(
  goalId: string,
  /** Contribution amount in NPR (not paisa) */
  amountNpr: number
): Promise<void> {
  await requireApi().post(`/api/goals/${goalId}/contribute`, {
    amount: amountNpr,
  });
}

// ─── Card settings ────────────────────────────────────────────────────────────

export async function updateCardSettings(
  changes: Partial<{
    frozen: boolean;
    onlineEnabled: boolean;
    /** Daily limit in NPR (not paisa) */
    dailyLimit: number;
  }>
): Promise<void> {
  await requireApi().put('/api/card', changes);
}

// ─── Notifications ────────────────────────────────────────────────────────────

export async function markAllNotificationsRead(): Promise<void> {
  await requireApi().put('/api/notifications/read-all', {});
}
