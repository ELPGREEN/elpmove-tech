// Configuração do Three.js
const ThreeSetup = (() => {
    const canvas = document.getElementById('canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    scene.fog = new THREE.FogExp2(0x0a0a23, 0.001); // Neblina menos densa
    camera.position.z = 100;

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    return { scene, camera, renderer };
})();

// Iluminação
const Lighting = (() => {
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    const pointLight = new THREE.PointLight(0xffffff, 1, 500);
    pointLight.position.set(50, 50, 50);

    ThreeSetup.scene.add(ambientLight, pointLight);
})();

// Estrelas e Constelações
const Stars = (() => {
    const starsCount = 2000;
    const positions = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 2000;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({ size: 1.5, color: 0xffffff, transparent: true, opacity: 0.6 });
    const stars = new THREE.Points(geometry, material);

    // Adicionar constelações
    const constellationLines = [];
    for (let i = 0; i < 10; i++) {
        const linePositions = new Float32Array(6);
        const startIdx = Math.floor(Math.random() * starsCount) * 3;
        const endIdx = Math.floor(Math.random() * starsCount) * 3;
        linePositions[0] = positions[startIdx];
        linePositions[1] = positions[startIdx + 1];
        linePositions[2] = positions[startIdx + 2];
        linePositions[3] = positions[endIdx];
        linePositions[4] = positions[endIdx + 1];
        linePositions[5] = positions[endIdx + 2];

        const lineGeometry = new THREE.BufferGeometry();
        lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xaaaaaa, opacity: 0.3, transparent: true });
        const line = new THREE.Line(lineGeometry, lineMaterial);
        constellationLines.push(line);
    }

    ThreeSetup.scene.add(stars, ...constellationLines);
})();

// Meteoros
const Meteors = (() => {
    const meteorCount = 20;
    const meteors = [];

    for (let i = 0; i < meteorCount; i++) {
        const geometry = new THREE.SphereGeometry(0.5, 16, 16);
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const meteor = new THREE.Mesh(geometry, material);

        meteor.position.set(
            (Math.random() - 0.5) * 2000,
            (Math.random() - 0.5) * 2000,
            (Math.random() - 0.5) * 2000
        );
        meteor.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2
        );

        ThreeSetup.scene.add(meteor);
        meteors.push(meteor);
    }

    const updateMeteors = () => {
        meteors.forEach(meteor => {
            meteor.position.add(meteor.velocity);
            if (meteor.position.length() > 1000) {
                meteor.position.set(
                    (Math.random() - 0.5) * 2000,
                    (Math.random() - 0.5) * 2000,
                    (Math.random() - 0.5) * 2000
                );
                meteor.velocity.set(
                    (Math.random() - 0.5) * 2,
                    (Math.random() - 0.5) * 2,
                    (Math.random() - 0.5) * 2
                );
            }
        });
    };

    return { update: updateMeteors };
})();

// Tetraedro
const Tetrahedron = (() => {
    const geometry = new THREE.TetrahedronGeometry(10, 0);
    const material = new THREE.MeshPhongMaterial({ color: 0x00ffcc, specular: 0x00ffcc, shininess: 30 });
    const tetrahedron = new THREE.Mesh(geometry, material);
    tetrahedron.position.set(0, 0, 50);

    ThreeSetup.scene.add(tetrahedron);
    return tetrahedron;
})();

// Linhas
const Lines = (() => {
    const positions = new Float32Array([
        -1000, 0, 0, 1000, 0, 0,
        0, -1000, 0, 0, 1000, 0,
        0, 0, -1000, 0, 0, 1000
    ]);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.LineBasicMaterial({ color: 0xff007a });
    const lines = new THREE.LineSegments(geometry, material);

    ThreeSetup.scene.add(lines);
    return lines;
})();

