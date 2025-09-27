const dough = document.getElementById('dough');
const rollingPin = document.getElementById('rolling-pin');
const doughInner = document.getElementById('dough-inner')
const clickMe = document.getElementById('clickMe')
const board = document.getElementById('board')
const gameContainer = document.getElementById('game-container')

import Ingredient from "./modules/Ingredient.js";
import Pizza from "./modules/Pizza.js";

let sauceApllied = false
let isRolling = false
let targetDoughSize = 400;
let doughInnerSize = 350
let dragX, dragY
let handleMouseMove
let originalFilter = rollingPin.style.filter
let originalLeft = rollingPin.style.left
let originalTop = rollingPin.style.top

rollingPin.addEventListener('mousedown', rollerDragStart);

function rollerDragStart(e) {
    const rect = rollingPin.getBoundingClientRect()
    dragX = e.clientX - rect.left; 
    dragY = e.clientY - rect.top;
    rollingPin.style.zIndex = '1000'; 
    rollingPin.style.cursor = 'grabbing'; 
    rollingPin.style.filter = 'drop-shadow(10px 10px 10px rgba(0, 0, 0, 0.5))'
    e.preventDefault();
    window.addEventListener('mousemove', rollerDrag); 
    window.addEventListener('mouseup', dragEnd); 
}

function rollerDrag(e) {
    e.preventDefault();
    const newX = e.clientX - dragX; 
    const newY = e.clientY - dragY; 
    rollingPin.style.left = newX + 'px'; 
    rollingPin.style.top = newY + 'px';
    dough.addEventListener('mouseover', rollDough)
}

function dragEnd(e) {
    e.preventDefault();
    rollingPin.style.cursor = 'grab';
    rollingPin.style.left = originalLeft
    rollingPin.style.top = originalTop
    rollingPin.style.filter = originalFilter
    window.removeEventListener('mousemove', rollerDrag); 
    window.removeEventListener('mouseup', dragEnd);
    dough.removeEventListener('mouseover', rollDough)
    if (isRolling) {
        rollingPinAway()
    }
}

function rollDough() {
    rollingPin.style.filter = 'none'
    dough.style.width = targetDoughSize + 'px'
    dough.style.height = targetDoughSize + 'px'
    isRolling = true
    setTimeout(doughInnerMake, 500)
}

function doughInnerMake() {
    if (isRolling) {
        doughInner.style.left = '25px'
        doughInner.style.top = '25px'
        doughInner.style.width = doughInnerSize + 'px'
        doughInner.style.height = doughInnerSize + 'px'
        doughInner.style.filter = 'drop-shadow(1px 2px 20px rgba(255, 255, 255, 0.77))'
    }
}

const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
const textPickMe = "Нажми на меня!"
let sauceCount = 0
const sauceThreshold = 100
let sauceQuestionShown = false

function rollingPinAway() {
   rollingPin.classList.add('rolling-pin-away')
   setTimeout(() => {
    clickMe.style.display = 'block'
    svg.setAttribute('id', 'svgClickMe')
    svg.setAttribute('width', 200)
    svg.setAttribute('height', 200)
    svg.setAttribute('viewBox', `0 0 200 200`)
    clickMe.appendChild(svg)
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect.setAttribute('id', 'rectSauceSvg')
    rect.setAttribute('x', 90)
    rect.setAttribute('y', 10)
    rect.setAttribute('width', 110)
    rect.setAttribute('height', 70)
    rect.setAttribute('fill', '#fcf5bf')
    rect.setAttribute('rx', 10)
    rect.setAttribute('ry', 10)
    svg.appendChild(rect)
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute('d', 'M 190 0 l -10 10 h 10 Z')   
    path.setAttribute('fill', '#fcf5bf')
    svg.appendChild(path)
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    text.setAttribute('id', 'sauceSpeak')
    text.setAttribute('x', 95)
    text.setAttribute('y', 50)
    text.setAttribute('font-size', 14)
    text.setAttribute('fill', 'black')
    text.setAttribute('font-family', 'Marker Felt, fantasy')
    text.setAttribute('width', 10)
    svg.appendChild(text)
    let i = 0;
    const interval = setInterval(() => {
        text.textContent += textPickMe[i]
        i++
        if (i >= textPickMe.length) {
        clearInterval(interval)
        }
    }, 100)
   }, 1000)
}

