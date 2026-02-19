document.addEventListener('DOMContentLoaded', () => {

    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            window.scrollTo({
                top: targetSection.offsetTop - 20,
                behavior: 'smooth'
            });

            // Update active state manually
            document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Highlight active section on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav ul li a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').includes(current)) {
                a.classList.add('active');
            }
        });
    });
}); // Closed DOMContentLoaded

// Interactive Activities
function calculateResistance() {
    const voltage = parseFloat(document.getElementById('calc-voltage').value);
    const current = parseFloat(document.getElementById('calc-current').value);
    const resultDisplay = document.getElementById('calc-result');

    if (isNaN(voltage) || isNaN(current) || current === 0) {
        resultDisplay.textContent = "Please enter valid values.";
        resultDisplay.style.color = "#d32f2f";
        return;
    }

    // R = V / I (Convert mA to A: I / 1000)
    const resistance = voltage / (current / 1000);

    resultDisplay.innerHTML = `Resistance Needed = <span style="font-size: 1.2rem; color: #28a745;">${resistance.toFixed(2)} Ω</span>`;
}

// Resistor Color Code Logic
const colorMap = {
    '0': 'black', '1': '#964b00', '2': 'red', '3': 'orange', '4': 'yellow',
    '5': 'green', '6': 'blue', '7': 'violet', '8': 'gray', '9': 'white',
    '-1': '#ffd700', '-2': 'silver' // Gold/Silver for tolerance technically, but using simplified value map for now
};

// Expanded map for multiplier colors specifically
const multColorMap = {
    '1': 'black', '10': '#964b00', '100': 'red', '1k': 'orange', '10k': 'yellow',
    '100k': 'green', '1M': 'blue', '10M': 'violet', '1000': 'orange', '10000': 'yellow',
    '100000': 'green', '1000000': 'blue'
};

const tolColorMap = {
    '1': '#964b00', '2': 'red', '5': '#ffd700', '10': 'silver'
};

function updateResistor() {
    // Get values
    const b1 = document.getElementById('select-band1').value;
    const b2 = document.getElementById('select-band2').value;
    const mult = document.getElementById('select-multiplier').value;
    const tol = document.getElementById('select-tolerance').value;

    // Calculate Ohms
    let ohms = (parseInt(b1 + b2)) * parseFloat(mult);

    // Format output
    let outputString = "";
    if (ohms >= 1000000) {
        outputString = (ohms / 1000000) + " MΩ";
    } else if (ohms >= 1000) {
        outputString = (ohms / 1000) + " kΩ";
    } else {
        outputString = ohms + " Ω";
    }

    // Update Text
    document.getElementById('resistor-output').innerHTML = `${outputString} ±${tol}%`;

    // Update Visuals (Bands)
    // Band 1 & 2
    document.getElementById('band1').style.backgroundColor = colorMap[b1];
    document.getElementById('band2').style.backgroundColor = colorMap[b2];

    // Multiplier Band
    document.getElementById('band3').style.backgroundColor = multColorMap[mult];

    // Tolerance Band
    document.getElementById('band4').style.backgroundColor = tolColorMap[tol];
}

// Virtual Servo Logic
function updateServo(angle) {
    const arm = document.getElementById('robot-arm');
    const valueText = document.getElementById('servo-value');
    const codeText = document.getElementById('servo-code');

    // Rotate Arm (Mapping 0-180 degrees)
    // -90deg is full left, 90deg is full right relative to vertical center
    // User sees 0 to 180.
    // So 0 input = -90 rotation
    // 90 input = 0 rotation (straight up)
    // 180 input = 90 rotation

    // Actually, keep it simple: 0 is left horizontal, 90 vertical, 180 right horizontal
    const rotation = angle - 90;

    arm.style.transform = `rotate(${rotation}deg)`;
    valueText.textContent = `${angle}°`;
    codeText.textContent = `myservo.write(${angle});`;
}

// Logic Gate Playground Logic
let inputA = 0;
let inputB = 0;