// Planetas com Anéis
const Planets = (() => {
    const planetData = {
        green: [
            { position: { x: -200, y: 50, z: -300 }, color: 0x00ffcc },
            { position: { x: -100, y: 100, z: -250 }, color: 0x00cc99 },
            { position: { x: 0, y: 80, z: -280 }, color: 0x009966 },
            { position: { x: 100, y: 60, z: -260 }, color: 0x006633 },
            { position: { x: 200, y: 40, z: -290 }, color: 0x003300 }
        ],
        move: [
            { position: { x: -200, y: -50, z: -300 }, color: 0x66ccff },
            { position: { x: -100, y: -80, z: -270 }, color: 0x3399ff },
            { position: { x: 0, y: -60, z: -290 }, color: 0x0066cc },
            { position: { x: 100, y: -40, z: -250 }, color: 0x003399 },
            { position: { x: 200, y: -20, z: -280 }, color: 0x000066 }
        ]
    };

    const planets = [];

    const createPlanets = (galaxyKey) => {
        planetData[galaxyKey].forEach((planetInfo, index) => {
            const geometry = new THREE.SphereGeometry(10, 32, 32);
            const material = new THREE.MeshPhongMaterial({ color: planetInfo.color });
            const planet = new THREE.Mesh(geometry, material);

            const ringGeometry = new THREE.RingGeometry(12, 15, 32);
            const ringMaterial = new THREE.MeshBasicMaterial({ 
                color: planetInfo.color, 
                side: THREE.DoubleSide, 
                transparent: true, 
                opacity: 0.5 
            });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 2;

            const planetGroup = new THREE.Group();
            planetGroup.add(planet);
            planetGroup.add(ring);
            planetGroup.position.copy(planetInfo.position);
            planetGroup.visible = false;

            ThreeSetup.scene.add(planetGroup);
            planets.push({ planet: planetGroup, galaxy: galaxyKey, index });
        });
    };

    createPlanets('green');
    createPlanets('move');

    return planets;
})();

// Animação
const Animation = (() => {
    const animate = () => {
        requestAnimationFrame(animate);
        Tetrahedron.rotation.y += 0.005;
        Lines.rotation.z += 0.001;
        Planets.forEach(planet => {
            if (planet.planet.visible) planet.planet.rotation.y += 0.005;
        });
        Meteors.update();
        ThreeSetup.renderer.render(ThreeSetup.scene, ThreeSetup.camera);
    };
    animate();
})();

// Navegação
const Navigation = (() => {
    let currentGalaxy = null;

    const showSection = (id) => {
        gsap.killTweensOf([Tetrahedron.scale, Tetrahedron.rotation, ThreeSetup.camera.position]);

        document.querySelectorAll('section').forEach(section => {
            section.classList.remove('active');
            section.style.display = 'none';
        });
        const target = document.getElementById(id);
        if (target) {
            target.style.display = 'flex';
            target.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });

            gsap.to(Tetrahedron.scale, { x: 1.2, y: 1.2, z: 1.2, duration: 0.5, yoyo: true, repeat: 1 });
            if (id === 'sustainability') {
                gsap.to(Tetrahedron.rotation, { x: "+=2", y: "+=2", duration: 1, ease: 'power2.inOut' });
            }
        }
    };

    const enterGalaxy = (galaxy) => {
        currentGalaxy = galaxy;
        const intro = document.getElementById('intro');
        const directionButtons = document.getElementById('direction-buttons');
        const planetNames = {
            green: ['Planeta Verde', 'Planeta Solar', 'Planeta Eco-Tech', 'Planeta Água', 'Planeta Ar'],
            move: ['Planeta Eco-Trans', 'Planeta Veloz', 'Planeta Urbano', 'Planeta Turismo', 'Planeta Conectado']
        };

        directionButtons.innerHTML = '';
        planetNames[galaxy].forEach((name, index) => {
            const btn = document.createElement('button');
            btn.className = 'btn';
            btn.textContent = name;
            btn.addEventListener('click', () => travelTo(index));
            directionButtons.appendChild(btn);
        });

        intro.querySelector('#intro-title').textContent = `Explore a Galáxia ELP - ${galaxy === 'green' ? 'Green Technology' : 'ELP Move Mobilidade'}`;
        intro.querySelector('#intro-desc').textContent = 'Descubra um universo de soluções sustentáveis.';
        showSection('intro');
        gsap.to(ThreeSetup.camera.position, { z: 200, duration: 1.5, ease: 'power2.inOut' });
        Planets.forEach(p => p.planet.visible = p.galaxy === galaxy);
    };

    const travelTo = (index) => {
        const targetPlanet = Planets.find(p => p.galaxy === currentGalaxy && p.index === index);
        if (targetPlanet) {
            showSection(`${currentGalaxy}-planet-${index}`);
            gsap.to(ThreeSetup.camera.position, {
                x: targetPlanet.planet.position.x,
                y: targetPlanet.planet.position.y,
                z: targetPlanet.planet.position.z + 50,
                duration: 1.5,
                ease: 'power2.inOut'
            });
            Planets.forEach(p => p.planet.visible = false);
            targetPlanet.planet.visible = true;
        }
    };

    const travelBack = () => {
        showSection('intro');
        gsap.to(ThreeSetup.camera.position, { x: 0, y: 0, z: 200, duration: 1.5, ease: 'power2.inOut' });
        Planets.forEach(p => p.planet.visible = p.galaxy === currentGalaxy);
    };

    const travelBackToCosmo = () => {
        showSection('navegue');
        gsap.to(ThreeSetup.camera.position, { x: 0, y: 0, z: 100, duration: 1.5, ease: 'power2.inOut' });
        Planets.forEach(p => p.planet.visible = false);
    };

    return { showSection, enterGalaxy, travelTo, travelBack, travelBackToCosmo };
})();