clickMe.addEventListener('click', () => {
    document.body.classList.add('brush-cursor')
    clickMe.style.cursor = "url('images/cursor.png') 5 10, auto"
    dough.addEventListener('mouseover', applySauce)
})


function applySauce() {
    if (!sauceApllied) {
        dough.classList.add('rotating-cursor')
        handleMouseMove = (e) => {
            const oldText = document.getElementById('sauceSpeak')
            if (oldText) {
                oldText.style.display = 'none'
            }
            const rect = dough.getBoundingClientRect()
            const x = e.clientX - rect.left - 50
            const y = e.clientY - rect.top -20
            
            const sauce = document.createElement('div')
            sauce.classList.add('sauce')
            sauce.style.left = `${x}px`
            sauce.style.top = `${y}px`
            doughInner.appendChild(sauce)  
            if (!sauceQuestionShown) {
                showSauceQuestion()
                sauceQuestionShown = true
                sauceApllied = true
            }
        }
        dough.addEventListener('mousemove', handleMouseMove)

    }
}

function showSauceQuestion() {
    const oldRect = document.getElementById('rectSauceSvg')
    oldRect.setAttribute('x', 0)
    oldRect.setAttribute('y', 10)
    oldRect.setAttribute('width', 200)
    oldRect.setAttribute('height', 100)
    oldRect.setAttribute('fill', '#fcf5bf')
    oldRect.setAttribute('rx', 10)
    oldRect.setAttribute('ry', 10)
    oldRect.setAttribute('cursor', 'default')
    
    const questionText = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    questionText.setAttribute('id', 'sauceQuestion');
    questionText.setAttribute('x', 5);
    questionText.setAttribute('y', 40);
    questionText.setAttribute('font-size', 14);
    questionText.setAttribute('fill', 'black');
    questionText.setAttribute('cursor', 'default')
    questionText.setAttribute('font-family', 'Marker Felt, fantasy');
    const text = 'Вы нанесли достаточно соуса?'
    svg.appendChild(questionText);
    questionText.style.display = 'block'
    let i = 0;
    const interval = setInterval(() => {
        questionText.textContent += text[i]
        i++
        if (i >= text.length) {
        clearInterval(interval)
        }
    }, 100)

    const yesButton = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    yesButton.setAttribute('id', 'yesButton');
    yesButton.setAttribute('x', 70);
    yesButton.setAttribute('y', 60);
    yesButton.setAttribute('width', 60);
    yesButton.setAttribute('height', 30);
    yesButton.setAttribute('fill', '#cca21aff');
    yesButton.setAttribute('rx', 5);
    yesButton.setAttribute('ry', 5);
    yesButton.setAttribute('cursor', 'pointer')
    yesButton.addEventListener('mouseover', function() {this.setAttribute('fill', '#ffc559')})
    yesButton.addEventListener('mouseleave', function() {this.setAttribute('fill', '#cca21aff')})
    svg.appendChild(yesButton);

    const buttonText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    buttonText.setAttribute('id', 'buttonText')
    buttonText.setAttribute('x', 90);
    buttonText.setAttribute('y', 80);
    buttonText.setAttribute('font-size', 14);
    buttonText.setAttribute('fill', 'black');
    buttonText.setAttribute('font-family', 'Marker Felt, fantasy');
    buttonText.setAttribute('cursor', 'pointer')
    buttonText.addEventListener('mouseover', function() {yesButton.setAttribute('fill', '#ffc559')})
    buttonText.addEventListener('mouseleave', function() {yesButton.setAttribute('fill', '#cca21aff')})
    buttonText.textContent = 'Да';
    svg.appendChild(buttonText);
    yesButton.style.display = 'block'
    yesButton.addEventListener('click', function() { yesButton.style.filter = 'none'; dough.removeEventListener('mouseover', applySauce); dough.removeEventListener('mousemove', handleMouseMove); showMenu()})
}

const ingredientsMenu = document.getElementById('ingredients-menu')
function showMenu() {
    svg.remove()
    clickMe.style.display = 'none'
    document.body.style.cursor = 'default'
    dough.style.cursor = 'default'
    ingredientsMenu.classList.add('visible')
    renderIngredientsMenu()  
    showInfoPaper()
}

