import { beforeEach, describe, expect, it, vi } from 'vitest';
import { requireAccount, saveDisplayName } from './account';
import { loadCareerProgress, saveCareerResult } from '@/features/career/data/career-progress';
import { loadCareerLeagueId, saveCareerLeagueId } from '@/features/career/data/career-storage';

const mocks = vi.hoisted(() => ({ getSession: vi.fn(), rpc: vi.fn(), from: vi.fn(), getItem: vi.fn(), setItem: vi.fn(), configured: true }));
vi.mock('@/lib/supabase', () => ({
  get isSupabaseConfigured() { return mocks.configured; },
  getSupabaseClient: () => mocks.configured ? { auth: { getSession: mocks.getSession }, from: mocks.from, rpc: mocks.rpc } : null,
}));
vi.mock('@react-native-async-storage/async-storage', () => ({ default: { getItem: mocks.getItem, setItem: mocks.setItem } }));

beforeEach(() => {
  vi.resetAllMocks(); mocks.configured = true;
  mocks.getSession.mockResolvedValue({ data: { session: { user: { id: 'alice' } } }, error: null });
  mocks.rpc.mockResolvedValue({ error: null });
});

describe('account boundaries', () => {
  it('rejects work captured by a different user before sending it', async () => {
    await expect(saveCareerResult('de-1:champions:1', 90, true, 'bob')).rejects.toThrow('gewechselt');
    await expect(saveCareerLeagueId('de-1', 'bob')).rejects.toThrow('gewechselt');
    await expect(saveDisplayName('Bob', 'bob')).rejects.toThrow('gewechselt');
    expect(mocks.rpc).not.toHaveBeenCalled(); expect(mocks.from).not.toHaveBeenCalled();
  });
  it('does not read guest data when a configured account is signed out', async () => {
    mocks.getSession.mockResolvedValue({ data: { session: null }, error: null });
    await expect(loadCareerProgress()).rejects.toThrow('erneut');
    await expect(loadCareerLeagueId()).rejects.toThrow('erneut');
    expect(mocks.getItem).not.toHaveBeenCalled();
  });
  it('never silently treats a cloud save failure as locally saved', async () => {
    mocks.rpc.mockResolvedValue({ error: new Error('offline') });
    await expect(saveCareerResult('test', 90, true, 'alice')).rejects.toThrow('offline');
    expect(mocks.setItem).not.toHaveBeenCalled();
  });
  it('sends owner and exact percentage to the atomic server merge', async () => {
    await saveCareerResult('test', 79.6, false, 'alice');
    expect(mocks.rpc).toHaveBeenCalledWith('save_career_result', { p_user_id: 'alice', p_pack_id: 'test', p_percent: 79.6 });
  });
  it.each([NaN, Infinity, -1, 101])('rejects invalid percentage %s', async (value) => {
    await expect(saveCareerResult('test', value, false)).rejects.toThrow();
    expect(mocks.rpc).not.toHaveBeenCalled();
  });
  it('filters cloud reads by current user and maps the result', async () => {
    const eq = vi.fn().mockResolvedValue({ data: [{ pack_id: 'test', best_percent: 90, passed: true }], error: null });
    mocks.from.mockReturnValue({ select: () => ({ eq }) });
    expect(await loadCareerProgress()).toEqual({ test: { bestPercent: 90, passed: true } });
    expect(eq).toHaveBeenCalledWith('user_id', 'alice');
  });
  it('retains the pre-login local data when no backend is configured', async () => {
    mocks.configured = false; mocks.getItem.mockResolvedValue('{"test":{"bestPercent":80,"passed":true}}');
    expect(await loadCareerProgress()).toEqual({ test: { bestPercent: 80, passed: true } });
    expect(mocks.getSession).not.toHaveBeenCalled();
  });
  it('fails closed on session errors', async () => {
    mocks.getSession.mockResolvedValue({ data: { session: null }, error: new Error('expired') });
    await expect(requireAccount()).rejects.toThrow('expired');
  });
});
