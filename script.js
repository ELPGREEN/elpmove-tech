let engine, scene, camera;

function initScene() {
    const canvas = document.getElementById("canvas");
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
}

function createGeometricBackground() {
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
    nebulaMat.emissiveTexture = new BABYLON.Texture("https://www.babylonjs-playground.com/textures/nebula.jpg", scene); // Substitua por uma textura real
    nebulaMat.emissiveColor = new BABYLON.Color3(0.1, 0.5, 0.3); // Tons verdes sutis
    nebulaMat.alpha = 0.6;
    nebula.material = nebulaMat;

    // Partículas estelares
    const particleSystem = new BABYLON.ParticleSystem("stars", 2000, scene);
    particleSystem.particleTexture = new BABYLON.Texture("https://www.babylonjs-playground.com/textures/flare.png", scene);
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

    return { hexGrid, nebula };
}

function animateBackground(elements) {
    let time = 0;
    scene.registerBeforeRender(() => {
        time += 0.01;

        // Movimento da malha hexagonal
        const waveHeight = Math.sin(time) * 5;
        elements.hexGrid.position.y = waveHeight;
        elements.hexGrid.rotation.x = Math.sin(time * 0.5) * 0.1;
        elements.hexGrid.rotation.z = Math.cos(time * 0.3) * 0.1;

        // Movimento da nebulosa
        elements.nebula.rotation.z += 0.002;
        elements.nebula.material.emissiveTexture.uOffset += 0.001;
        elements.nebula.material.emissiveTexture.vOffset += 0.0005;
    });
}

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
        section.classList.remove('active');
    });
    const targetSection = document.getElementById(sectionId);
    targetSection.classList.remove('hidden');
    targetSection.classList.add('active');

    // Animação com GSAP
    gsap.fromTo(targetSection, 
        { opacity: 0, y: 50 }, 
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    );

    // Animação dos itens de produto (se houver)
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

document.addEventListener('DOMContentLoaded', () => {
    initScene();
    const backgroundElements = createGeometricBackground();
    animateBackground(backgroundElements);
    engine.runRenderLoop(() => scene.render());

    // Navegação Desktop
    document.querySelectorAll('.menu a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('href').substring(1);
            showSection(sectionId);
        });
    });

    // Menu Mobile
    const phoneMenu = document.querySelector('.phone-menu');
    const nav = document.querySelector('.nav');
    phoneMenu.addEventListener('click', () => {
        nav.classList.toggle('active');
        phoneMenu.classList.toggle('open');

        if (nav.classList.contains('active')) {
            gsap.fromTo(nav, 
                { opacity: 0, y: -20 }, 
                { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
            );
        }
    });

    // Mostrar a seção inicial
    showSection('home');
});

window.addEventListener('resize', () => {
    engine.resize();
});
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
        section.classList.remove('active');
    });
    const targetSection = document.getElementById(sectionId);
    targetSection.classList.remove('hidden');
    targetSection.classList.add('active');

    // Animação da seção
    gsap.fromTo(targetSection, 
        { opacity: 0, y: 50 }, 
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    );

    // Animação específica do banner, se for a seção de produtos
    if (sectionId === 'produtos') {
        const bannerTitle = targetSection.querySelector('.banner-title');
        const bannerSubtitle = targetSection.querySelector('.banner-subtitle');
        const bannerBtn = targetSection.querySelector('.banner-btn');
        gsap.from([bannerTitle, bannerSubtitle, bannerBtn], {
            opacity: 0,
            y: 30,
            stagger: 0.2,
            duration: 0.6,
            ease: "power2.out",
            delay: 0.2
        });
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