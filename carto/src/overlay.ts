export function showOverlay(config: {
  title: string;
  field: { value: string };
  onSubmit: (value: string) => void;
}): void {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay visible';

  const content = document.createElement('div');
  content.className = 'modal-content';

  const close = document.createElement('button');
  close.className = 'modal-close';
  close.textContent = '✕';

  const title = document.createElement('h2');
  title.textContent = config.title;

  content.append(close, title);

  const inputRow = document.createElement('div');
  inputRow.className = 'input-row';

  const input = document.createElement('input');
  input.type = 'text';
  input.value = config.field.value;
  inputRow.appendChild(input);

  const okBtn = document.createElement('button');
  okBtn.textContent = 'OK';
  okBtn.addEventListener('click', () => {
    config.onSubmit(input.value);
    dismiss();
  });
  inputRow.appendChild(okBtn);

  content.appendChild(inputRow);
  overlay.appendChild(content);
  document.body.appendChild(overlay);

  input.focus();

  const dismiss = () => overlay.remove();

  close.addEventListener('click', dismiss);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) dismiss();
  });
  overlay.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') dismiss();
  });
}
