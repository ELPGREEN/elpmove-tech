let engine, scene, camera;

function initScene() {
    try {
        const canvas = document.getElementById("canvas");
        if (!canvas) throw new Error("Canvas element not found");
        
        engine = new BABYLON.Engine(canvas, true);
        scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color4(0, 0, 0.1, 1); // Fundo quase preto com leve azul

        // Câmera
        camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 2, 50, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(canvas, true);
        camera.lowerRadiusLimit = 20;
        camera.upperRadiusLimit = 100;

        // Iluminação
        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
        light.intensity = 0.8;

        const volumetricLight = new BABYLON.SpotLight("volumetricLight", new BABYLON.Vector3(0, 50, 0), new BABYLON.Vector3(0, -1, 0), Math.PI / 2, 1, scene);
        volumetricLight.intensity = 0.5;
        const glowLayer = new BABYLON.GlowLayer("glow", scene);
        glowLayer.addIncludedOnlyMesh(volumetricLight);
    } catch (error) {
        console.error("Erro ao inicializar Babylon.js:", error);
    }
}

function createGeometricBackground() {
    try {
        // Malha hexagonal
        const hexGrid = BABYLON.MeshBuilder.CreateGround("hexGrid", { width: 200, height: 200, subdivisions: 50 }, scene);
        const hexMat = new BABYLON.StandardMaterial("hexMat", scene);
        hexMat.emissiveColor = new BABYLON.Color3(0, 0.8, 0.2); // Verde suave para combinar com a marca
        hexMat.wireframe = true;
        hexGrid.material = hexMat;

        // Nebulosa de fundo
        const nebula = BABYLON.MeshBuilder.CreatePlane("nebula", { size: 250 }, scene);
        nebula.position.z = -100;
        const nebulaMat = new BABYLON.StandardMaterial("nebulaMat", scene);
        nebulaMat.emissiveTexture = new BABYLON.Texture("https://www.babylonjs-playground.com/textures/nebula.jpg", scene); // Substitua por textura local
        nebulaMat.emissiveColor = new BABYLON.Color3(0.1, 0.5, 0.3); // Tons verdes sutis
        nebulaMat.alpha = 0.6;
        nebula.material = nebulaMat;

        // Partículas estelares
        const particleSystem = new BABYLON.ParticleSystem("stars", 2000, scene);
        particleSystem.particleTexture = new BABYLON.Texture("https://www.babylonjs-playground.com/textures/flare.png", scene); // Substitua por textura local
        particleSystem.emitter = new BABYLON.Vector3(0, 0, 0);
        particleSystem.minEmitBox = new BABYLON.Vector3(-100, -50, -100);
        particleSystem.maxEmitBox = new BABYLON.Vector3(100, 50, 100);
        particleSystem.color1 = new BABYLON.Color4(1, 1, 1, 0.8);
        particleSystem.color2 = new BABYLON.Color4(0, 0.8, 0.2, 0.5); // Verde da marca
        particleSystem.minSize = 0.1;
        particleSystem.maxSize = 0.3;
        particleSystem.emitRate = 500;
        particleSystem.updateSpeed = 0.01;
        particleSystem.start();

        return { hexGrid, nebula, particleSystem };
    } catch (error) {
        console.error("Erro ao criar fundo geométrico:", error);
        return {};
    }
}

function animateBackground(elements) {
    let time = 0;
    if (!scene) return;

    scene.registerBeforeRender(() => {
        time += 0.01;

        // Movimento da malha hexagonal
        const waveHeight = Math.sin(time) * 5;
        if (elements.hexGrid) {
            elements.hexGrid.position.y = waveHeight;
            elements.hexGrid.rotation.x = Math.sin(time * 0.5) * 0.1;
            elements.hexGrid.rotation.z = Math.cos(time * 0.3) * 0.1;
        }

        // Movimento da nebulosa
        if (elements.nebula && elements.nebula.material) {
            elements.nebula.rotation.z += 0.002;
            elements.nebula.material.emissiveTexture.uOffset += 0.001;
            elements.nebula.material.emissiveTexture.vOffset += 0.0005;
        }
    });
}