let pizza = new Pizza(doughInner)
let draggableElementInfo = null
const allIngredientMenuItems = document.querySelectorAll('.ingredient-item')
let dragIngredientX
let dragIngredientY
const ingredientsData = {
        сыр: new Ingredient('сыр','images/сырная стружка.png', 'images/сыр.png'),
        пепперони: new Ingredient('пепперони', 'images/пепперони1.png', 'images/пепперони.png'),
        ветчина: new Ingredient('ветчина', 'images/ветчина1.png', 'images/ветчина.png'),
        оливки: new Ingredient('оливки', 'images/оливки1.png', 'images/оливки.png'),
        грибы: new Ingredient('грибы', 'images/гриб1.png', 'images/грибы.png'),
        помидор: new Ingredient('помидор', 'images/помидор1.png', 'images/помидор.png'),
        халапеньо: new Ingredient('халапеньо', 'images/халапеньо1.png', 'images/халапеньо.png'),
        огурец: new Ingredient('огурец', 'images/огурец1.png', 'images/огурец.png'),
        ананас: new Ingredient('ананас', 'images/ананас1.png', 'images/ананас.png'),
        лук: new Ingredient('лук', 'images/лук1.png', 'images/лук.png'),
        перец: new Ingredient('перец', 'images/перец1.png', 'images/перец.png'),
        базилик: new Ingredient('базилик', 'images/базилик1.png', 'images/базилик.png')
    }
function renderIngredientsMenu() {
    const ingredientMenuItemsArray = Array.from(allIngredientMenuItems);
    console.log(`Найдено ${ingredientMenuItemsArray.length} элементов в меню при рендеринге.`)
    ingredientMenuItemsArray.forEach(item => {
        const ingredientName = item.dataset.ingredient
        const ingredient = ingredientsData[ingredientName]
        if (!ingredient) {
            console.warm(`Ингредиент "${ingredientName}" найден в меню, но отсутствует в ingredientData.`)
            return
        }
        item.addEventListener('click', () => {
            if (ingredient) {
                const ingredientImageElement = pizza.addIngredient(ingredient)
                if (ingredientImageElement) {
                    ingredientImageElement.onload = () => {
                    const ingredientWidth = ingredientImageElement.offsetWidth
                    const ingredientHeight = ingredientImageElement.offsetHeight
                    console.log(`Ширина ${ingredientName}: ${ingredientWidth}, Высота ${ingredientName}: ${ingredientHeight}`)
                    const randomAngle = Math.floor(Math.random() * 225)- 45
                    const centerX = (doughInnerSize - ingredientWidth) / 2
                    const centerY = (doughInnerSize - ingredientHeight) / 2
                    ingredientImageElement.style.left = `${centerX}px`;
                    ingredientImageElement.style.top = `${centerY}px`;
                    ingredientImageElement.style.transform = `rotate(${randomAngle}deg)`
                    ingredientImageElement.style.visibility = 'visible'
                    console.log('Картинка видна на пицце')
                    setupIngredientDrag(ingredientImageElement, ingredientName)
                }
                ingredientImageElement.onerror = () => {
                    console.error(`Не удалось загрузить изображение :${selectedIngredientData.imageSrc}`)
                    ingredientImageElement.remove()
                }
 
            }
        }
    })
})
}
function setupIngredientDrag(ingredientImageElement, ingredientName) {
    ingredientImageElement.addEventListener('mousedown', (e) => {
        e.preventDefault()
        ingredientImageElement.parentElement.appendChild(ingredientImageElement)
        const rect = ingredientImageElement.getBoundingClientRect()
        dragIngredientX = e.clientX - rect.left
        dragIngredientY = e.clientY - rect.top
        const offset = {x: dragIngredientX, y: dragIngredientY}
        console.log(`e.client:(${e.clientX}, ${e.clientY}) rect: (${rect.left}, ${rect.top}), dragIngredient: ${dragIngredientX},${dragIngredientY}`)
        ingredientImageElement.style.cursor = 'grabbing'
        ingredientImageElement.style.zIndex = '100'
        draggableElementInfo = {element: ingredientImageElement, offset: offset,  ingredientName: ingredientName}
    })
}
document.addEventListener('keydown', (event) => {
    if (!draggableElementInfo) return
    const {element} = draggableElementInfo
    if (event.key === 'Delete' && element) {
        event.preventDefault()
        pizza.removeIngredient(element)
        console.log(`Ингредиент удален ${JSON.stringify(pizza.pizzaIngredients, null, 2)}`)
    }
})
document.addEventListener('mousemove', dragIngredient)
document.addEventListener('mouseup', dragIngredientEnd)

