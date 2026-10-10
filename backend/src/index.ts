import { router, json, error, db, requireAuth } from '@appdeploy/sdk';

type LedgerItem = {
  id: string;
  type: 'deposit' | 'withdrawal' | 'contribution';
  amountPaisa: number;
  description: string;
  reference: string;
  createdAt: string;
  status: 'completed';
};

type Goal = {
  id: string;
  name: string;
  targetPaisa: number;
  savedPaisa: number;
  targetDate: string;
};
type BankRecord = {
  ownerId: string;
  balancePaisa: number;
  accountNumber: string;
  nickname: string;
  transactions: LedgerItem[];
  goals: Goal[];
  notifications: {
    id: string;
    title: string;
    detail: string;
    createdAt: string;
    read: boolean;
  }[];
  card: { frozen: boolean; onlineEnabled: boolean; dailyLimitPaisa: number };
  createdAt: string;
  updatedAt: string;
};

const tableFor = (userId: string) =>
  'genz-bank-' + userId.replace(/[^a-zA-Z0-9_-]/g, '_');
const reference = () =>
  'GZ' +
  Date.now().toString(36).toUpperCase() +
  Math.random().toString(36).slice(2, 6).toUpperCase();
const makeId = () => Math.random().toString(36).slice(2, 11);

async function loadOrCreate(user: {
  userId: string;
  name?: string;
  email?: string;
}) {
  const table = tableFor(user.userId);
  const { items } = await db.list<BankRecord>(table, { limit: 1 });
  if (items.length) return { table, record: items[0] };
  const now = new Date().toISOString();
  const initial: BankRecord = {
    ownerId: user.userId,
    balancePaisa: 2500000,
    accountNumber: 'GZ' + user.userId.replace(/-/g, '').slice(-8).toUpperCase(),
    nickname: 'Everyday account',
    transactions: [
      {
        id: makeId(),
        type: 'deposit',
        amountPaisa: 2500000,
        description: 'Welcome demo balance',
        reference: reference(),
        createdAt: now,
        status: 'completed',
      },
    ],
    goals: [
      {
        id: makeId(),
        name: 'Emergency fund',
        targetPaisa: 10000000,
        savedPaisa: 0,
        targetDate: '',
      },
    ],
    notifications: [
      {
        id: makeId(),
        title: 'Welcome to GenZ Bank',
        detail:
          'Your demo account is ready. Funds are simulated and have no cash value.',
        createdAt: now,
        read: false,
      },
    ],
    card: { frozen: false, onlineEnabled: true, dailyLimitPaisa: 1000000 },
    createdAt: now,
    updatedAt: now,
  };
  const [id] = await db.add(table, [initial]);
  if (!id) throw new Error('Could not create demo account');
  return { table, record: { ...initial, id } };
}

async function save(table: string, record: BankRecord & { id: string }) {
  const { id, ...stored } = record;
  const [ok] = await db.update(table, [
    { id, record: { ...stored, updatedAt: new Date().toISOString() } },
  ]);
  if (!ok) throw new Error('Could not save account changes');
  return { ...stored, id, updatedAt: new Date().toISOString() };
}

const accountView = (record: BankRecord & { id: string }) => ({
  account: {
    id: record.accountNumber,
    nickname: record.nickname,
    balancePaisa: record.balancePaisa,
    currency: 'NPR',
    status: 'Active demo account',
    createdAt: record.createdAt,
  },
  transactions: record.transactions.slice(0, 50),
  goals: record.goals,
  notifications: record.notifications,
  card: record.card,
});

