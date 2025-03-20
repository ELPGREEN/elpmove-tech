// Configuração do Three.js
const ThreeSetup = (() => {
    const canvas = document.getElementById('canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    scene.fog = new THREE.FogExp2(0x0a0a23, 0.001);
    camera.position.z = 100;

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    canvas.classList.add('loaded');

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
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xFF007A, opacity: 0.3, transparent: true });
        const line = new THREE.Line(lineGeometry, lineMaterial);
        constellationLines.push(line);
    }

    ThreeSetup.scene.add(stars, ...constellationLines);
})();

// Partículas Futuristas
const Particles = (() => {
    const particleCount = 500;
    const particles = new THREE.Group();

    for (let i = 0; i < particleCount; i++) {
        const geometry = new THREE.SphereGeometry(0.2, 8, 8);
        const material = new THREE.MeshBasicMaterial({ 
            color: Math.random() > 0.5 ? 0xFF007A : 0x66CCFF,
            transparent: true,
            opacity: Math.random() * 0.5 + 0.3
        });
        const particle = new THREE.Mesh(geometry, material);

        particle.position.set(
            (Math.random() - 0.5) * 2000,
            (Math.random() - 0.5) * 2000,
            (Math.random() - 0.5) * 2000
        );
        particle.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.5,
            (Math.random() - 0.5) * 0.5,
            (Math.random() - 0.5) * 0.5
        );

        particles.add(particle);
    }

    ThreeSetup.scene.add(particles);

    const updateParticles = () => {
        particles.children.forEach(particle => {
            particle.position.add(particle.velocity);
            if (particle.position.length() > 1000) {
                particle.position.set(
                    (Math.random() - 0.5) * 2000,
                    (Math.random() - 0.5) * 2000,
                    (Math.random() - 0.5) * 2000
                );
                particle.velocity.set(
                    (Math.random() - 0.5) * 0.5,
                    (Math.random() - 0.5) * 0.5,
                    (Math.random() - 0.5) * 0.5
                );
            }
        });
    };

    return { update: updateParticles };
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

// Tetraedro (Nave)
const Tetrahedron = (() => {
    const geometry = new THREE.TetrahedronGeometry(10, 0);
    const material = new THREE.MeshPhongMaterial({ 
        color: 0x1C2526,
        specular: 0x66CCFF,
        shininess: 150,
        emissive: 0x000000,
        emissiveIntensity: 0
    });
    const tetrahedron = new THREE.Mesh(geometry, material);
    tetrahedron.position.set(0, 0, 50);

    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x66CCFF,
        transparent: true,
        opacity: 0.3
    });
    const glowGeometry = new THREE.TetrahedronGeometry(11, 0);
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    tetrahedron.add(glowMesh);

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
    const material = new THREE.LineBasicMaterial({ color: 0xFF007A });
    const lines = new THREE.LineSegments(geometry, material);

    ThreeSetup.scene.add(lines);
    return lines;
})();