function dragIngredient(e) {
    if (!draggableElementInfo) return
    e.preventDefault()
    const {element} = draggableElementInfo
    const doughInnerRect = doughInner.getBoundingClientRect()
    const ingredientWidth = element.offsetWidth
    const ingredientHeight = element.offsetHeight
    const centerPizza = doughInnerSize/2
    const radius = doughInnerSize/2
    const edgeOffset = 10
    const ingredientMaxOffsetRadius = Math.sqrt((ingredientWidth / 2)**2 + (ingredientHeight / 2)**2)
    const effectiveRadiusForCenter = radius + edgeOffset - ingredientMaxOffsetRadius
    const mouseX_relativeToDoughInner = e.clientX- doughInnerRect.left
    const mouseY_relativeToDoughInner = e.clientY - doughInnerRect.top
    let potentialNewX = mouseX_relativeToDoughInner - dragIngredientX
    let potentialNewY = mouseY_relativeToDoughInner - dragIngredientY
    const ingredientCenterX_relativeToDoughInner = potentialNewX + ingredientWidth / 2;
    const ingredientCenterY_relativeToDoughInner = potentialNewY + ingredientHeight / 2
    const distanceToCenter = Math.sqrt(
        (ingredientCenterX_relativeToDoughInner - centerPizza) ** 2 +
        (ingredientCenterY_relativeToDoughInner - centerPizza) ** 2
    )
    let finalNewX = potentialNewX
    let finalNewY = potentialNewY
    if (distanceToCenter > Math.max(0, effectiveRadiusForCenter)) {
        const angle = Math.atan2(
            ingredientCenterY_relativeToDoughInner - centerPizza,
            ingredientCenterX_relativeToDoughInner - centerPizza
        );
        const clampedCenterX_relativeToDoughInner = centerPizza + Math.max(0, effectiveRadiusForCenter) * Math.cos(angle);
        const clampedCenterY_relativeToDoughInner = centerPizza + Math.max(0, effectiveRadiusForCenter) * Math.sin(angle)
        finalNewX = clampedCenterX_relativeToDoughInner - ingredientWidth / 2;
        finalNewY = clampedCenterY_relativeToDoughInner - ingredientHeight / 2
    } else {
        finalNewX = potentialNewX;
        finalNewY = potentialNewY;
    }
    if (finalNewX < 0) finalNewX = 0
    if (finalNewY < 0) finalNewY = 0
    if (finalNewX + ingredientWidth > doughInnerSize) finalNewX = doughInnerSize - ingredientWidth
    if (finalNewY + ingredientHeight > doughInnerSize) finalNewY = doughInnerSize - ingredientHeight
    
    element.style.left = finalNewX + 'px'; 
    element.style.top = finalNewY + 'px';
}

function dragIngredientEnd(e) {
    e.preventDefault()
    if (draggableElementInfo) {
        const {element} = draggableElementInfo
        element.style.cursor = 'grab'
        doughInner.style.cursor = 'default'
        element.style.zIndex = '2'
        draggableElementInfo = null
    }
}

function showInfoPaper() {
    const paperInfo = document.createElement('div')
    paperInfo.id = 'paper-info'
    gameContainer.appendChild(paperInfo)
    const textContainer = document.createElement('p')
    textContainer.id = 'text-info'
    const text = `Добавить ингредиент: Кликните на него в меню. Удалить ингредиент: Удерживайте его левой кнопкой мыши и нажмите Delete.`
    paperInfo.appendChild(textContainer)
    let i = 0;
        const interval = setInterval(() => {
            textContainer.textContent += text[i]
            i++
             if (i >= text.length) {
            clearInterval(interval)
            }
        }, 60)
     startAnimation('idle', 1500)
    
}

