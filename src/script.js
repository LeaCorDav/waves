import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

THREE.ColorManagement.enabled = false

/**
 * Base
 */
// Debug
/* const gui = new dat.GUI() */

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


/* --------------------- TEXTURAS ---------------------- */
const textureLoader = new THREE.TextureLoader()
const particlesTexture_1 = textureLoader.load("/textures/particles/1.png")
const particlesTexture_2 = textureLoader.load("/textures/particles/2.png")
const particlesTexture_3 = textureLoader.load("/textures/particles/3.png")
const particlesTexture_4 = textureLoader.load("/textures/particles/4.png")
const particlesTexture_5 = textureLoader.load("/textures/particles/5.png")
const particlesTexture_6 = textureLoader.load("/textures/particles/6.png")
const particlesTexture_7 = textureLoader.load("/textures/particles/7.png")
const particlesTexture_8 = textureLoader.load("/textures/particles/8.png")
const particlesTexture_9 = textureLoader.load("/textures/particles/9.png")
const particlesTexture_10 = textureLoader.load("/textures/particles/10.png")
const particlesTexture_11 = textureLoader.load("/textures/particles/11.png")
const particlesTexture_12 = textureLoader.load("/textures/particles/12.png")
const particlesTexture_13 = textureLoader.load("/textures/particles/13.png")
/* --------------------- TEXTURAS ---------------------- */


/* --------------------- PARTICULAS ---------------------- */
// Geometrias THREE
const particlesTorusGeometry = new THREE.TorusKnotGeometry( 1.5, 0.3, 100, 16 )

// Geometria libre
const particlesEmptyGeometry = new THREE.BufferGeometry()
    // Cantidad de vertices o puntos
    const count = 50000

    // Creamos un array con (cantidad de valores) para las posiciones de los vertices * 3 ya que las posiciones necesitan una ubicación en ejes X Y Z
    const positions = new Float32Array(count * 3)
    // Creamos un array para los valores del color * 3 ya que usa R G B
    const colorsRainbow = new Float32Array(count * 3)

    // Le da una valor random a cada valor del array "positions"
    for(let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 10
        colorsRainbow[i] = Math.random()
    }

    // Le agrega el atributo "posicion" a la geometria vacía para ubicar sus vertices
    particlesEmptyGeometry.setAttribute(
        "position", // Nombre de atributo
        new THREE.BufferAttribute(positions, 3) // Array de donde se va a agarrar los valores y el tamaño del item (3 porque necesita valor para XYZ)
    )
    // Le agrega el atributo "color" a la geometria vacía
    particlesEmptyGeometry.setAttribute(
        "color", // Nombre de atributo
        new THREE.BufferAttribute(colorsRainbow, 3) // Array de donde se va a agarrar los valores y el tamaño del item (3 porque necesita valor para RGB)
    )

    // Para hacerlo solo en escalas de BLUE (fixed el 3er valor de RGB a 255 azul y los otros valores igualamos para que solo valla de azul a blanco) 
    for(let i = 0; i < count; i++) {
        const i3 = i * 3
        particlesEmptyGeometry.attributes.color.array[i3] = particlesEmptyGeometry.attributes.color.array[i3 + 1]
        particlesEmptyGeometry.attributes.color.array[i3 + 2] = 255
    }

// Materiales
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02, // Tamaño en px
    sizeAttenuation: true, // Tamaño es menor si esta mas lejos
    /* color: "#D5F2ED", */
    transparent: true, // Para activar el alphaMap
    alphaMap: particlesTexture_2, // Alphamap
    // Forma 1 de esconder negros de textura (Contra: igual aparece un offset negro alrededor de la textura)
        /* alphaTest: 0.001, */
    // Forma 2 de esconder negros de textura (Contra: si tenemos otros objetos, se va a poder ver a través las particulas que estén detras del objeto como si fuera medio "transparente")
        /* depthTest: false, */
    // Forma 3 de esconder negros de textura (Arregla los contra anteriores)
        depthWrite: false,

    // Blending Options (como ponerlo en modo blend "Trama")
    blending: THREE.AdditiveBlending,

    // Permite que los Vertices (puntos o particulas) tengan diferente color
    vertexColors: true
})

// Points
const particles = new THREE.Points(particlesEmptyGeometry, particlesMaterial)
scene.add(particles)

/* --------------------- PARTICULAS ---------------------- */

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    /* ---------- ANIMANDO PARTICULAS ---------- */
    // Animacion simple: Mueve TODAS las particulas como 1 SOLO objeto
    particles.rotation.y = elapsedTime * 0.2

    // Mueve cada particula independientement
    for(let i = 0; i < count; i++) {

        // Le asigna 3 valores a i3 para agrupar los valores de XYZ
        const i3 = i * 3

        // Ya que el array tiene 3 valores, +0 = X, +1 = Y y +2 = Z
        const x = particlesEmptyGeometry.attributes.position.array[i3 + 0]

        // Mueve cada particula solo en la posicion Y (accedemos al array de posiciones XYZ y , como se quiere acceder a Y es +1 y le define MATH.SIN para que ondee)
        particlesEmptyGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
    }
    // Notifica a THREE.JS que tiene que actualizar las posiciones (sino no se ve el resultado)
    particlesEmptyGeometry.attributes.position.needsUpdate = true
    /* ---------- ANIMANDO PARTICULAS ---------- */

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()