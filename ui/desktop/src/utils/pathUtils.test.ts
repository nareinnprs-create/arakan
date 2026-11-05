import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { isAbsoluteArakanPath, resolveArakanPathRoot, sanitizeArakanPathRoot } from './pathUtils';

describe('resolveArakanPathRoot', () => {
  it('rejects empty and relative values', () => {
    expect(resolveArakanPathRoot(undefined)).toBeUndefined();
    expect(resolveArakanPathRoot('   ')).toBeUndefined();
    expect(resolveArakanPathRoot('relative/root')).toBeUndefined();
  });

  it('retains absolute paths without requiring them to exist', () => {
    const absolute = path.resolve('nonexistent-arakan-root');
    expect(resolveArakanPathRoot(`  ${absolute}  `)).toBe(absolute);
  });

  it('expands a home-relative root before validation', () => {
    expect(resolveArakanPathRoot('~')).toBe(os.homedir());
  });

  it('removes a rejected value from the child-process environment', () => {
    const env = { ARAKAN_PATH_ROOT: 'relative/root' };
    expect(sanitizeArakanPathRoot(env)).toBeUndefined();
    expect(env).not.toHaveProperty('ARAKAN_PATH_ROOT');
  });

  it('matches Rust absolute-path handling on Windows', () => {
    expect(isAbsoluteArakanPath('C:\\arakan\\root', 'win32')).toBe(true);
    expect(isAbsoluteArakanPath('\\\\server\\share\\arakan', 'win32')).toBe(true);
    expect(isAbsoluteArakanPath('C:arakan\\root', 'win32')).toBe(false);
    expect(isAbsoluteArakanPath('\\arakan\\root', 'win32')).toBe(false);
    expect(isAbsoluteArakanPath('/arakan/root', 'win32')).toBe(false);
  });
});
