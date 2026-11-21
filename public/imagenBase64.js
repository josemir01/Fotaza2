
const input = document.getElementById('imagenes')
const hidden = document.getElementById('imagenBase64')
const preview = document.getElementById('preview')

input.addEventListener('change', async () => {
    const files = Array.from(input.files)

    const imagenesBase64 = await Promise.all(
        files.map(file => convertirABase64(file))
    )

    preview.innerHTML = ''

    // Guardar imágenes con sus opciones
    const imagenes = imagenesBase64.map(base64 => ({
        image: base64,
        copyright: false,
        watermark: false,
        watermarkText: ''
    }))

    // Actualizar el input oculto
    function actualizarHidden() {
        hidden.value = JSON.stringify(imagenes)
    }

    imagenes.forEach((imagen) => {

        const contenedor = document.createElement('div')
        contenedor.classList.add('border', 'rounded', 'p-3', 'mb-3')

        // Mostrar imagen
        const img = document.createElement('img')
        img.src = imagen.image
        img.style.width = '150px'
        img.style.height = '150px'
        img.style.objectFit = 'cover'
        img.classList.add('rounded', 'border', 'mb-2')

        contenedor.appendChild(img)

        // Checkbox copyright
        const copyrightLabel = document.createElement('label')
        copyrightLabel.classList.add('d-block')

        const copyrightInput = document.createElement('input')
        copyrightInput.type = 'checkbox'

        copyrightLabel.appendChild(copyrightInput)
        copyrightLabel.append(' Imagen con copyright')

        contenedor.appendChild(copyrightLabel)

        // Checkbox marca de agua
        const watermarkLabel = document.createElement('label')
        watermarkLabel.classList.add('d-block', 'mt-2')

        const watermarkInput = document.createElement('input')
        watermarkInput.type = 'checkbox'
        watermarkInput.disabled = true

        watermarkLabel.appendChild(watermarkInput)
        watermarkLabel.append(' Agregar marca de agua')

        contenedor.appendChild(watermarkLabel)

        // Texto personalizado
        const watermarkText = document.createElement('input')
        watermarkText.type = 'text'
        watermarkText.placeholder = 'Texto de la marca de agua'
        watermarkText.classList.add('form-control', 'mt-2')
        watermarkText.maxLength = 255
        watermarkText.disabled = true

        contenedor.appendChild(watermarkText)

        // Cuando cambia el copyright
        copyrightInput.addEventListener('change', () => {
            imagen.copyright = copyrightInput.checked

            watermarkInput.disabled = !copyrightInput.checked

            if (!copyrightInput.checked) {
                watermarkInput.checked = false
                watermarkText.value = ''
                watermarkText.disabled = true

                imagen.watermark = false
                imagen.watermarkText = ''
            }

            actualizarHidden()
        })

        // Cuando cambia la marca de agua
        watermarkInput.addEventListener('change', () => {
            imagen.watermark = watermarkInput.checked
            watermarkText.disabled = !watermarkInput.checked

            if (!watermarkInput.checked) {
                watermarkText.value = ''
                imagen.watermarkText = ''
            }

            actualizarHidden()
        })

        // Guardar el texto personalizado
        watermarkText.addEventListener('input', () => {
            imagen.watermarkText = watermarkText.value
            actualizarHidden()
        })

        preview.appendChild(contenedor)
    })

    actualizarHidden()
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