// Eventos
const Events = (() => {
    const navMenu = document.getElementById('nav-menu');

    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const id = link.getAttribute('href').substring(1);
            Navigation.showSection(id);
            if (id !== 'navegue' && id !== 'intro') {
                gsap.to(ThreeSetup.camera.position, { x: 0, y: 0, z: 100, duration: 1, ease: 'power2.inOut' });
                Planets.forEach(p => p.planet.visible = false);
            }
            navMenu.classList.remove('active');
        });
    });

    document.querySelector('.menu-toggle').addEventListener('click', () => {
        navMenu.classList.toggle('active');
        if (navMenu.classList.contains('active')) {
            navMenu.querySelectorAll('li').forEach((li, index) => li.style.setProperty('--index', index));
            gsap.fromTo(navMenu, 
                { y: '-100%', scale: 0.95 }, 
                { y: '0%', scale: 1, duration: 0.5, ease: 'bounce.out' }
            );
        }
    });

    document.querySelectorAll('.cosmo-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            Navigation.enterGalaxy(btn.dataset.galaxy);
            navMenu.classList.remove('active');
        });
    });

    document.querySelectorAll('.btn[data-next]').forEach(btn => {
        btn.addEventListener('click', () => Navigation.travelTo(parseInt(btn.dataset.next)));
    });

    document.querySelectorAll('.btn[data-prev]').forEach(btn => {
        btn.addEventListener('click', () => Navigation.travelTo(parseInt(btn.dataset.prev)));
    });

    document.querySelectorAll('.btn[data-action="back"]').forEach(btn => {
        btn.addEventListener('click', Navigation.travelBack);
    });

    document.querySelectorAll('.btn[data-action="back-to-cosmo"]').forEach(btn => {
        btn.addEventListener('click', Navigation.travelBackToCosmo);
    });

    document.getElementById('contact-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const inputs = document.querySelectorAll('#contact-form [data-storage]');
        inputs.forEach(input => localStorage.setItem(input.dataset.storage, input.value));
        alert('Mensagem enviada com sucesso!');
        e.target.reset();
    });
})();

// Fetch API Mock
const DataFetcher = (() => {
    const fetchSustainabilityStats = () => {
        const statsDiv = document.getElementById('sustainability-stats');
        const mockData = { co2Saved: 500, renewableEnergy: 80 };
        statsDiv.innerHTML = `
            <p>CO2 economizado: ${mockData.co2Saved} toneladas</p>
            <p>Energia renovável: ${mockData.renewableEnergy}%</p>
        `;
    };
    return { fetchSustainabilityStats };
})();

// Animação Baseada em Scroll
const ScrollAnimation = (() => {
    document.addEventListener('DOMContentLoaded', () => {
        const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    if (entry.target.classList.contains('product-grid')) {
                        gsap.from(entry.target.children, {
                            opacity: 0,
                            y: 30,
                            duration: 0.8,
                            stagger: 0.2,
                            ease: 'power2.out'
                        });
                    }
                    observer.unobserve(entry.target);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        document.querySelectorAll('section, .product-grid, #contact-form, footer').forEach(element => {
            observer.observe(element);
        });

        gsap.registerPlugin(ScrollTrigger);
        gsap.from('#home h1', { scrollTrigger: '#home h1', y: 50, opacity: 0, duration: 0.8, ease: 'power2.out' });
        gsap.from('#home p', { scrollTrigger: '#home p', y: 30, opacity: 0, duration: 0.6, delay: 0.2, ease: 'power2.out' });
        gsap.from('.btn', { scrollTrigger: '.btn', scale: 0.9, opacity: 0, duration: 0.5, delay: 0.3, ease: 'back.out(1.7)' });
    });
})();

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    Navigation.showSection('home');
    DataFetcher.fetchSustainabilityStats();
    gsap.from('header', { y: -100, opacity: 0, duration: 1, ease: 'power2.out' });
});