const canvasButton = document.getElementById('buttonBake')
const ctx = canvasButton.getContext('2d')
const buttonWidth = 120
const buttonHeight = 170

const colors = {
    idleBase: '#A52A2A', 
    idleMiddle: '#CD853F',  
    idleInner: '#D2B48C',   
    idleWhite: '#FFFFFF',

    burningBase: '#FF4500',
    burningMiddle: '#FFA500', 
    burningInner: '#FFD700', 
    burningWhite: '#FFFACD',

    idleBaseBright: '#ff4400ff', 
    idleMiddleBright: '#ffb01dff', 
    idleInnerBright: '#ffff00ff',
}

let animationState = {
    currentType: 'idle', 
    startTime: 0,
    duration: 1500,
    isAnimating: false,
    animationFrameId: null,
    progress: 0,
    scale: 1, 
    offsetX: 0, offsetY: 0
}
const hexToRgb = hex => ({
    r: parseInt(hex.substring(1, 3), 16),
    g: parseInt(hex.substring(3, 5), 16),
    b: parseInt(hex.substring(5, 7), 16)
})
const lerp = (a, b, t) => a + t * (b - a);
const interpColor = (hex1, hex2, t) => {
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);
    return `rgb(${lerp(rgb1.r, rgb2.r, t)}, ${lerp(rgb1.g, rgb2.g, t)}, ${lerp(rgb1.b, rgb2.b, t)})`;
}