function toggleInput(btnId) {
    const btn = document.getElementById(btnId);
    const circle = btn.querySelector('.toggle-circle');
    const valText = document.getElementById(btnId === 'btn-a' ? 'val-a' : 'val-b');

    // Toggle State
    let currentState = btn.getAttribute('data-state') === '1' ? 1 : 0;
    let newState = currentState === 1 ? 0 : 1;

    // Update UI
    btn.setAttribute('data-state', newState);
    if (newState === 1) {
        btn.style.background = 'rgba(0, 210, 255, 0.3)';
        btn.style.borderColor = 'var(--primary-color)';
        circle.style.left = '30px';
        circle.style.background = 'var(--primary-color)';
        circle.style.boxShadow = '0 0 10px var(--primary-color)';
        valText.textContent = '1';
        valText.style.color = 'var(--primary-color)';
    } else {
        btn.style.background = '#333';
        btn.style.borderColor = '#555';
        circle.style.left = '0';
        circle.style.background = '#888';
        circle.style.boxShadow = 'none';
        valText.textContent = '0';
        valText.style.color = 'var(--text-muted)';
    }

    // Update Global Vars
    if (btnId === 'btn-a') inputA = newState;
    if (btnId === 'btn-b') inputB = newState;

    updateLogic();
}

function updateLogic() {
    const gate = document.getElementById('gate-selector').value;
    const bulb = document.getElementById('logic-bulb');
    const outText = document.getElementById('val-out');
    let output = 0;

    // Truth Logic
    switch (gate) {
        case 'AND':
            output = (inputA === 1 && inputB === 1) ? 1 : 0;
            break;
        case 'OR':
            output = (inputA === 1 || inputB === 1) ? 1 : 0;
            break;
        case 'NOT':
            // NOT only uses Input A usually, let's just say NOT A
            output = (inputA === 0) ? 1 : 0;
            // Visual feedback that B is disabled? For simplicity, we just ignore B.
            break;
        case 'XOR':
            output = (inputA !== inputB) ? 1 : 0;
            break;
    }

    // Update Output UI
    if (output === 1) {
        bulb.style.background = 'radial-gradient(circle, #ffeb3b, #fbc02d)';
        bulb.style.boxShadow = '0 0 30px #ffeb3b';
        bulb.style.borderColor = '#fff';
        outText.textContent = '1';
        outText.style.color = '#ffeb3b';
    } else {
        bulb.style.background = '#333';
        bulb.style.boxShadow = '0 0 10px #000 inset';
        bulb.style.borderColor = '#444';
        outText.textContent = '0';
        outText.style.color = 'var(--text-muted)';
    }
}

// Ultrasonic Radar Logic
function updateRadar(dist) {
    const object = document.getElementById('radar-object');
    const waves = document.getElementById('radar-waves');
    const valText = document.getElementById('dist-val');
    const statusText = document.getElementById('dist-status');
    const codeBox = document.getElementById('code-logic');

    // Visual Update (Map 2-100cm to pixel positions)
    // Map 0-100 to 0-80% visual range (sensor is at left)
    const leftPos = 15 + ((dist / 100) * 75);
    object.style.left = `${leftPos}%`;
    object.style.right = 'auto'; // override default

    // Wave visual (width to object)
    waves.style.width = `${(leftPos - 15)}%`;

    valText.textContent = `${dist} cm`;

    // Logic Status
    if (dist < 15) {
        statusText.textContent = "Status: STOP!";
        statusText.style.color = "#ff0055"; // Red
        codeBox.style.borderLeftColor = "#ff0055";
        waves.style.borderRightColor = "#ff0055";
    } else if (dist < 40) {
        statusText.textContent = "Status: WARNING";
        statusText.style.color = "orange";
        codeBox.style.borderLeftColor = "orange";
        waves.style.borderRightColor = "orange";
    } else {
        statusText.textContent = "Status: SAFE";
        statusText.style.color = "#00d2ff"; // Green/Blue
        codeBox.style.borderLeftColor = "#00d2ff";
        waves.style.borderRightColor = "#00d2ff";
    }
}

