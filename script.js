////////////////////////////////////////////////////////////////////////////////////////////
///////////////ГРАДИЕНТ НА БЛОКЕ CONTENT////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', function() {
    const gradientBg = document.querySelector('.gradient-bg1');
    document.addEventListener('mousemove', function(e) {
        //позицию мыши
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        const posX = mouseX * 100;
        const posY = mouseY * 100;
        gradientBg.style.background = `
            radial-gradient(
                circle at ${posX}% ${posY}%,
rgb(68, 10, 10) 0%,
rgb(61, 8, 8) 25%,
rgb(43, 5, 5) 50%,
rgb(34, 3, 3) 75%,
rgb(14, 13, 13) 100%
            )
        `;
    });
});


