import { describe, it, expect } from 'vitest';
import { render } from './app.js';

describe('render', () => {
  it('returns "Hello World"', () => {
    expect(render()).toBe('Hello World');
  });
});
