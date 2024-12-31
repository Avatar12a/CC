// Schakel alleen zichtbare opties in of uit op basis van geselecteerde motor
function updateSwitchOptions() {
    const motorType = document.getElementById('motor-type').value;
    const switchType = document.getElementById('switch-type');
    const motorTypeElement = document.getElementById('motor-type');
    const options = Array.from(switchType.querySelectorAll('option'));

    // Reset alle opties
    options.forEach(option => option.classList.remove('hidden'));

    let allowedSwitches = [];

    if (motorType === "somfy-draadloos-rts") {
        allowedSwitches = [
            "geen",
            "situo-rts-1kanaal",
            "situo-rts-5kanaals",
            "smoove-origin-rts-1"
        ];
    } else if (motorType === "somfy-draadloos-io") {
        allowedSwitches = [
            "geen",
            "situo-1-pure-io",
            "situo-5-pure-io",
            "smoove-origin-1-io"
        ];
    } else if (motorType === "somfy-solar-rts") {
        allowedSwitches = [
            "geen",
            "situo-rts-1kanaal",
            "situo-rts-5kanaals",
            "smoove-origin-rts-1"
        ];
    } else if (motorType === "somfy-solar-io") {
        allowedSwitches = [
            "geen",
            "situo-1-pure-io",
            "situo-5-pure-io",
            "smoove-origin-1-io"
        ];
    } else if (motorType === "somfy-ilmo") {
        allowedSwitches = [
            "geen",
            "opbouw-draaischakelaar",
            "inbouw-draaischakelaar"
        ];
    } else if (motorType === "huismerk") {
        allowedSwitches = [
            "geen",
            "opbouw-draaischakelaar",
            "inbouw-draaischakelaar"
        ];
    } else if (motorType === "huismerk-afstandbediening" || motorType === "huismerk-zonne-energie") {
        allowedSwitches = [
            "geen",
            "huismerk-afstandbediening-1kanaal",
            "huismerk-afstandbediening-5kanaals",
            "draadloze-muurschakelaar-1kanaal"
        ];
    } else if (motorType === "bandbediening") {
        allowedSwitches = ["geen"];
    }

    // Filter opties
    options.forEach(option => {
        if (!allowedSwitches.includes(option.value)) {
            option.classList.add('hidden');
        }
    });

    // Reset schakelaar naar "geen"
    switchType.value = "geen";

    // Controleer en pas breedte aan als nodig
    const widthInput = document.getElementById('width');
    const minWidth = motorType === "huismerk-zonne-energie" || motorType === "somfy-solar-rts" || motorType === "somfy-solar-io" ? 80 : 60;
    const maxWidth = motorType === "bandbediening" ? 320 : null;
    if (parseFloat(widthInput.value) < minWidth) {
        widthInput.value = minWidth;
        showAdjustmentMessage(motorTypeElement, `De breedte is aangepast naar ${minWidth} cm om te voldoen aan de minimale vereisten.`);
    } else if (maxWidth && parseFloat(widthInput.value) > maxWidth) {
        widthInput.value = maxWidth;
        showAdjustmentMessage(motorTypeElement, `De breedte is aangepast naar ${maxWidth} cm om te voldoen aan de maximale vereisten.`);
    }
}

// Voeg CSS toe om verborgen opties te verbergen
// Voeg dit toe aan je CSS-bestand of style-tag:
// .hidden {
//     display: none;
// }

// Stel standaardmotor in en filter opties bij laden van de pagina
function initializeForm() {
    const motorTypeDropdown = document.getElementById('motor-type');
    motorTypeDropdown.value = "huismerk"; // Standaard instellen op huismerk
    updateSwitchOptions(); // Direct schakelaars filteren
}

// Toon een melding boven een specifiek element
function showAdjustmentMessage(referenceElement, message) {
    let messageElement = referenceElement.previousElementSibling;
    if (!messageElement || !messageElement.classList.contains('adjustment-message')) {
        messageElement = document.createElement('div');
        messageElement.className = 'adjustment-message';
        messageElement.style.color = 'red';
        messageElement.style.fontSize = '0.9em';
        messageElement.style.marginBottom = '5px';
        referenceElement.parentNode.insertBefore(messageElement, referenceElement);
    }
    messageElement.textContent = message;

    // Verwijder de melding na een paar seconden
    setTimeout(() => {
        if (messageElement) {
            messageElement.remove();
        }
    }, 5000);
}

// Validatie voor invoer
function validateInput(input) {
    const motorType = document.getElementById('motor-type').value;
    const min = motorType === "huismerk-zonne-energie" || motorType === "somfy-solar-rts" || motorType === "somfy-solar-io" ? 80 : 60;
    const max = motorType === "bandbediening" ? 320 : parseFloat(input.max);
    let value = parseFloat(input.value);

    if (value < min) {
        input.value = min; // Stel in op minimum als waarde te laag is
        showAdjustmentMessage(input, `De waarde is aangepast naar ${min} omdat dit de minimale toegestane waarde is.`);
    } else if (value > max) {
        input.value = max; // Stel in op maximum als waarde te hoog is
        showAdjustmentMessage(input, `De waarde is aangepast naar ${max} omdat dit de maximale toegestane waarde is.`);
    }

    calculatePrice(); // Direct de prijs updaten na validatie
}