export const handler = router({
  'GET /api/health': [
    async () => json({ ok: true, service: 'GenZ Bank demo' }),
  ],
  'GET /api/me': [
    requireAuth(),
    async ctx => {
      try {
        const { record } = await loadOrCreate(ctx.user!);
        return json({
          user: {
            id: ctx.user!.userId,
            name: ctx.user!.name || 'GenZ member',
            email: ctx.user!.email || '',
          },
          ...accountView(record),
        });
      } catch {
        return error(
          'Unable to load your demo account. Please try again.',
          500
        );
      }
    },
  ],
  'POST /api/money-movement': [
    requireAuth(),
    async ctx => {
      try {
        const body = (ctx.body || {}) as {
          kind?: string;
          amount?: number;
          description?: string;
        };
        if (body.kind !== 'deposit' && body.kind !== 'withdrawal')
          return error('Choose a valid demo operation.', 400);
        if (
          typeof body.amount !== 'number' ||
          !Number.isFinite(body.amount) ||
          body.amount <= 0 ||
          body.amount > 500000
        )
          return error(
            'Enter an amount between NPR 0.01 and NPR 500,000.',
            400
          );
        const amountPaisa = Math.round(body.amount * 100);
        if (amountPaisa < 1)
          return error('Amount must be at least NPR 0.01.', 400);
        const { table, record } = await loadOrCreate(ctx.user!);
        if (body.kind === 'withdrawal' && amountPaisa > record.balancePaisa)
          return error('Insufficient demo balance for this withdrawal.', 400);
        const nextBalance =
          body.kind === 'deposit'
            ? record.balancePaisa + amountPaisa
            : record.balancePaisa - amountPaisa;
        const entry: LedgerItem = {
          id: makeId(),
          type: body.kind,
          amountPaisa,
          description: (
            body.description ||
            (body.kind === 'deposit' ? 'Demo deposit' : 'Demo withdrawal')
          )
            .trim()
            .slice(0, 100),
          reference: reference(),
          createdAt: new Date().toISOString(),
          status: 'completed',
        };
        const next = await save(table, {
          ...record,
          balancePaisa: nextBalance,
          transactions: [entry, ...record.transactions].slice(0, 100),
          notifications: [
            {
              id: makeId(),
              title:
                body.kind === 'deposit'
                  ? 'Demo deposit recorded'
                  : 'Demo withdrawal recorded',
              detail: 'NPR ' + body.amount.toFixed(2) + ' · ' + entry.reference,
              createdAt: entry.createdAt,
              read: false,
            },
            ...record.notifications,
          ].slice(0, 50),
        });
        return json({
          success: true,
          transaction: entry,
          ...accountView(next),
        });
      } catch {
        return error(
          'The demo operation could not be saved. No success was recorded.',
          500
        );
      }
    },
  ],
  'POST /api/goals': [
    requireAuth(),
    async ctx => {
      try {
        const body = (ctx.body || {}) as {
          name?: string;
          targetAmount?: number;
          targetDate?: string;
        };
        const name = (body.name || '').trim().slice(0, 60);
        if (!name) return error('Enter a name for your savings goal.', 400);
        if (
          typeof body.targetAmount !== 'number' ||
          !Number.isFinite(body.targetAmount) ||
          body.targetAmount <= 0 ||
          body.targetAmount > 100000000
        )
          return error('Enter a valid target amount.', 400);
        const { table, record } = await loadOrCreate(ctx.user!);
        const goal: Goal = {
          id: makeId(),
          name,
          targetPaisa: Math.round(body.targetAmount * 100),
          savedPaisa: 0,
          targetDate: body.targetDate || '',
        };
        const next = await save(table, {
          ...record,
          goals: [goal, ...record.goals].slice(0, 30),
        });
        return json({ success: true, goals: next.goals });
      } catch {
        return error('Could not save the goal. Please try again.', 500);
      }
    },
  ],
  'POST /api/goals/:id/contribute': [
    requireAuth(),
    async ctx => {
      try {
        const body = (ctx.body || {}) as { amount?: number };
        if (
          typeof body.amount !== 'number' ||
          !Number.isFinite(body.amount) ||
          body.amount <= 0 ||
          body.amount > 500000
        )
          return error('Enter a valid contribution amount.', 400);
        const amountPaisa = Math.round(body.amount * 100);
        const { table, record } = await loadOrCreate(ctx.user!);
        const goal = record.goals.find(item => item.id === ctx.params.id);
        if (!goal) return error('Savings goal not found.', 404);
        if (amountPaisa > record.balancePaisa)
          return error('Insufficient demo balance for this contribution.', 400);
        if (amountPaisa > goal.targetPaisa - goal.savedPaisa)
          return error(
            'That contribution is higher than the remaining goal amount.',
            400
          );
        const entry: LedgerItem = {
          id: makeId(),
          type: 'contribution',
          amountPaisa,
          description: 'Savings goal: ' + goal.name,
          reference: reference(),
          createdAt: new Date().toISOString(),
          status: 'completed',
        };
        const goals = record.goals.map(item =>
          item.id === goal.id
            ? { ...item, savedPaisa: item.savedPaisa + amountPaisa }
            : item
        );
        const next = await save(table, {
          ...record,
          balancePaisa: record.balancePaisa - amountPaisa,
          goals,
          transactions: [entry, ...record.transactions].slice(0, 100),
        });
        return json({ success: true, ...accountView(next) });
      } catch {
        return error('Could not record the contribution.', 500);
      }
    },
  ],
  'PUT /api/card': [
    requireAuth(),
    async ctx => {
      try {
        const body = (ctx.body || {}) as {
          frozen?: boolean;
          onlineEnabled?: boolean;
          dailyLimit?: number;
        };
        const { table, record } = await loadOrCreate(ctx.user!);
        const card = {
          frozen:
            typeof body.frozen === 'boolean' ? body.frozen : record.card.frozen,
          onlineEnabled:
            typeof body.onlineEnabled === 'boolean'
              ? body.onlineEnabled
              : record.card.onlineEnabled,
          dailyLimitPaisa:
            typeof body.dailyLimit === 'number' &&
            body.dailyLimit >= 100 &&
            body.dailyLimit <= 100000
              ? Math.round(body.dailyLimit * 100)
              : record.card.dailyLimitPaisa,
        };
        const next = await save(table, { ...record, card });
        return json({ success: true, card: next.card });
      } catch {
        return error('Could not update demo card settings.', 500);
      }
    },
  ],
  'PUT /api/notifications/read-all': [
    requireAuth(),
    async ctx => {
      try {
        const { table, record } = await loadOrCreate(ctx.user!);
        const next = await save(table, {
          ...record,
          notifications: record.notifications.map(item => ({
            ...item,
            read: true,
          })),
        });
        return json({ success: true, notifications: next.notifications });
      } catch {
        return error('Could not update notifications.', 500);
      }
    },
  ],
});