function showSection(sectionId) {
    if (!sectionId) return;

    // Ocultar todas as seções com animação de saída
    document.querySelectorAll('.section').forEach(section => {
        if (section.id !== sectionId) {
            gsap.to(section, {
                opacity: 0,
                y: 50,
                duration: 0.5,
                ease: "power2.out",
                onComplete: () => {
                    section.style.display = 'none';
                    section.classList.remove('active');
                }
            });
        }
    });

    // Mostrar a seção desejada com animação de entrada
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'flex';
        targetSection.classList.remove('hidden');
        targetSection.classList.add('active');
        gsap.fromTo(targetSection, 
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
        );

        // Animação específica do banner na seção "produtos"
        if (sectionId === 'produtos') {
            const bannerTitle = targetSection.querySelector('.banner-title');
            const bannerSubtitle = targetSection.querySelector('.banner-subtitle');
            const bannerBtn = targetSection.querySelector('.banner-btn');
            if (bannerTitle && bannerSubtitle && bannerBtn) {
                gsap.from([bannerTitle, bannerSubtitle, bannerBtn], {
                    opacity: 0,
                    y: 30,
                    stagger: 0.2,
                    duration: 0.6,
                    ease: "power2.out",
                    delay: 0.2
                });
            }
        }

        // Animação dos itens de produto
        const products = targetSection.querySelectorAll('.product-item');
        if (products.length > 0) {
            gsap.from(products, {
                opacity: 0,
                y: 30,
                stagger: 0.2,
                duration: 0.6,
                ease: "power2.out",
                delay: 0.3
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        initScene();
        const backgroundElements = createGeometricBackground();
        animateBackground(backgroundElements);
        if (engine) engine.runRenderLoop(() => {
            if (scene) scene.render();
        });

        // Navegação Desktop
        document.querySelectorAll('.menu a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = link.getAttribute('href').substring(1);
                showSection(sectionId);

                // Fechar menu mobile ao clicar em um link
                const nav = document.querySelector('.nav');
                const phoneMenu = document.querySelector('.phone-menu');
                if (nav && phoneMenu && nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    phoneMenu.classList.remove('open');
                    gsap.to(nav, { opacity: 0, y: -20, duration: 0.5, ease: "power2.out" });
                }
            });
        });

        // Menu Mobile
        const phoneMenu = document.querySelector('.phone-menu');
        const nav = document.querySelector('.nav');
        if (phoneMenu && nav) {
            phoneMenu.addEventListener('click', () => {
                nav.classList.toggle('active');
                phoneMenu.classList.toggle('open');

                if (nav.classList.contains('active')) {
                    gsap.fromTo(nav, 
                        { opacity: 0, y: -20 },
                        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
                    );
                } else {
                    gsap.to(nav, { opacity: 0, y: -20, duration: 0.5, ease: "power2.out" });
                }
            });
        }

        // Mostrar a seção inicial
        showSection('home');

        // Ajuste do canvas para não sobrepor seções
        const canvas = document.getElementById('canvas');
        if (canvas) {
            canvas.style.position = 'fixed';
            canvas.style.zIndex = '-1'; // Garante que o canvas fique atrás das seções
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
        }
    } catch (error) {
        console.error("Erro ao carregar o script:", error);
    }
});

window.addEventListener('resize', () => {
    if (engine) engine.resize();
});

