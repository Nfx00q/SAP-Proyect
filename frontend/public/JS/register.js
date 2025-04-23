const form = document.getElementById('registerForm');
const mensaje = document.getElementById('mensajeRegistro');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = new FormData(form);

  const res = await fetch('/api/register', {
    method: 'POST',
    body: new URLSearchParams(data),
  });

  const msg = await res.text();
  mensaje.textContent = msg;
  mensaje.classList.remove('oculto');

  if (msg.includes('✅')) {
    mensaje.classList.add('success');
    setTimeout(() => window.location.href = '/login', 1500); // redirige al login
  } else {
    mensaje.classList.add('error');
  }
});
