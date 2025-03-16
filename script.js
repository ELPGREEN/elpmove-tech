// Verificação inicial do canvas
const canvas = document.getElementById('canvas');
if (!canvas) {
    console.error('Canvas element not found!');
    document.getElementById('canvas-fallback').style.display = 'block';
} else {
    console.log('Canvas found, initializing Three.js...');
}

// Configuração da cena Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
if (!renderer) {
    console.error('WebGLRenderer initialization failed!');
    document.getElementById('canvas-fallback').style.display = 'block';
} else {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    console.log('Renderer initialized successfully');
}

// Iluminação
const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0x00ffcc, 0.7);
directionalLight.position.set(0, 100, 100);
scene.add(directionalLight);
console.log('Lights added to scene');

// Malha Hexagonal
const hexGrid = new THREE.Group();
const hexSize = 10;
const hexHeight = hexSize * Math.sqrt(3) / 2;
const cols = 50;
const rows = 30;
const positions = [];
const particles = [];

for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const x = col * hexSize * 1.5;
        const y = row * hexHeight * 2 + (col % 2 === 0 ? 0 : hexHeight);
        const z = 0;

        // Criar linhas do hexágono
        const points = [];
        for (let i = 0; i < 7; i++) {
            const angle = (i / 6) * Math.PI * 2;
            points.push(new THREE.Vector3(
                x + hexSize * Math.cos(angle),
                y + hexSize * Math.sin(angle),
                z
            ));
        }
        const hexGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const hexMaterial = new THREE.LineBasicMaterial({ color: 0x00ffcc, transparent: true, opacity: 0.3 });
        const hex = new THREE.Line(hexGeometry, hexMaterial);
        hexGrid.add(hex);

        // Armazenar posições para animação
        positions.push({ x, y, baseZ: z, hex });

        // Criar partícula no centro do hexágono
        const particleGeometry = new THREE.SphereGeometry(1, 8, 8);
        const particleMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffcc, transparent: true, opacity: 0.8 });
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        particle.position.set(x, y, z);
        hexGrid.add(particle);
        particles.push(particle);
    }
}

hexGrid.position.set(-(cols * hexSize * 1.5) / 2, -(rows * hexHeight * 2) / 2, 0);
hexGrid.rotation.x = Math.PI / 4;
scene.add(hexGrid);
console.log('Hexagonal grid added to scene');

// Fundo Estelar
const starGeometry = new THREE.SphereGeometry(0.5, 8, 8);
const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const stars = new THREE.InstancedMesh(starGeometry, starMaterial, 1000);
for (let i = 0; i < 1000; i++) {
    const position = new THREE.Vector3(
        (Math.random() - 0.5) * 2000,
        (Math.random() - 0.5) * 2000,
        (Math.random() - 0.5) * 2000
    );
    const matrix = new THREE.Matrix4().makeTranslation(position.x, position.y, position.z);
    stars.setMatrixAt(i, matrix);
}
scene.add(stars);
console.log('Stars added to scene');

camera.position.set(0, 0, 200);
camera.lookAt(0, 0, 0);

// Animações
gsap.to(stars.rotation, {
    y: "+=6.28",
    duration: 50,
    ease: "linear",
    repeat: -1,
    onStart: () => console.log('Stars rotation animation started')
});

let time = 0;
positions.forEach((pos, i) => {
    gsap.to(pos.hex.position, {
        z: () => pos.baseZ + Math.sin(time + (pos.x + pos.y) * 0.05) * 10,
        duration: 2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: i * 0.01,
        onUpdate: () => {
            particles[i].position.z = pos.hex.position.z;
        }
    });
});

particles.forEach((particle, i) => {
    gsap.to(particle.material, {
        opacity: () => Math.random() > 0.5 ? 0.8 : 0.2,
        duration: 1,
        ease: "power1.inOut",
        repeat: -1,
        delay: i * 0.02
    });
});

// Menu Mobile
const phoneMenu = document.querySelector('.phone-menu');
const nav = document.querySelector('.nav');
phoneMenu.addEventListener('click', () => {
    phoneMenu.classList.toggle('open');
    nav.classList.toggle('active');
    console.log('Mobile menu toggled');
});

// Interação com Rolagem
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollFraction = scrollTop / maxScroll;

    camera.position.z = 200 + scrollFraction * 100;
    camera.position.y = scrollFraction * 50;

    stars.material.opacity = 0.8 - scrollFraction * 0.5;
    gsap.to(stars.scale, {
        x: 1 + scrollFraction * 0.5,
        y: 1 + scrollFraction * 0.5,
        z: 1 + scrollFraction * 0.5,
        duration: 0.1
    });

    document.querySelectorAll('.section').forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });

    lastScrollTop = scrollTop;
});

// Interação com Cliques no Menu
document.querySelectorAll('.interact').forEach(element => {
    element.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = element.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        window.scrollTo({
            top: targetSection.offsetTop,
            behavior: 'smooth'
        });
        document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
        targetSection.classList.add('active');
        console.log(`Navigated to section: ${targetId}`);
    });
});

// Loop de Animação
function animate() {
    if (!renderer) {
        console.error('Renderer not available, stopping animation');
        return;
    }
    requestAnimationFrame(animate);
    time += 0.01;
    renderer.render(scene, camera);
    console.log('Rendering frame...');
}

animate();

window.addEventListener('resize', () => {
    if (!renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    console.log('Window resized');
});
