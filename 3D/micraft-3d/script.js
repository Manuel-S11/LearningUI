const UNIT = 12;

const colors = {
suit: "#17171b",
darkSuit: "#0f0f12",
skin: "#a97650",
hair: "#4a3020",
shirt: "#f2f2f2",
tie: "#19b5a5",
visor: "#050506",
shoe: "#0a0a0c"
};

const figure = document.getElementById("figure");
const stage = document.getElementById("stage");
const spinButton = document.getElementById("spinButton");

let rotateX = -12;
let rotateY = -32;

let spinning = true;
let dragging = false;

let lastMouseX = 0;
let lastMouseY = 0;

function createBox(width, height, depth, x, y, z, faceColors, content = {}) {
const w = width * UNIT;
const h = height * UNIT;
const d = depth * UNIT;

const part = document.createElement("div");

part.className = "part";
part.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;

const faces = [
    {
        name: "front",
        width: w,
        height: h,
        transform: `translateZ(${d / 2}px)`,
        brightness: 1
    },
    {
        name: "back",
        width: w,
        height: h,
        transform: `rotateY(180deg) translateZ(${d / 2}px)`,
        brightness: 0.7
    },
    {
        name: "right",
        width: d,
        height: h,
        transform: `rotateY(90deg) translateZ(${w / 2}px)`,
        brightness: 0.6
    },
    {
        name: "left",
        width: d,
        height: h,
        transform: `rotateY(-90deg) translateZ(${w / 2}px)`,
        brightness: 0.82
    },
    {
        name: "top",
        width: w,
        height: d,
        transform: `rotateX(90deg) translateZ(${h / 2}px)`,
        brightness: 1.25
    },
    {
        name: "bottom",
        width: w,
        height: d,
        transform: `rotateX(-90deg) translateZ(${h / 2}px)`,
        brightness: 0.45
    }
];

faces.forEach(face => {
    const element = document.createElement("div");

    element.className = "face";

    element.style.width = `${face.width}px`;
    element.style.height = `${face.height}px`;

    element.style.marginTop = `${-face.height / 2}px`;
    element.style.marginLeft = `${-face.width / 2}px`;

    element.style.background = faceColors[face.name];
    element.style.transform = face.transform;
    element.style.filter = `brightness(${face.brightness})`;

    if (content[face.name]) {
        element.innerHTML = content[face.name];
    }

    part.appendChild(element);
});

figure.appendChild(part);

}

function createSplitColor(topColor, bottomColor, percentage) {
return `linear-gradient(
        ${topColor} 0 ${percentage}%,
        ${bottomColor} ${percentage}% 100%
    )`;
}

function buildCharacter() {
figure.innerHTML = "";


const headSide = `
    linear-gradient(
        transparent 0 30%,
        ${colors.visor} 30% 46%,
        transparent 46% 100%
    ),
    linear-gradient(
        ${colors.hair} 0 38%,
        ${colors.skin} 38% 100%
    )
`;

createBox(
    8,
    8,
    8,
    0,
    -144,
    0,
    {
        front: colors.visor,
        back: colors.hair,
        top: colors.hair,
        bottom: colors.skin,
        left: headSide,
        right: headSide
    },
    {
        front: '<div class="question-mark">?</div>'
    }
);



const shirt = `
    linear-gradient(
        ${colors.tie},
        ${colors.tie}
    ) 50% 22% / 12% 55% no-repeat,

    linear-gradient(
        ${colors.shirt},
        ${colors.shirt}
    ) 50% 0 / 26% 70% no-repeat,

    ${colors.suit}
`;

createBox(
    8,
    12,
    4,
    0,
    -24,
    0,
    {
        front: shirt,
        back: colors.suit,
        left: colors.suit,
        right: colors.suit,
        top: colors.suit,
        bottom: colors.darkSuit
    }
);


const armColors = createSplitColor(
    colors.suit,
    colors.skin,
    84
);

const armFaces = {
    front: armColors,
    back: armColors,
    left: armColors,
    right: armColors,
    top: colors.suit,
    bottom: colors.skin
};

createBox(4, 12, 4, -72, -24, 0, armFaces);
createBox(4, 12, 4, 72, -24, 0, armFaces);


const legColors = createSplitColor(
    colors.darkSuit,
    colors.shoe,
    88
);

const legFaces = {
    front: legColors,
    back: legColors,
    left: legColors,
    right: legColors,
    top: colors.darkSuit,
    bottom: colors.shoe
};

createBox(4, 12, 4, -24, 120, 0, legFaces);
createBox(4, 12, 4, 24, 120, 0, legFaces);


}

function getScale() {
const availableHeight = stage.clientHeight - 40;

return Math.min(
    1.4,
    Math.max(0.5, availableHeight / 440)
);

}

function updateRotation() {
const scale = getScale();

figure.style.transform = `
    scale(${scale})
    rotateX(${rotateX}deg)
    rotateY(${rotateY}deg)
`;

}


stage.addEventListener("pointerdown", event => {
dragging = true;

lastMouseX = event.clientX;
lastMouseY = event.clientY;

stage.setPointerCapture(event.pointerId);

});

stage.addEventListener("pointermove", event => {
if (!dragging) {
return;
}

const deltaX = event.clientX - lastMouseX;
const deltaY = event.clientY - lastMouseY;

rotateY += deltaX * 0.6;
rotateX -= deltaY * 0.4;

rotateX = Math.max(-60, Math.min(60, rotateX));

lastMouseX = event.clientX;
lastMouseY = event.clientY;

updateRotation();

});

function stopDragging() {
dragging = false;
}

stage.addEventListener("pointerup", stopDragging);
stage.addEventListener("pointercancel", stopDragging);


spinButton.addEventListener("click", () => {
spinning = !spinning;

spinButton.textContent = spinning
    ? "Pause spin"
    : "Start spin";

});

const reducedMotion = window.matchMedia(
"(prefers-reduced-motion: reduce)"
).matches;

if (reducedMotion) {
spinning = false;
spinButton.textContent = "Start spin";
}

function animate() {
if (spinning && !dragging) {
rotateY += 0.4;
updateRotation();
}

requestAnimationFrame(animate);

}

window.addEventListener("resize", updateRotation);

buildCharacter();
updateRotation();
animate();