function drawBaseLayer(ctx, color, scale, shadowBlur) {
    ctx.save()
    ctx.translate(buttonWidth/2, buttonHeight/2)
    ctx.scale(scale, scale)
    ctx.translate(-buttonWidth/2, -buttonHeight/2)

    ctx.fillStyle = color
    ctx.shadowBlur = shadowBlur
    ctx.shadowColor = 'rgba(255, 165, 0, 0.5)'
    ctx.beginPath()
    ctx.moveTo(90, 20)
    ctx.quadraticCurveTo(40, 40, 35, 80)
    ctx.quadraticCurveTo(30, 75, 25, 65)
    ctx.quadraticCurveTo(10, 90, 15, 120)
    ctx.quadraticCurveTo(10, 120, 5, 115)
    ctx.quadraticCurveTo(8, 125, 15, 130)
    ctx.quadraticCurveTo(70, 170, 115, 130)
    ctx.quadraticCurveTo(117, 125, 120, 120)
    ctx.quadraticCurveTo(112, 125, 107, 127)
    ctx.bezierCurveTo(120, 95, 95, 90, 110, 70)
    ctx.quadraticCurveTo(97, 75, 95, 85)
    ctx.bezierCurveTo(105, 60, 75, 50, 90, 20)
    ctx.fill()

    ctx.restore()
}
function drawMiddleLayer(ctx, color, scale, shadowBlur) {
    ctx.save()
    ctx.translate(buttonWidth/2, buttonHeight/2)
    ctx.scale(scale, scale)
    ctx.translate(-buttonWidth/2, -buttonHeight/2)

    ctx.fillStyle = color
    ctx.shadowBlur = shadowBlur
    ctx.shadowColor = 'rgba(255, 165, 0, 0.5)'

    ctx.beginPath()
    ctx.moveTo(75, 40)
    ctx.quadraticCurveTo(45, 50, 37, 90)
    ctx.quadraticCurveTo(33, 90, 30, 85)
    ctx.quadraticCurveTo(20, 120, 56, 148)
    ctx.quadraticCurveTo(70, 150, 85, 146)
    ctx.bezierCurveTo(115, 125, 95, 105, 105, 90)
    ctx.quadraticCurveTo(102, 90, 96, 98)
    ctx.bezierCurveTo(96, 75, 70, 65, 75, 40)
    ctx.fill()

    ctx.restore()
}
function drawInnerLayer(ctx, color, scale, shadowBlur) {
    ctx.save()
    ctx.translate(buttonWidth/2, buttonHeight/2)
    ctx.scale(scale, scale)
    ctx.translate(-buttonWidth/2, -buttonHeight/2)

    ctx.fillStyle = color
    ctx.shadowBlur = shadowBlur
    ctx.shadowColor = 'rgba(255, 165, 0, 0.5)'

    ctx.beginPath()
    ctx.moveTo(72, 55)
    ctx.quadraticCurveTo(55, 75, 55, 103)
    ctx.quadraticCurveTo(52, 100, 48, 95)
    ctx.quadraticCurveTo(40, 125, 55, 148)
    ctx.quadraticCurveTo(70, 150, 83, 146)
    ctx.bezierCurveTo(107, 100, 60, 75, 72, 55)
    ctx.fill()

    ctx.restore()
}
function drawWhiteLayer(ctx, color, scale, shadowBlur) {
    ctx.save()
    ctx.translate(buttonWidth/2, buttonHeight/2)
    ctx.scale(scale, scale)
    ctx.translate(-buttonWidth/2, -buttonHeight/2)

    ctx.fillStyle = color
    ctx.shadowBlur = 2
    ctx.shadowColor = 'rgba(255, 255, 255, 0.7)'

    ctx.beginPath()
    ctx.moveTo(70, 83)
    ctx.quadraticCurveTo(55, 100, 60, 120)
    ctx.quadraticCurveTo(52, 120, 50, 112)
    ctx.quadraticCurveTo(40, 135, 63, 148)
    ctx.quadraticCurveTo(75, 150, 84, 146)
    ctx.bezierCurveTo(105, 115, 70, 113, 70, 83)
    ctx.fill()

    ctx.restore()
}

 function renderFrame(progress) {
    const currentTime = performance.now()
    ctx.clearRect(0, 0, buttonWidth, buttonHeight)
    let currentBaseColor, currentMiddleColor, currentInnerColor, currentWhiteColor;
    let currentScaleBase, currentScaleMiddle, currentScaleInner, currentScaleWhite;
    let currentShadowBlurBase, currentShadowBlurMiddle, currentShadowBlurInner, currentShadowBlurWhite;

    if (animationState.currentType === 'idle') {
        const flickerProgress = (currentTime - animationState.startTime) / 1000; 
        const flickerPhase = flickerProgress % 1;
        const flickerIntensity = Math.sin(flickerPhase * Math.PI * 2) * 0.5 + 0.5; 

        currentBaseColor = interpColor(colors.idleBase, colors.idleBaseBright, flickerIntensity); 
        currentMiddleColor = interpColor(colors.idleMiddle, colors.idleMiddleBright, flickerIntensity);
        currentInnerColor = interpColor(colors.idleInner, colors.idleInnerBright, flickerIntensity);
        currentWhiteColor = colors.idleWhite;

        currentScaleBase = 1 + flickerIntensity * 0.1;
        currentScaleMiddle = 1 + flickerIntensity * 0.08;
        currentScaleInner = 1 + flickerIntensity * 0.05;
        currentScaleWhite = 1

        currentShadowBlurBase = 10 + flickerIntensity * 5;
        currentShadowBlurMiddle = 5 + flickerIntensity * 3;
        currentShadowBlurInner = 2;
        currentShadowBlurWhite = 0;
    } else if (animationState.currentType === 'transition') {
        const elapsedTime = currentTime - animationState.startTime;
        const progress = Math.min(elapsedTime / animationState.duration, 1);

        currentScaleBase = 1 + progress * 0.3; 
        currentScaleMiddle = 1 + progress * 0.2;
        currentScaleInner = 1 + progress * 0.1;
        currentScaleWhite = 1 + progress * 0.05; 

        currentBaseColor = interpColor(colors.idleBase, colors.burningBase, progress);
        currentMiddleColor = interpColor(colors.idleMiddle, colors.burningMiddle, progress);
        currentInnerColor = interpColor(colors.idleInner, colors.burningInner, progress);
        currentWhiteColor = interpColor(colors.idleWhite, colors.burningWhite, progress)

        currentShadowBlurBase = 15 + progress * 10;
        currentShadowBlurMiddle = 10 + progress * 5;
        currentShadowBlurInner = 5 + progress * 2;
        currentShadowBlurWhite = 0;
    } else if (animationState.currentType === 'burning') {
        const elapsedTime = currentTime - animationState.startTime;
        const progress = Math.min(elapsedTime / animationState.duration, 1);

        currentScaleBase = 1.3; 
        currentScaleMiddle = 1.2;
        currentScaleInner = 1.1;
        currentScaleWhite = 1.05;

        currentBaseColor = colors.burningBase;
        currentMiddleColor = colors.burningMiddle;
        currentInnerColor = colors.burningInner;
        currentWhiteColor = colors.burningWhite;

        currentShadowBlurBase = 20;
        currentShadowBlurMiddle = 15;
        currentShadowBlurInner = 10;
        currentShadowBlurWhite = 2;
    }
    else {
        currentBaseColor = colors.idleBase;
        currentMiddleColor = colors.idleMiddle;
        currentInnerColor = colors.idleInner;
        currentWhiteColor = colors.idleWhite;
        currentScaleBase = 1; currentScaleMiddle = 1; currentScaleInner = 1; currentScaleWhite = 1
        currentShadowBlurBase = 0; currentShadowBlurMiddle = 0; currentShadowBlurInner = 0; currentShadowBlurWhite = 0;
    }
    ctx.save();
    ctx.translate(buttonWidth / 2, buttonHeight / 2);
    ctx.scale(currentScaleBase, currentScaleBase); 
    ctx.translate(-buttonWidth / 2, -buttonHeight / 2);

    drawBaseLayer(ctx, currentBaseColor, currentScaleBase, currentShadowBlurBase);
    drawMiddleLayer(ctx, currentMiddleColor, currentScaleMiddle, currentShadowBlurMiddle);
    drawInnerLayer(ctx, currentInnerColor, currentScaleInner, currentShadowBlurInner);
    drawWhiteLayer(ctx, currentWhiteColor, currentScaleWhite, currentShadowBlurWhite);

    ctx.restore()
 }