// Eventlistener toevoegen aan motor-type dropdown
document.getElementById('motor-type').addEventListener('change', updateSwitchOptions);

// Roep de standaardinstellingen aan bij laden van de pagina
window.addEventListener('load', initializeForm);

// Update kasthoogte
function updateCasingHeight(height) {
    const casingHeightInput = document.getElementById('casing-height');

    // Controleer of hoogte geldig is
    if (!height || height < 25 || height > 330) {
        casingHeightInput.value = ''; // Laat leeg als de invoer ongeldig is
        return;
    }

    // Bepaal de kasthoogte op basis van de ingevoerde hoogte
    if (height <= 141) {
        casingHeightInput.value = 13.7;
    } else if (height <= 224) {
        casingHeightInput.value = 16.5;
    } else if (height <= 310) {
        casingHeightInput.value = 18.0;
    } else {
        casingHeightInput.value = 20.5;
    }
}

// Update geleiderhoogte
function updateGuideHeight(height) {
    const casingHeight = parseFloat(document.getElementById('casing-height').value) || 0;
    const guideHeightInput = document.getElementById('guide-height');

    // Controleer of hoogte en kasthoogte geldig zijn
    if (!height || height < 25 || height > 330 || casingHeight === 0) {
        guideHeightInput.value = ''; // Laat leeg als de invoer ongeldig is
        return;
    }

    // Bereken de geleiderhoogte
    const guideHeight = height - casingHeight;
    guideHeightInput.value = guideHeight > 0 ? guideHeight.toFixed(1) : ''; // Zorg dat negatieve waardes leeg blijven
}

// Reset standaardwaarden
function clearInitialValues() {
    document.getElementById('casing-height').value = '';
    document.getElementById('guide-height').value = '';
    const errorMessage = document.getElementById('error-message');
    errorMessage.classList.add('hidden'); // Verberg standaard de melding
    const successMessage = document.getElementById('success-message');
    successMessage.classList.add('hidden'); // Verberg standaard de succesmelding
    const inputErrorMessage = document.getElementById('input-error-message');
    inputErrorMessage.classList.add('hidden');

    const cartItems = document.getElementById('cart-items');
    if (cartItems) cartItems.innerHTML = ''; // Reset de winkelwagen

    document.getElementById('price').innerText = 'Totaalprijs: €0.00';
    document.getElementById('total-price').innerText = 'Totaal: €0.00';
}

// Prijs berekenen
function calculatePrice() {
    const width = parseFloat(document.getElementById('width').value) || 0;
    const height = parseFloat(document.getElementById('height').value) || 0;
    const errorMessage = document.getElementById('error-message');

    // Verberg eerdere meldingen
    errorMessage.classList.add('hidden');

    // Controleer of breedte en hoogte binnen limieten vallen
    const motorType = document.getElementById('motor-type').value;
    const area = (width / 100) * (height / 100);
    const maxArea = motorType === "bandbediening" ? 7 : 9;

    if (width + height > 600 || area > maxArea) {
        errorMessage.innerText = `Het totale oppervlak mag niet groter zijn dan ${maxArea}m². Pas de afmetingen aan.`;
        errorMessage.classList.remove('hidden');
        return false; // Stop als limieten worden overschreden
    }

    // Update kasthoogte en zijgeleiderhoogte
    updateCasingHeight(height);
    updateGuideHeight(height);

    // Bereken prijs
    const basePrice = area * 67;

    // Extra kosten
    const switchType = document.getElementById('switch-type').value;
    const falseWindowsill = document.getElementById('false-windowsill').value;
    const installation = document.getElementById('installation').value;

    const motorPrices = {
        "standaard": 84.27,
        "huismerk-afstandbediening": 119.27,
        "huismerk-zonne-energie": 104.58,
        "somfy-ilmo": 94.18,
        "somfy-draadloos-rts": 124.05,
        "somfy-draadloos-io": 124.05,
        "somfy-solar-rts": 400.00,
        "somfy-solar-io": 400.00,
        "bandbediening": 0.00
    };

    const switchPrices = {
        "geen": 0.00,
        "opbouw-draaischakelaar": 15.00,
        "inbouw-draaischakelaar": 15.00,
        "huismerk-afstandbediening-1kanaal": 31.00,
        "huismerk-afstandbediening-5kanaals": 46.00,
        "draadloze-muurschakelaar-1kanaal": 31.00,
        "situo-1-pure-io": 58.75,
        "situo-5-pure-io": 75.00,
        "situo-rts-1kanaal": 46.79,
        "situo-rts-5kanaals": 58.75,
        "smoove-origin-1-io": 58.75,
        "smoove-origin-rts-1": 46.79
    };

    const motorPrice = motorPrices[motorType] || 0;
    const switchPrice = switchPrices[switchType] || 0;
    const falseWindowsillPrice = falseWindowsill !== 'geen' ? 25 : 0;
    const installationPrice = installation === 'met' ? 250 : 0;

    const totalPrice = basePrice + motorPrice + switchPrice + falseWindowsillPrice + installationPrice;

    // Toon de prijs
    document.getElementById('price').innerText = `Totaalprijs: €${totalPrice.toFixed(2)}`;
    return totalPrice;
}