// Tratamento de erros gerais
window.addEventListener('error', (event) => {
    console.error("Erro capturado:", event.message);
});
// Função para o Slide Automático na Seção Franquia
function initFranchiseSlider() {
    const slider = document.querySelector('.franchise-slider');
    if (!slider) return;

    const slides = slider.querySelectorAll('.slide');
    const dots = slider.querySelectorAll('.dot');
    const prevBtn = slider.querySelector('.slider-prev');
    const nextBtn = slider.querySelector('.slider-next');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });

        dots.forEach((dot, i) => {
            dot.classList.remove('active');
            if (i === index) {
                dot.classList.add('active');
            }
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    // Iniciar o slide automático (muda a cada 5 segundos)
    function startSlide() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    // Parar o slide automático
    function stopSlide() {
        clearInterval(slideInterval);
    }

    // Eventos para botões de navegação
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            stopSlide();
            prevSlide();
            startSlide();
        });

        nextBtn.addEventListener('click', () => {
            stopSlide();
            nextSlide();
            startSlide();
        });
    }

    // Eventos para os indicadores (dots)
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopSlide();
            currentSlide = index;
            showSlide(currentSlide);
            startSlide();
        });
    });

    // Pausar o slide quando a seção não estiver visível
    const franchiseSection = document.getElementById('franquia');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startSlide();
            } else {
                stopSlide();
            }
        });
    }, { threshold: 0.5 });

    observer.observe(franchiseSection);

    // Mostrar o primeiro slide
    showSlide(currentSlide);
    startSlide();
}