let animationFrameId = null 
function animate() {
    renderFrame()

    if (animationState.isAnimating) {
        if (animationState.currentType === 'idle') {
            animationFrameId = requestAnimationFrame(animate);
        }
        else {
            const currentTime = performance.now();
            const elapsedTime = currentTime - animationState.startTime;
            const progress = Math.min(elapsedTime / animationState.duration, 1);

            if (progress < 1) {
                animationFrameId = requestAnimationFrame(animate)
            } else {
                animationState.isAnimating = false;
                animationFrameId = null;
                if (animationState.currentType === 'transition') {
                    animationState.currentType = 'burning'; 
                    startAnimation('burning', 500); 
                } else if (animationState.currentType === 'burning') {
                    startAnimation('idle', 1500); 
                }
            }
        }
    }
}

 function startAnimation(type, duration) {
    animationState.currentType = type;
    animationState.duration = duration;
    animationState.startTime = performance.now();
    animationState.isAnimating = true;
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    animationFrameId = requestAnimationFrame(animate)
 }
 let canvasBake
 let patt
 let ctxBake
 
 canvasButton.addEventListener('click', () => {
    ingredientsMenu.style.display = 'none'
    const paperInfo = document.getElementById('paper-info')
    paperInfo.style.display = 'none'
    canvasButton.style.display = 'none'
    console.log('Запуск анимации перехода!') 
    const img = new Image()
    img.onload = () => {
        canvasBake = document.createElement('canvas')
        canvasBake.id = 'canvas-bake'
        canvasBake.width = 400
        canvasBake.height = 580
        ctxBake = canvasBake.getContext('2d')
        document.body.appendChild(canvasBake)
        patt = ctxBake.createPattern(img, 'repeat')
        startBakeAnimation(3000)
    }
    img.src = 'images/печь.png'
    dough.style.animation = 'movePizza 3s ease-in-out forwards'
    setTimeout(pizzaBaked, 4000)
})
let glow = {
    color: 'rgba(255, 119, 0, 0.34)',
    x: 0,
    y: 0, 
    minRadius: 30,
    maxRadius: 70,
    minOpacity: 0.6,
    maxOpacity: 0.9,
    shadowColorStart: 'rgba(200, 0, 0, 1)',
    shadowColorEnd: 'rgba(255, 102, 0, 1)',
    animationStartTime: 0,
    animationDuration: 1500,
    shadowBlurMin: 10, 
    shadowBlurMax: 50,
}
let bakeAnimationState = {
    currentType: 'active',
    startTime: 0,
    duration: 3000,
    isAnimating: false,
    animationFrameId: null,
}
const lerpBake = (a, b, t) => a + t * (b - a)
function parseRgba(rgbaString) {
    const match = rgbaString.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/);
    if (match) {
        const r = parseInt(match[1]);
        const g = parseInt(match[2]);
        const b = parseInt(match[3]);
        const a = match[4] !== undefined ? parseFloat(match[4]) : 1;
        return [r, g, b, a];
    }
    return null
}

