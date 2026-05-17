import { describe, it, expect, vi, afterEach } from 'vitest';
import { showOverlay } from './overlay';

describe('showOverlay', () => {
  afterEach(() => {
    document.querySelectorAll('.modal-overlay').forEach(el => el.remove());
  });

  it('shows overlay with title', () => {
    showOverlay({
      title: 'Test Title',
      field: { value: '' },
      onSubmit: vi.fn()
    });
    const overlay = document.querySelector('.modal-overlay.visible');
    expect(overlay).toBeTruthy();
    expect(overlay!.querySelector('h2')!.textContent).toBe('Test Title');
  });

  it('calls onSubmit with input value on OK', () => {
    const fn = vi.fn();
    showOverlay({ title: 'T', field: { value: '42'}, onSubmit: fn });
    const buttons = document.querySelectorAll('.modal-content button');
    const okBtn = buttons[buttons.length - 1] as HTMLElement;
    okBtn.click();
    expect(fn).toHaveBeenCalledWith('42');
  });

  it('closes on close button click', () => {
    showOverlay({ title: 'T', field: { value: '' }, onSubmit: vi.fn() });
    const close = document.querySelector('.modal-close') as HTMLElement;
    close.click();
    expect(document.querySelector('.modal-overlay')).toBeNull();
  });

  it('closes on overlay backdrop click', () => {
    showOverlay({ title: 'T', field: { value: '' }, onSubmit: vi.fn() });
    const overlay = document.querySelector('.modal-overlay') as HTMLElement;
    overlay.click();
    expect(document.querySelector('.modal-overlay')).toBeNull();
  });
});