// Função showSection ajustada para incluir animação das franquias
function showSection(sectionId) {
    if (!sectionId) return;

    // Ocultar todas as seções com animação de saída
    document.querySelectorAll('.section').forEach(section => {
        if (section.id !== sectionId) {
            gsap.to(section, {
                opacity: 0,
                y: 50,
                duration: 0.5,
                ease: "power2.out",
                onComplete: () => {
                    section.style.display = 'none';
                    section.classList.remove('active');
                }
            });
        }
    });

    // Mostrar a seção desejada com animação de entrada
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'flex';
        targetSection.classList.remove('hidden');
        targetSection.classList.add('active');
        gsap.fromTo(targetSection, 
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
        );

        // Animação específica do banner na seção "produtos"
        if (sectionId === 'produtos') {
            const bannerTitle = targetSection.querySelector('.banner-title');
            const bannerSubtitle = targetSection.querySelector('.banner-subtitle');
            const bannerBtn = targetSection.querySelector('.banner-btn');
            if (bannerTitle && bannerSubtitle && bannerBtn) {
                gsap.from([bannerTitle, bannerSubtitle, bannerBtn], {
                    opacity: 0,
                    y: 30,
                    stagger: 0.2,
                    duration: 0.6,
                    ease: "power2.out",
                    delay: 0.2
                });
            }
        }

        // Animação dos itens de produto
        const products = targetSection.querySelectorAll('.product-item');
        if (products.length > 0) {
            gsap.from(products, {
                opacity: 0,
                y: 30,
                stagger: 0.2,
                duration: 0.6,
                ease: "power2.out",
                delay: 0.3
            });
        }

        // Animação dos itens de franquia
        const franchiseItems = targetSection.querySelectorAll('.franchise-item');
        if (franchiseItems.length > 0 && sectionId === 'franquia') {
            gsap.from(franchiseItems, {
                opacity: 0,
                y: 30,
                stagger: 0.2,
                duration: 0.6,
                ease: "power2.out",
                delay: 0.3
            });
        }

        // Inicializar o slider quando a seção franquia for exibida
        if (sectionId === 'franquia') {
            initFranchiseSlider();
        }
    }
}
// Função showSection ajustada para incluir animação dos itens da seção Sobre
function showSection(sectionId) {
    if (!sectionId) return;

    // Ocultar todas as seções com animação de saída
    document.querySelectorAll('.section').forEach(section => {
        if (section.id !== sectionId) {
            gsap.to(section, {
                opacity: 0,
                y: 50,
                duration: 0.5,
                ease: "power2.out",
                onComplete: () => {
                    section.style.display = 'none';
                    section.classList.remove('active');
                }
            });
        }
    });

    // Mostrar a seção desejada com animação de entrada
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'flex';
        targetSection.classList.remove('hidden');
        targetSection.classList.add('active');
        gsap.fromTo(targetSection, 
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
        );

        // Animação específica do banner na seção "produtos"
        if (sectionId === 'produtos') {
            const bannerTitle = targetSection.querySelector('.banner-title');
            const bannerSubtitle = targetSection.querySelector('.banner-subtitle');
            const bannerBtn = targetSection.querySelector('.banner-btn');
            if (bannerTitle && bannerSubtitle && bannerBtn) {
                gsap.from([bannerTitle, bannerSubtitle, bannerBtn], {
                    opacity: 0,
                    y: 30,
                    stagger: 0.2,
                    duration: 0.6,
                    ease: "power2.out",
                    delay: 0.2
                });
            }
        }

        // Animação dos itens de produto
        const products = targetSection.querySelectorAll('.product-item');
        if (products.length > 0) {
            gsap.from(products, {
                opacity: 0,
                y: 30,
                stagger: 0.2,
                duration: 0.6,
                ease: "power2.out",
                delay: 0.3
            });
        }

        // Animação dos itens de franquia
        const franchiseItems = targetSection.querySelectorAll('.franchise-item');
        if (franchiseItems.length > 0 && sectionId === 'franquia') {
            gsap.from(franchiseItems, {
                opacity: 0,
                y: 30,
                stagger: 0.2,
                duration: 0.6,
                ease: "power2.out",
                delay: 0.3
            });
        }

        // Animação dos itens de benefícios
        const beneficioItems = targetSection.querySelectorAll('.beneficios ul li');
        if (beneficioItems.length > 0 && sectionId === 'beneficios') {
            gsap.from(beneficioItems, {
                opacity: 0,
                y: 30,
                stagger: 0.2,
                duration: 0.6,
                ease: "power2.out",
                delay: 0.3
            });
        }

        // Animação dos itens da seção Sobre (parte superior e inferior)
        const sobreTopItems = targetSection.querySelectorAll('.sobre-top .sobre-column');
        const sobreBottomItems = targetSection.querySelectorAll('.sobre-bottom .sobre-item');
        if (sobreTopItems.length > 0 && sectionId === 'sobre') {
            gsap.from(sobreTopItems, {
                opacity: 0,
                y: 30,
                stagger: 0.2,
                duration: 0.6,
                ease: "power2.out",
                delay: 0.3
            });
        }
        if (sobreBottomItems.length > 0 && sectionId === 'sobre') {
            gsap.from(sobreBottomItems, {
                opacity: 0,
                y: 30,
                stagger: 0.2,
                duration: 0.6,
                ease: "power2.out",
                delay: 0.5
            });
        }

        // Inicializar o slider quando a seção franquia for exibida
        if (sectionId === 'franquia') {
            initFranchiseSlider();
        }
    }
}
// Função para download do catálogo
document.getElementById('download-catalogo').addEventListener('click', function(e) {
    e.preventDefault(); // Impede o comportamento padrão do link

    // Caminho do arquivo (ajuste conforme necessário)
    const catalogoUrl = 'downloads/catalogo-elp-move.pdf'; // Substitua pelo caminho real

    // Verifica se o arquivo existe (simplificado, depende do servidor)
    fetch(catalogoUrl)
        .then(response => {
            if (response.ok) {
                // Cria um link temporário para download
                const link = document.createElement('a');
                link.href = catalogoUrl;
                link.download = 'catalogo-elp-move.pdf'; // Nome do arquivo baixado
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                alert('O catálogo não está disponível no momento. Tente novamente mais tarde.');
            }
        })
        .catch(error => {
            console.error('Erro ao acessar o catálogo:', error);
            alert('Erro ao baixar o catálogo. Contate o suporte.');
        });
});
// Função genérica para iniciar o download
function iniciarDownload(catalogoUrl, nomeProduto) {
    fetch(catalogoUrl)
        .then(response => {
            if (response.ok) {
                window.location.href = catalogoUrl; // Inicia o download
            } else {
                alert(`O catálogo do ${nomeProduto} não está disponível no momento. Verifique o link ou contate o suporte.`);
            }
        })
        .catch(error => {
            console.error(`Erro ao acessar o catálogo do ${nomeProduto}:`, error);
            alert(`Erro ao baixar o catálogo do ${nomeProduto}. Verifique sua conexão ou contate o suporte.`);
        });
}

