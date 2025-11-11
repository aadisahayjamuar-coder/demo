// Task 3 — Robust JS validation (fixed "always success" issue)

const form = document.getElementById('regForm');
const toast = document.getElementById('toast');
const toastOk = document.getElementById('toastOk');
const resetBtn = document.getElementById('resetBtn');

// Set today's date as min
(function setTodayMin() {
  const d = new Date(); const yyyy = d.getFullYear();
  const mm = String(d.getMonth()+1).padStart(2,'0');
  const dd = String(d.getDate()).padStart(2,'0');
  document.getElementById('date').setAttribute('min', ${yyyy}-${mm}-${dd});
})();

// Helpers
function setError(input, errEl, message) {
  if (message) {
    errEl.textContent = message;
    input.classList.add('invalid');
    input.setAttribute('aria-invalid', 'true');
  } else {
    errEl.textContent = '';
    input.classList.remove('invalid');
    input.setAttribute('aria-invalid', 'false');
  }
}
function parseLocalDate(str) {
  if (!str) return null;
  const [y,m,d] = str.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return Number.isNaN(dt.getTime()) ? null : dt;
}
function timeToMinutes(hhmm) {
  if (!hhmm) return NaN;
  const [h,m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}
const trim = (s)=> (s || '').trim();

// Refs
const refs = {
  name:  { input: document.getElementById('name'),  err: document.getElementById('err-name') },
  email: { input: document.getElementById('email'), err: document.getElementById('err-email') },
  phone: { input: document.getElementById('phone'), err: document.getElementById('err-phone') },
  org:   { input: document.getElementById('org'),   err: document.getElementById('err-org') },
  type:  { input: document.getElementById('type'),  err: document.getElementById('err-type') },
  date:  { input: document.getElementById('date'),  err: document.getElementById('err-date') },
  time:  { input: document.getElementById('time'),  err: document.getElementById('err-time') },
  seats: { input: document.getElementById('seats'), err: document.getElementById('err-seats') },
  notes: { input: document.getElementById('notes'), err: document.getElementById('err-notes') },
  terms: { input: document.getElementById('terms'), err: document.getElementById('err-terms') },
  mode:  {
    inputs: Array.from(document.querySelectorAll('input[name="mode"]')),
    err: document.getElementById('err-mode')
  }
};

// Validators
function validateName() {
  const v = trim(refs.name.input.value);
  const ok = /^[A-Za-z\s.'-]{2,}$/.test(v);
  setError(refs.name.input, refs.name.err, ok ? '' : 'Enter at least 2 letters (A–Z).');
  return ok;
}
function validateEmail() {
  const v = trim(refs.email.input.value);
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  setError(refs.email.input, refs.email.err, ok ? '' : 'Enter a valid email.');
  return ok;
}
function validatePhone() {
  const digits = trim(refs.phone.input.value).replace(/\D/g, '');
  const ok = /^[6-9]\d{9}$/.test(digits);
  setError(refs.phone.input, refs.phone.err, ok ? '' : '10-digit mobile starting with 6–9.');
  return ok;
}
function validateType() {
  const ok = !!refs.type.input.value;
  setError(refs.type.input, refs.type.err, ok ? '' : 'Select an event type.');
  return ok;
}
function validateMode() {
  const chosen = refs.mode.inputs.find(r => r.checked);
  const fieldset = refs.mode.err.closest('fieldset');
  refs.mode.err.textContent = chosen ? '' : 'Choose attendance mode.';
  refs.mode.inputs.forEach(r => r.setAttribute('aria-invalid', chosen ? 'false' : 'true'));
  fieldset?.classList.toggle('group-invalid', !chosen); // visual outline if invalid
  return !!chosen;
}
function validateDate() {
  const d = parseLocalDate(refs.date.input.value);
  const today = new Date(); today.setHours(0,0,0,0);
  const ok = d && d >= today;
  setError(refs.date.input, refs.date.err, ok ? '' : 'Pick today or a future date.');
  return ok;
}
function validateTime() {
  const t = timeToMinutes(refs.time.input.value);
  const ok = Number.isFinite(t) && t >= 9*60 && t <= 18*60;
  setError(refs.time.input, refs.time.err, ok ? '' : 'Between 09:00 and 18:00.');
  return ok;
}
function validateSeats() {
  const n = Number(refs.seats.input.value);
  const ok = Number.isInteger(n) && n >= 1 && n <= 5;
  setError(refs.seats.input, refs.seats.err, ok ? '' : 'Seats must be 1–5.');
  return ok;
}
function validateTerms() {
  const ok = refs.terms.input.checked === true;
  setError(refs.terms.input, refs.terms.err, ok ? '' : 'You must accept the terms.');
  return ok;
}

// Live validation
refs.name.input.addEventListener('input',  validateName);
refs.email.input.addEventListener('input', validateEmail);
refs.phone.input.addEventListener('input', validatePhone);
refs.type.input.addEventListener('change', validateType);
refs.date.input.addEventListener('change', validateDate);
refs.time.input.addEventListener('change', validateTime);
refs.seats.input.addEventListener('input', validateSeats);
refs.terms.input.addEventListener('change', validateTerms);
refs.mode.inputs.forEach(r => r.addEventListener('change', validateMode));

// Run all validators and confirm there are truly no errors
function runAll() {
  const results = [
    validateName(), validateEmail(), validatePhone(),
    validateType(), validateMode(), validateDate(),
    validateTime(), validateSeats(), validateTerms()
  ];

  // Extra guard: if any element has .invalid or any error label has text, treat as invalid
  const anyInvalidClass = !!document.querySelector('.invalid');
  const anyErrorText = Array.from(document.querySelectorAll('.error'))
    .some(el => el.textContent.trim().length > 0);

  return results.every(Boolean) && !anyInvalidClass && !anyErrorText;
}

// Submit
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const ok = runAll();
  if (ok) {
    toast.hidden = false;
    clearTimeout(toast._t); toast._t = setTimeout(()=> toast.hidden = true, 4000);
  } else {
    // Focus first invalid control
    const firstInvalid = document.querySelector('.invalid') ||
                         (refs.mode.inputs.find(r => !r.checked) && refs.mode.inputs[0]);
    if (firstInvalid && typeof firstInvalid.focus === 'function') {
      firstInvalid.focus({ preventScroll:false });
      firstInvalid.scrollIntoView({ behavior:'smooth', block:'center' });
    }
    toast.hidden = true; // never show toast when invalid
  }
});

// Toast dismiss
toastOk.addEventListener('click', () => { toast.hidden = true; });

// Reset clears all errors & toast
resetBtn.addEventListener('click', () => {
  setTimeout(() => {
    document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
    document.querySelectorAll('.error').forEach(el => el.textContent = '');
    refs.mode.err.closest('fieldset')?.classList.remove('group-invalid');
    toast.hidden = true;
  }, 0);
});