// Planetas com Anéis
const Planets = (() => {
    const planetData = {
        green: [
            { 
                position: { x: -200, y: 50, z: -300 }, 
                color: 0xD2B48C,
                productPositions: [
                    { x: -20, y: 20, z: 20 },
                    { x: 20, y: 20, z: 20 },
                    { x: -20, y: -20, z: 20 },
                    { x: 20, y: -20, z: 20 },
                    { x: -20, y: 0, z: -20 },
                    { x: 20, y: 0, z: -20 }
                ]
            },
            { 
                position: { x: -100, y: 100, z: -250 }, 
                color: 0xC19A6B,
                productPositions: [
                    { x: -15, y: 25, z: 15 },
                    { x: 15, y: 25, z: 15 },
                    { x: -15, y: -15, z: 15 },
                    { x: 15, y: -15, z: 15 },
                    { x: -15, y: 0, z: -15 },
                    { x: 15, y: 0, z: -15 }
                ]
            },
            { 
                position: { x: 0, y: 80, z: -280 }, 
                color: 0xB8860B,
                productPositions: [
                    { x: -25, y: 15, z: 25 },
                    { x: 25, y: 15, z: 25 },
                    { x: -25, y: -25, z: 25 },
                    { x: 25, y: -25, z: 25 },
                    { x: -25, y: 0, z: -25 },
                    { x: 25, y: 0, z: -25 }
                ]
            },
            { 
                position: { x: 100, y: 60, z: -260 }, 
                color: 0xA0522D,
                productPositions: [
                    { x: -30, y: 10, z: 30 },
                    { x: 30, y: 10, z: 30 },
                    { x: -30, y: -30, z: 30 },
                    { x: 30, y: -30, z: 30 },
                    { x: -30, y: 0, z: -30 },
                    { x: 30, y: 0, z: -30 }
                ]
            },
            { 
                position: { x: 200, y: 40, z: -290 }, 
                color: 0x8B4513,
                productPositions: [
                    { x: -10, y: 30, z: 10 },
                    { x: 10, y: 30, z: 10 },
                    { x: -10, y: -10, z: 10 },
                    { x: 10, y: -10, z: 10 },
                    { x: -10, y: 0, z: -10 },
                    { x: 10, y: 0, z: -10 }
                ]
            }
        ],
        move: [
            { 
                position: { x: -200, y: -50, z: -300 }, 
                color: 0x4682B4,
                productPositions: [
                    { x: -18, y: 18, z: 18 },
                    { x: 18, y: 18, z: 18 },
                    { x: -18, y: -18, z: 18 },
                    { x: 18, y: -18, z: 18 },
                    { x: -18, y: 0, z: -18 },
                    { x: 18, y: 0, z: -18 }
                ]
            },
            { 
                position: { x: -100, y: -80, z: -270 }, 
                color: 0x5F9EA0,
                productPositions: [
                    { x: -22, y: 22, z: 22 },
                    { x: 22, y: 22, z: 22 },
                    { x: -22, y: -22, z: 22 },
                    { x: 22, y: -22, z: 22 },
                    { x: -22, y: 0, z: -22 },
                    { x: 22, y: 0, z: -22 }
                ]
            },
            { 
                position: { x: 0, y: -60, z: -290 }, 
                color: 0x87CEEB,
                productPositions: [
                    { x: -12, y: 12, z: 12 },
                    { x: 12, y: 12, z: 12 },
                    { x: -12, y: -12, z: 12 },
                    { x: 12, y: -12, z: 12 },
                    { x: -12, y: 0, z: -12 },
                    { x: 12, y: 0, z: -12 }
                ]
            },
            { 
                position: { x: 100, y: -40, z: -250 }, 
                color: 0xB0E0E6,
                productPositions: [
                    { x: -28, y: 28, z: 28 },
                    { x: 28, y: 28, z: 28 },
                    { x: -28, y: -28, z: 28 },
                    { x: 28, y: -28, z: 28 },
                    { x: -28, y: 0, z: -28 },
                    { x: 28, y: 0, z: -28 }
                ]
            },
            { 
                position: { x: 200, y: -20, z: -280 }, 
                color: 0xE0FFFF,
                productPositions: [
                    { x: -16, y: 16, z: 16 },
                    { x: 16, y: 16, z: 16 },
                    { x: -16, y: -16, z: 16 },
                    { x: 16, y: -16, z: 16 },
                    { x: -16, y: 0, z: -16 },
                    { x: 16, y: 0, z: -16 }
                ]
            }
        ]
    };

    const planets = [];

    const createPlanets = (galaxyKey) => {
        planetData[galaxyKey].forEach((planetInfo, index) => {
            const geometry = new THREE.SphereGeometry(10, 32, 32);
            const material = new THREE.MeshPhongMaterial({ 
                color: planetInfo.color,
                shininess: 30,
                specular: 0x333333,
                emissive: 0x111111,
                emissiveIntensity: 0.2
            });
            const planet = new THREE.Mesh(geometry, material);

            const ringGeometry = new THREE.RingGeometry(12, 15, 32, 1, 0, Math.PI * 2);
            const ringMaterial = new THREE.MeshPhongMaterial({ 
                color: 0xD3D3D3,
                side: THREE.DoubleSide, 
                transparent: true, 
                opacity: 0.7,
                shininess: 10
            });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 2;

            const outerRingGeometry = new THREE.RingGeometry(16, 18, 32, 1, 0, Math.PI * 2);
            const outerRingMaterial = new THREE.MeshPhongMaterial({ 
                color: 0xA9A9A9,
                side: THREE.DoubleSide, 
                transparent: true, 
                opacity: 0.5,
                shininess: 10
            });
            const outerRing = new THREE.Mesh(outerRingGeometry, outerRingMaterial);
            outerRing.rotation.x = Math.PI / 2;

            const planetGroup = new THREE.Group();
            planetGroup.add(planet);
            planetGroup.add(ring);
            planetGroup.add(outerRing);
            planetGroup.position.copy(planetInfo.position);
            planetGroup.visible = false;

            ThreeSetup.scene.add(planetGroup);
            planets.push({ planet: planetGroup, galaxy: galaxyKey, index, productPositions: planetInfo.productPositions });
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
        Particles.update();
        ThreeSetup.renderer.render(ThreeSetup.scene, ThreeSetup.camera);
    };
    animate();
})();

// Navegação
const Navigation = (() => {
    let currentGalaxy = null;
    let currentPlanetId = null;

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
            } else if (id.includes('-store')) {
                const planetId = id.replace('-store', '');
                const targetPlanet = Planets.find(p => `${p.galaxy}-planet-${p.index}` === planetId);
                currentPlanetId = planetId;
                if (targetPlanet) {
                    const planetPos = targetPlanet.planet.position;
                    const timeline = gsap.timeline({
                        onStart: () => {
                            Planets.forEach(p => p.planet.visible = false);
                            targetPlanet.planet.visible = true;
                        }
                    });

                    timeline.to(ThreeSetup.camera.position, {
                        x: planetPos.x,
                        y: planetPos.y,
                        z: planetPos.z + 50,
                        duration: 1,
                        ease: 'power2.in'
                    });

                    timeline.to(ThreeSetup.camera.position, {
                        z: planetPos.z + 30,
                        duration: 1,
                        ease: 'power2.out'
                    }, "-=0.5");

                    // Resetar seleção de produtos
                    const storeSection = document.getElementById(id);
                    storeSection.querySelectorAll('.planet-store').forEach(product => {
                        product.classList.remove('selected');
                    });
                }
            } else if (id.includes('-product-')) {
                const planetId = id.split('-product-')[0];
                const targetPlanet = Planets.find(p => `${p.galaxy}-planet-${p.index}` === planetId);
                if (targetPlanet) {
                    const planetPos = targetPlanet.planet.position;
                    const productIndex = parseInt(id.split('-product-')[1]);
                    const productPos = targetPlanet.productPositions[productIndex];
                    if (productPos) {
                        gsap.to(ThreeSetup.camera.position, {
                            x: planetPos.x + productPos.x,
                            y: planetPos.y + productPos.y,
                            z: planetPos.z + productPos.z,
                            duration: 1,
                            ease: 'power2.inOut',
                            onStart: () => {
                                Planets.forEach(p => p.planet.visible = false);
                                targetPlanet.planet.visible = true;
                            }
                        });
                    }
                }
            } else if (id.includes('planet') && !id.includes('store')) {
                const targetPlanet = Planets.find(p => `${p.galaxy}-planet-${p.index}` === id);
                if (targetPlanet) {
                    gsap.to(ThreeSetup.camera.position, {
                        x: targetPlanet.planet.position.x,
                        y: targetPlanet.planet.position.y,
                        z: targetPlanet.planet.position.z + 50,
                        duration: 1.5,
                        ease: 'power2.inOut',
                        onStart: () => {
                            Planets.forEach(p => p.planet.visible = false);
                            targetPlanet.planet.visible = true;
                        }
                    });
                }
            } else {
                gsap.to(ThreeSetup.camera.position, { x: 0, y: 0, z: 100, duration: 1, ease: 'power2.inOut' });
                Planets.forEach(p => p.planet.visible = false);
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
        if (currentGalaxy) {
            showSection(`${currentGalaxy}-planet-${index}`);
        }
    };

    const travelBack = () => {
        showSection('intro');
        gsap.to(ThreeSetup.camera.position, { x: 0, y: 0, z: 200, duration: 1.5, ease: 'power2.inOut' });
        Planets.forEach(p => p.planet.visible = p.galaxy === currentGalaxy);
    };

    const travelBackToCosmo = () => {
        currentGalaxy = null;
        currentPlanetId = null;
        showSection('navegue');
        gsap.to(ThreeSetup.camera.position, { x: 0, y: 0, z: 100, duration: 1.5, ease: 'power2.inOut' });
        Planets.forEach(p => p.planet.visible = false);
    };

    const travelBackToPlanet = (planetId) => {
        showSection(planetId);
        const targetPlanet = Planets.find(p => `${p.galaxy}-planet-${p.index}` === planetId);
        if (targetPlanet) {
            gsap.to(ThreeSetup.camera.position, {
                x: targetPlanet.planet.position.x,
                y: targetPlanet.planet.position.y,
                z: targetPlanet.planet.position.z + 50,
                duration: 1.5,
                ease: 'power2.inOut'
            });
        }
    };

    const selectProduct = (planetId, productIndex) => {
        const targetPlanet = Planets.find(p => `${p.galaxy}-planet-${p.index}` === planetId);
        if (targetPlanet) {
            const planetPos = targetPlanet.planet.position;
            const productPos = targetPlanet.productPositions[productIndex];
            if (productPos) {
                gsap.to(ThreeSetup.camera.position, {
                    x: planetPos.x + productPos.x,
                    y: planetPos.y + productPos.y,
                    z: planetPos.z + productPos.z,
                    duration: 1,
                    ease: 'power2.inOut'
                });
            }
        }
    };

    const showProductDetails = (planetId, productIndex) => {
        const productSectionId = `${planetId}-product-${productIndex}`;
        showSection(productSectionId);
    };

    const travelBackToStore = (storeId) => {
        showSection(storeId);
    };

    return { showSection, enterGalaxy, travelTo, travelBack, travelBackToCosmo, travelBackToPlanet, selectProduct, showProductDetails, travelBackToStore };
})();

// Eventos
const Events = (() => {
    const navMenu = document.getElementById('nav-menu');

    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const id = link.getAttribute('href').substring(1);
            Navigation.showSection(id);
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

    document.querySelectorAll('.btn[data-action="back-to-planet"]').forEach(btn => {
        btn.addEventListener('click', () => Navigation.travelBackToPlanet(btn.dataset.planet));
    });

    document.querySelectorAll('.btn[data-store]').forEach(btn => {
        btn.addEventListener('click', () => Navigation.showSection(btn.dataset.store));
    });

    document.querySelectorAll('.planet-store').forEach(product => {
        product.addEventListener('click', () => {
            const planetId = product.closest('section').id.replace('-store', '');
            const productIndex = parseInt(product.dataset.product);

            // Remover a classe 'selected' de todos os produtos na mesma loja
            product.closest('.product-grid').querySelectorAll('.planet-store').forEach(p => {
                p.classList.remove('selected');
            });

            // Adicionar a classe 'selected' ao produto clicado
            product.classList.add('selected');

            // Mover a câmera para a posição correspondente ao produto
            Navigation.selectProduct(planetId, productIndex);

            // Mostrar a seção individual do produto
            Navigation.showProductDetails(planetId, productIndex);
        });
    });

    document.querySelectorAll('.btn[data-action="back-to-store"]').forEach(btn => {
        btn.addEventListener('click', () => Navigation.travelBackToStore(btn.dataset.store));
    });

    document.getElementById('contact-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const inputs = document.querySelectorAll('#contact-form [data-storage]');
        inputs.forEach(input => localStorage.setItem(input.dataset.storage, input.value));
        const messageDiv = document.getElementById('form-message');
        messageDiv.textContent = 'Mensagem enviada com sucesso! Entraremos em contato em breve.';
        messageDiv.style.display = 'block';
        gsap.fromTo(messageDiv, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 });
        setTimeout(() => {
            gsap.to(messageDiv, { opacity: 0, duration: 0.5, onComplete: () => messageDiv.style.display = 'none' });
        }, 3000);
        e.target.reset();
    });
})();

// Fetch API Mock
const DataFetcher = (() => {
    const fetchSustainabilityStats = () => {
        const statsDiv = document.getElementById('sustainability-stats');
        const mockData = {
            co2Saved: 750,
            renewableEnergy: 85,
            treesPlanted: 12000,
            waterSaved: 500000
        };
        statsDiv.innerHTML = `
            <p>CO2 economizado: ${mockData.co2Saved} toneladas</p>
            <p>Energia renovável: ${mockData.renewableEnergy}%</p>
            <p>Árvores plantadas: ${mockData.treesPlanted}</p>
            <p>Água economizada: ${mockData.waterSaved} litros</p>
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