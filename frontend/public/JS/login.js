const form = document.getElementById('loginForm');
const mensaje = document.getElementById('mensaje');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const data = {
    email: formData.get('email'),
    pass: formData.get('pass')
  };

  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const text = await res.text();
  mensaje.innerHTML = '';               // Limpia mensaje previo
  mensaje.classList.remove('oculto');

  if (text.includes('exitoso')) {
    // 1) Pongo el icono + texto
    mensaje.innerHTML = `<i class="fas fa-check-circle"></i> ${text}`;
    mensaje.classList.add('exito');
    mensaje.classList.remove('error');

    // 2) Después de 1.5 s redirijo al home
    setTimeout(() => {
      window.location.href = '/';
    }, 1500);

  } else {
    mensaje.innerHTML = `<i class="fas fa-times-circle"></i> ${text}`;
    mensaje.classList.add('error');
    mensaje.classList.remove('exito');
  }
});