// X8 - Scooter Elétrica com Bateria Removível
document.getElementById('download-x8').addEventListener('click', function(e) {
    e.preventDefault();
    const catalogoUrl = 'https://drive.google.com/uc?export=download&id=SUA_ID_AQUI_X8';
    iniciarDownload(catalogoUrl, 'X8');
});

// X9 - Scooter Elétrica de Luxo
document.getElementById('download-x9').addEventListener('click', function(e) {
    e.preventDefault();
    const catalogoUrl = 'https://drive.google.com/uc?export=download&id=SUA_ID_AQUI_X9';
    iniciarDownload(catalogoUrl, 'X9');
});

// X10 - Scooter Elétrica Portátil Dobrável
document.getElementById('download-x10').addEventListener('click', function(e) {
    e.preventDefault();
    const catalogoUrl = 'https://drive.google.com/uc?export=download&id=SUA_ID_AQUI_X10';
    iniciarDownload(catalogoUrl, 'X10');
});

// X11 - Scooter Elétrica de Longo Alcance
document.getElementById('download-x11').addEventListener('click', function(e) {
    e.preventDefault();
    const catalogoUrl = 'https://drive.google.com/uc?export=download&id=SUA_ID_AQUI_X11';
    iniciarDownload(catalogoUrl, 'X11');
});

// X12 - Scooter Elétrica Off-Road
document.getElementById('download-x12').addEventListener('click', function(e) {
    e.preventDefault();
    const catalogoUrl = 'https://drive.google.com/uc?export=download&id=SUA_ID_AQUI_X12';
    iniciarDownload(catalogoUrl, 'X12');
});

// X13 - Scooter Elétrica Off-Road
document.getElementById('download-x13').addEventListener('click', function(e) {
    e.preventDefault();
    const catalogoUrl = 'https://drive.google.com/uc?export=download&id=SUA_ID_AQUI_X13';
    iniciarDownload(catalogoUrl, 'X13');
});

// H1 - E-Bike Urbana com Bateria Removível
document.getElementById('download-h1').addEventListener('click', function(e) {
    e.preventDefault();
    const catalogoUrl = 'https://drive.google.com/uc?export=download&id=SUA_ID_AQUI_H1';
    iniciarDownload(catalogoUrl, 'H1');
});

// H2 - E-Bike Urbana Inteligente
document.getElementById('download-h2').addEventListener('click', function(e) {
    e.preventDefault();
    const catalogoUrl = 'https://drive.google.com/uc?export=download&id=SUA_ID_AQUI_H2';
    iniciarDownload(catalogoUrl, 'H2');
});

// Q3 - E-Bike de Montanha Portátil
document.getElementById('download-q3').addEventListener('click', function(e) {
    e.preventDefault();
    const catalogoUrl = 'https://drive.google.com/uc?export=download&id=SUA_ID_AQUI_Q3';
    iniciarDownload(catalogoUrl, 'Q3');
});

// H3 - E-Bike de Carga
document.getElementById('download-h3').addEventListener('click', function(e) {
    e.preventDefault();
    const catalogoUrl = 'https://drive.google.com/uc?export=download&id=SUA_ID_AQUI_H3';
    iniciarDownload(catalogoUrl, 'H3');
});