function drawPulsatingGlow(ctx, glowColor, shadowColor, shadowBlur, opacity) {
    if (opacity <= 0) return;
    ctx.save()
    ctx.globalAlpha = opacity
    ctx.shadowColor = shadowColor
    ctx.shadowBlur = shadowBlur
    ctx.fillStyle = glowColor
    ctx.beginPath()
    ctx.moveTo(40, 140)
    ctx.quadraticCurveTo(10, 290, 42, 440)
    ctx.quadraticCurveTo(60, 290, 40, 140)
    ctx.fill()
    ctx.restore()
    
}
function drawOvenShape(ctx, patt) {
    ctx.fillStyle = patt
    ctx.beginPath()
    ctx.moveTo(20, 65)
    ctx.quadraticCurveTo(70, 20, 140, 0)
    ctx.lineTo(400, 0)
    ctx.lineTo(400, 580)
    ctx.lineTo(140, 580)
    ctx.quadraticCurveTo(70, 560, 20, 520)
    ctx.bezierCurveTo(60, 460, 60, 145, 20, 65)
    ctx.fill()
}

let lastFrameTime = 0
function renderFrameBake() {
    const currentTime = performance.now();
    const deltaTime = (currentTime - lastFrameTime) / 1000;
    lastFrameTime = currentTime;

    ctxBake.clearRect(0, 0, canvasBake.width, canvasBake.height);

    let glowOpacity = 0;
    let shadowBlur = glow.shadowBlurMin;
    let shadowColor = glow.shadowColorStart; 
    let currentGlowColor = glow.color

    if (bakeAnimationState.isAnimating) {
        const glowPhaseProgress = (currentTime - glow.animationStartTime) / glow.animationDuration;
        const glowPhase = glowPhaseProgress % 1;
        const intensity = Math.sin(glowPhase * Math.PI * 2) * 0.5 + 0.5; 

        glowOpacity = glow.minOpacity + (glow.maxOpacity - glow.minOpacity) * intensity;
        shadowBlur = glow.shadowBlurMin + (glow.shadowBlurMax - glow.shadowBlurMin) * intensity;

        const startRgba = parseRgba(glow.shadowColorStart);
        const endRgba = parseRgba(glow.shadowColorEnd);

        let interpR = 0, interpG = 0, interpB = 0, interpAlpha = 0;

        if (startRgba && endRgba) {
            interpR = Math.floor(lerpBake(startRgba[0], endRgba[0], intensity));
            interpG = Math.floor(lerpBake(startRgba[1], endRgba[1], intensity));
            interpB = Math.floor(lerpBake(startRgba[2], endRgba[2], intensity));
            interpAlpha = lerpBake(startRgba[3], endRgba[3], intensity); 
            shadowColor = `rgba(${interpR}, ${interpG}, ${interpB}, ${interpAlpha})`;
        }
    }
    drawOvenShape(ctxBake, patt)
    drawPulsatingGlow(ctxBake, currentGlowColor, shadowColor, shadowBlur, glowOpacity)
    if (bakeAnimationState.isAnimating) {
        bakeAnimationState.animationFrameId = requestAnimationFrame(renderFrameBake)
    }
}
function startBakeAnimation(duration) {
    bakeAnimationState.startTime = performance.now()
    bakeAnimationState.duration = duration
    bakeAnimationState.isAnimating = true
    glow.animationStartTime = performance.now()
    if (bakeAnimationState.animationFrameId) {
        cancelAnimationFrame(bakeAnimationState.animationFrameId)
    }
    bakeAnimationState.animationFrameId = requestAnimationFrame(renderFrameBake)
}

function pizzaBaked() {
    pizza.bake()
    dough.style.animation = 'comeBackPizza 3s ease-in-out forwards'

}

