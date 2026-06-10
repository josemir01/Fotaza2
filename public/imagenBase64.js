const input = document.getElementById('imagenes')
const hidden = document.getElementById('imagenBase64')
const preview = document.getElementById('preview')

input.addEventListener('change', async () => {
    const files = Array.from(input.files)

    const imagenesBase64 = await Promise.all(
        files.map(file => convertirABase64(file))
    )

    hidden.value = JSON.stringify(imagenesBase64)

    preview.innerHTML = ''

imagenesBase64.forEach(base64 => {
    const img = document.createElement('img')
    img.src = base64
    img.style.width = '150px'
    img.style.height = '150px'
    img.style.objectFit = 'cover'
    img.classList.add('rounded', 'border')
    preview.appendChild(img)
})
})

function convertirABase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = () => {
            resolve(reader.result)
        }

        reader.onerror = reject

        reader.readAsDataURL(file)
    })
}