import type { InitializeResponse } from '@agentclientprotocol/sdk';
import { describe, expect, it } from 'vitest';
import { hasLocalInferenceCapability, hasRecipeParameterScopesCapability } from '../capabilities';

function initializeResponseWithMeta(meta?: unknown): Pick<InitializeResponse, 'agentCapabilities'> {
  return {
    agentCapabilities: {
      _meta: meta,
    },
  } as Pick<InitializeResponse, 'agentCapabilities'>;
}

describe('ACP capabilities', () => {
  it('detects local inference support from Arakan metadata', () => {
    expect(
      hasLocalInferenceCapability(
        initializeResponseWithMeta({
          arakan: {
            localInference: {},
          },
        })
      )
    ).toBe(true);
  });

  it('detects scoped recipe-parameter support from Arakan metadata', () => {
    expect(
      hasRecipeParameterScopesCapability(
        initializeResponseWithMeta({
          arakan: {
            recipeParameterScopes: {},
          },
        })
      )
    ).toBe(true);
  });

  it('treats missing or malformed scoped recipe-parameter metadata as unsupported', () => {
    expect(hasRecipeParameterScopesCapability(initializeResponseWithMeta())).toBe(false);
    expect(hasRecipeParameterScopesCapability(initializeResponseWithMeta({}))).toBe(false);
    expect(hasRecipeParameterScopesCapability(initializeResponseWithMeta({ arakan: {} }))).toBe(
      false
    );
    expect(hasRecipeParameterScopesCapability(initializeResponseWithMeta({ arakan: true }))).toBe(
      false
    );
  });

  it('treats missing local inference metadata as unsupported', () => {
    expect(hasLocalInferenceCapability(initializeResponseWithMeta())).toBe(false);
    expect(hasLocalInferenceCapability(initializeResponseWithMeta({}))).toBe(false);
    expect(hasLocalInferenceCapability(initializeResponseWithMeta({ arakan: {} }))).toBe(false);
  });

  it('ignores malformed Arakan metadata', () => {
    expect(hasLocalInferenceCapability(initializeResponseWithMeta({ arakan: true }))).toBe(false);
    expect(hasLocalInferenceCapability(initializeResponseWithMeta({ arakan: null }))).toBe(false);
  });
});
