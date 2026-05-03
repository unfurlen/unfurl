import { describe, it, expect } from 'vitest';
import { render } from './index.js';

describe('render', () => {
  it('returns "Hello World"', () => {
    expect(render()).toBe('Hello World');
  });
});