// Ultrasonic Radar Logic
function updateRadar(dist) {
    const object = document.getElementById('radar-object');
    const waves = document.getElementById('radar-waves');
    const valText = document.getElementById('dist-val');
    const statusText = document.getElementById('dist-status');
    const codeBox = document.getElementById('code-logic');

    // Visual Update (Map 2-100cm to pixel positions)
    // Container width approx ~300px? Let's use % for responsive
    // Slider is RTL: 100 (Far/Left in RTL? No wait, normal RTL means Max is Left).
    // Actually simpler: Slider Value is Distance.
    // Distance 100cm = Far Right. Distance 2cm = Close to Sensor (Left).
    // So visual "right" position should key off distance.

    // Map 0-100 to 0-80% visual range (sensor is at left)
    const visualPos = (dist / 100) * 80;
    object.style.right = `${visualPos}%`; // If dist is 100 (max), it's at far right? 
    // Wait, if sensor is LEFT, and Object is moving,
    // Distance 0 = Touch Sensor (Left). Distance 100 = Far Right.
    // So 'right' style should be inverse? 
    // Let's use 'left' instead.
    // Sensor at left: 50px.
    // Object left pos = 60px + (dist/100 * available_width)

    // Let's rely on the CSS 'right' property I used in HTML.
    // Max Distance (100) -> Right: 10px
    // Min Distance (2) -> Right: 80% (Near sensor)
    // Let's invert logic for right-aligned object
    // Dist 100 = Right 10px
    // Dist 0 = Right 250px (Limit)

    // Simplified: Just use slider value directly for right % ?
    // If I drag slider to 2 (Close), visual should be near Left.
    // HTML Input is RTL... means Left is Max? 
    // Let's remove RTL on input and just handle logic.
    // Slider Left (2) = Close. Slider Right (100) = Far.

    // Position calculation
    // Max width of container ~100%. Sensor takes 60px.
    // Let's say max 'left' is 90%. Min 'left' is 15%.
    const leftPos = 15 + ((dist / 100) * 75);
    object.style.left = `${leftPos}%`;
    object.style.right = 'auto'; // override default

    // Wave visual (width to object)
    waves.style.width = `${(leftPos - 15)}%`;

    valText.textContent = `${dist} cm`;

    // Logic Status
    if (dist < 15) {
        statusText.textContent = "Status: STOP!";
        statusText.style.color = "#ff0055"; // Red
        codeBox.style.borderLeftColor = "#ff0055";
        waves.style.borderRightColor = "#ff0055";
    } else if (dist < 40) {
        statusText.textContent = "Status: WARNING";
        statusText.style.color = "orange";
        codeBox.style.borderLeftColor = "orange";
        waves.style.borderRightColor = "orange";
    } else {
        statusText.textContent = "Status: SAFE";
        statusText.style.color = "#00d2ff"; // Green/Blue
        codeBox.style.borderLeftColor = "#00d2ff";
        waves.style.borderRightColor = "#00d2ff";
    }
}

// ---------------------------------------------------------
// GENERIC DRAG & DROP ACTIVITY LOGIC
// ---------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    initAllScrambles();
});

function initAllScrambles() {
    const lists = document.querySelectorAll('.scramble-list');

    lists.forEach(list => {
        // 1. Shuffle children (visually only)
        const items = Array.from(list.children);
        const shuffled = items.sort(() => Math.random() - 0.5);

        list.innerHTML = '';
        shuffled.forEach(item => {
            list.appendChild(item);
            setupDragEvents(item);
        });

        // 2. Allow Dropping on List
        list.addEventListener('dragover', e => {
            e.preventDefault(); // Necessary to allow dropping
            const afterElement = getDragAfterElement(list, e.clientY);
            const draggable = document.querySelector('.dragging');
            if (!draggable) return;

            if (afterElement == null) {
                list.appendChild(draggable);
            } else {
                list.insertBefore(draggable, afterElement);
            }
        });
    });
}

function setupDragEvents(item) {
    item.addEventListener('dragstart', () => {
        item.classList.add('dragging');
    });

    item.addEventListener('dragend', () => {
        item.classList.remove('dragging');
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.draggable-item:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Check Logic - Triggered by button
function checkScramble(btn) {
    // Navigate to the container (parent of the button)
    const container = btn.parentElement;
    const list = container.querySelector('.scramble-list');
    const feedback = container.querySelector('.scramble-feedback');

    if (!list || !feedback) {
        console.error("Structure Error: checkScramble button must be inside .code-scramble-container");
        return;
    }

    const items = list.querySelectorAll('.draggable-item');
    let isCorrect = true;

    items.forEach((item, index) => {
        const correctIndex = parseInt(item.getAttribute('data-index'));

        // Check if item is in the position matching its data-index
        if (correctIndex !== index) {
            isCorrect = false;
            item.style.borderLeftColor = '#ff0055'; // Red hint
            item.style.background = 'rgba(255, 0, 85, 0.1)';
        } else {
            item.style.borderLeftColor = '#00d2ff'; // Green hint
            item.style.background = 'rgba(0, 210, 255, 0.1)';
        }
    });

    if (isCorrect) {
        feedback.textContent = "✅ System Online! Logic Compiled Successfully.";
        feedback.style.color = "#00d2ff";
        feedback.classList.add("success-pulse");
    } else {
        feedback.textContent = "❌ Logic Error! Sequence incorrect.";
        feedback.style.color = "#ff0055";
        feedback.classList.remove("success-pulse");
    }
}