const cart = [];

// Product toevoegen aan winkelwagen
function addToCart() {
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    const width = parseFloat(widthInput.value) || 0;
    const height = parseFloat(heightInput.value) || 0;

    const motorType = document.getElementById('motor-type').value;
    const switchType = document.getElementById('switch-type').value;
    const falseWindowsill = document.getElementById('false-windowsill').value;
    const installation = document.getElementById('installation').value;
    const operationSide = document.getElementById('operation-side').value;
    const casingColor = document.getElementById('casing-color').value;
    const guideColor = document.getElementById('guide-color').value;
    const slatColor = document.getElementById('slat-color').value;
    const casingType = document.getElementById('casing-type').value;
    const guideType = document.getElementById('guide-type').value;

    const inputErrorMessage = document.getElementById('input-error-message');
    const successMessage = document.getElementById('success-message');

    // Reset foutmeldingen en stijlen
    inputErrorMessage.classList.add('hidden');

    // Controleer invoer
    if (!width || !height) {
        inputErrorMessage.innerText = "Voer zowel breedte als hoogte in.";
        inputErrorMessage.classList.remove('hidden');
        setTimeout(() => {
            inputErrorMessage.classList.add('hidden');
        }, 3000); // Houd de melding 3 seconden zichtbaar
        return;
    }

    // Bereken prijs
    const price = calculatePrice();
    if (!price) return;

    const formattedMotorType = motorType
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    const item = {
        name: `Aluprof Rolluik (${formattedMotorType})`,
        width,
        height,
        motorType,
        switchType,
        falseWindowsill,
        installation,
        operationSide,
        casingColor,
        guideColor,
        slatColor,
        casingType,
        guideType,
        price: price.toFixed(2),
        quantity: 1
    };

    const existingItemIndex = cart.findIndex(cartItem => {
        return cartItem.width === item.width &&
            cartItem.height === item.height &&
            cartItem.motorType === item.motorType &&
            cartItem.switchType === item.switchType &&
            cartItem.falseWindowsill === item.falseWindowsill &&
            cartItem.installation === item.installation &&
            cartItem.operationSide === item.operationSide &&
            cartItem.casingColor === item.casingColor &&
            cartItem.guideColor === item.guideColor &&
            cartItem.slatColor === item.slatColor &&
            cartItem.casingType === item.casingType &&
            cartItem.guideType === item.guideType;
    });

    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity++;
    } else {
        cart.push(item);
    }

    updateCart();

    // Toon succesmelding
    successMessage.innerText = "Succesvol toegevoegd aan winkelwagen!";
    successMessage.classList.remove('hidden');
    setTimeout(() => successMessage.classList.add('hidden'), 3000);
}

// Winkelwagen updaten
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    if (!cartItems) {
        console.error("Winkelwagencontainer niet gevonden!");
        return;
    }

    cartItems.innerHTML = ''; // Reset inhoud
    let total = 0;

    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-details">
                <span class="cart-item-title">${item.name}</span>
                <span class="cart-item-specs">Breedte: ${item.width} cm, Hoogte: ${item.height} cm</span>
                <span class="cart-item-price">Prijs: €${(item.price * item.quantity).toFixed(2)}</span>
                <div class="quantity-controls">
                    <button onclick="decrementItem(${index})">-</button>
                    <input class="cart-quantity" type="text" value="${item.quantity}" readonly>
                    <button onclick="incrementItem(${index})">+</button>
                </div>
            </div>
            <button class="remove-item delete-btn" onclick="removeItem(${index})">&#10005;</button>
        `;
        cartItems.appendChild(cartItem);
        total += item.price * item.quantity;
    });

    document.getElementById('total-price').innerText = `Totaal: €${total.toFixed(2)}`;
}

// Item verwijderen
function removeItem(index) {
    cart.splice(index, 1);
    updateCart();
}

// Hoeveelheid verhogen
function incrementItem(index) {
    cart[index].quantity++;
    updateCart();
}

// Hoeveelheid verlagen
function decrementItem(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
    } else {
        removeItem(index);
    }
    updateCart();
}

// Eventlisteners voor directe prijsupdate
const inputsToUpdatePrice = [
    'width', 'height', 'motor-type', 'switch-type', 'false-windowsill', 'installation', 'operation-side', 'casing-color', 'guide-color', 'slat-color', 'casing-type', 'guide-type'
];

inputsToUpdatePrice.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
        element.addEventListener('input', () => {
            calculatePrice();
            if (id === 'width' || id === 'height') {
                element.style.borderColor = ''; // Reset rode rand bij invoer
            }
        });
    }
});
