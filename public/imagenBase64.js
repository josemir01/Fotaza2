console.log('JS imagenBase64 cargado')
const input = document.getElementById('imagenes')
const hidden = document.getElementById('imagenBase64')
const preview = document.getElementById('preview')

input.addEventListener('change', () => {
  const file = input.files[0]

  if (!file) return

  const reader = new FileReader()

  reader.onload = () => {
    const base64 = reader.result

    hidden.value = base64
    preview.src = base64
  }

  reader.readAsDataURL(file)
})