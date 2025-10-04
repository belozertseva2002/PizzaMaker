const dough = document.getElementById('dough');
const rollingPin = document.getElementById('rolling-pin');
const doughInner = document.getElementById('dough-inner')
const clickMe = document.getElementById('clickMe')
const board = document.getElementById('board')
const gameContainer = document.getElementById('game-container')
const screenWidth = window.innerWidth

import Ingredient from "./modules/Ingredient.js";
import Pizza from "./modules/Pizza.js";
import { soundManager } from "./modules/SoundManager.js";

let sauceApllied = false
let isRolling = false
let targetDoughSize = 30;
let doughInnerSize = 27
let dragX, dragY
let handleMouseMove
let originalFilter = rollingPin.style.filter
let originalLeft = rollingPin.style.left
let originalTop = rollingPin.style.top
const scalePin = dough.offsetWidth*0.005
rollingPin.style.transform = `scale(${scalePin})`

async function initializeGame() {
    await soundManager.loadSound('/music/Del Rio Bravo.mp3', 'fon');
    await soundManager.loadSound('/music/скалка.m4a', 'скалка');
    await soundManager.loadSound('/music/кликсоус.m4a', 'кликсоус');
    await soundManager.loadSound('/music/соуснапицце.m4a', 'соуснапицце');
    await soundManager.loadSound('/music/кнопка.m4a', 'кнопка');
    await soundManager.loadSound('/music/keyboard.m4a', 'text')
    await soundManager.loadSound('/music/ингредиенты.m4a', 'ingredient')
    await soundManager.loadSound('/music/печь.m4a', 'bake')
    await soundManager.loadSound('/music/delete.m4a', 'delete')
    console.log('Аудио готово')
}
initializeGame()
rollingPin.addEventListener('mousedown', rollerDragStart);
rollingPin.addEventListener('touchstart', rollerDragStart)

function rollerDragStart(e) {
    soundManager.playMusic('fon', 0.1)
    if (e.type === 'touchstart') {
        dragX = e.touches[0].clientX - rollingPin.offsetLeft
        dragY = e.touches[0].clientY - rollingPin.offsetTop
        console.log('touchstart')
        e.preventDefault()
    } else {
        dragX = e.clientX - rollingPin.offsetLeft
        dragY = e.clientY - rollingPin.offsetTop
        rollingPin.style.filter = 'drop-shadow(10px 10px 10px rgba(0, 0, 0, 0.5))'
    }
    rollingPin.style.zIndex = '1000'; 
    rollingPin.style.cursor = 'grabbing'; 

    window.addEventListener('mousemove', rollerDrag); 
    window.addEventListener('touchmove', rollerDrag)
    window.addEventListener('mouseup', dragEnd);
    window.addEventListener('touchend', dragEnd) 
}
let newX, newY
function rollerDrag(e) {
    if (e.type === 'touchmove') {
        newX = e.touches[0].clientX - dragX
        newY = e.touches[0].clientY - dragY
        rollingPin.style.left = newX + 'px'; 
        rollingPin.style.top = newY + 'px';
        if (newX > -30 && newX < 80 && newY > 60 && newY < 230) {
            rollDough(e)
        }
    } else {
        newX = e.clientX - dragX; 
        newY = e.clientY - dragY; 
        rollingPin.style.left = newX + 'px'; 
        rollingPin.style.top = newY + 'px';
        dough.addEventListener('mouseover', rollDough)
    }
    
}

function dragEnd(e) {
    e.preventDefault();
    rollingPin.style.cursor = 'grab';
    rollingPin.style.left = originalLeft
    rollingPin.style.top = originalTop
    rollingPin.style.filter = originalFilter
    rollingPin.style.transform = `scale(${scalePin})`
    window.removeEventListener('mousemove', rollerDrag); 
    window.removeEventListener('touchmove', rollerDrag)
    window.removeEventListener('mouseup', dragEnd);
    window.removeEventListener('touchend', dragEnd)
    dough.removeEventListener('mouseover', rollDough)
    if (isRolling) {
        rollingPin.removeEventListener('mousedown', rollerDragStart)
        rollingPin.removeEventListener('touchstart', rollerDragStart)
        rollingPinAway()
    }
}

let count = 1
function rollDough(e) {
    if (e.type === 'touchmove' && count === 1) {
        console.log('touchmove'+ count)
        soundManager.playSound('скалка', 0.8, false)
    } else if (e.type === 'mouseover') {
        console.log('комп')
        soundManager.playSound('скалка', 0.8, false)
    }
    rollingPin.style.filter = 'none'
    dough.style.width = targetDoughSize + 'vw'
    dough.style.height = targetDoughSize + 'vw'
    isRolling = true
    setTimeout(doughInnerMake, 500)
    count++
}

function doughInnerMake() {
    if (isRolling) {
            doughInner.style.left = '1.5vw'
            doughInner.style.top = '1.5vw'
            doughInner.style.width = doughInnerSize + 'vw'
            doughInner.style.height = doughInnerSize + 'vw'
        
        doughInner.style.filter = 'drop-shadow(1px 2px 20px rgba(255, 255, 255, 0.77))'
    }
}

const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
const textPickMe = "Нажми на меня!"
let sauceCount = 0
const sauceThreshold = 100
let sauceQuestionShown = false

function rollingPinAway() {
    soundManager.stopMusic('скалка')
    rollingPin.style.left = newX +'px'
    rollingPin.style.top = newY +'px'
    rollingPin.style.transform = `scale(${scalePin}}) translate(${newX}px, ${newY}px)`
    console.log(`translate(${newX}px, ${newY}px)`)
    rollingPin.style.transition = 'none'
    rollingPin.style.animation = 'rollAway 2s ease-out forwards'
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
    soundManager.playSound('text', 0.5, true)
    const interval = setInterval(() => {
        text.textContent += textPickMe[i]
        i++
        if (i >= textPickMe.length) {
            soundManager.stopMusic('text')
            console.log('stoptext')
            clearInterval(interval)
        }
    }, 100)
   }, 1000)
}

function clickMeSauce(e) {
    soundManager.playSound('кнопка')
    document.body.classList.add('brush-cursor')
    clickMe.style.cursor = "url('images/cursor.png') 5 10, auto"
    dough.addEventListener('mouseover', applySauce)
    dough.addEventListener('touchstart', applySauce)
    dough.addEventListener('touchend', () => {soundManager.stopMusic('кликсоус')})
}
clickMe.addEventListener('click', clickMeSauce)


function applySauce() {
    console.log('dsvjv')
    soundManager.playSound('кликсоус', 0.6, true)
    if (!sauceApllied) {
        dough.classList.add('rotating-cursor')
        handleMouseMove = (e) => {
            const oldText = document.getElementById('sauceSpeak')
            if (oldText) {
                oldText.style.display = 'none'
            }
            let x, y
            const rect = dough.getBoundingClientRect()
            if (screenWidth <= 932 && e.type === 'touchmove') {
                x = e.touches[0].clientX - rect.left- 50
                y = e.touches[0].clientY - rect.top - 20
                console.log(`x:${x}, y:${y}, ${e.touches[0].clientX}, ${e.touches[0].clientY}`)
            } else {
                x = e.clientX - rect.left - 50
                y = e.clientY - rect.top - 20
            }
            
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
        dough.addEventListener('touchmove', handleMouseMove)
        board.addEventListener('mouseleave', () => {console.log('mouseleave'); soundManager.stopMusic('кликсоус')})
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
    const clickyesButton = () => {
        console.log('отключаем mouseover')
        soundManager.playSound('кнопка'); 
        yesButton.style.filter = 'none';
        clickMe.removeEventListener('click', clickMeSauce) 
        dough.removeEventListener('mouseover', applySauce);
        dough.removeEventListener('touchstart', applySauce); 
        dough.removeEventListener('mousemove', handleMouseMove);
        dough.removeEventListener('touchmove',handleMouseMove); 
        showMenu()
    }
    buttonText.addEventListener('click', clickyesButton);
    yesButton.addEventListener('click', clickyesButton);
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

let ingredientImageElement
let ingredientName
function renderIngredientsMenu() {
    const ingredientMenuItemsArray = Array.from(allIngredientMenuItems);
    console.log(`Найдено ${ingredientMenuItemsArray.length} элементов в меню при рендеринге.`)
    ingredientMenuItemsArray.forEach(item => {
        ingredientName = item.dataset.ingredient
        const ingredient = ingredientsData[ingredientName]
        if (!ingredient) {
            console.warm(`Ингредиент "${ingredientName}" найден в меню, но отсутствует в ingredientData.`)
            return
        }
        const clickItem = () => {
            console.log('кликнули на ингредиент')
            if (ingredient) {
                ingredientImageElement = pizza.addIngredient(ingredient)
                ingredientImageElement.addEventListener('mousedown', startDrag)
                ingredientImageElement.addEventListener('touchstart', startDrag)
                if (ingredientImageElement) {
                    const onLoadHandler = () => {
                        const ingredientWidth = ingredientImageElement.offsetWidth
                        const ingredientHeight = ingredientImageElement.offsetHeight
                        console.log(`Ширина ${ingredientName}: ${ingredientWidth}, Высота ${ingredientName}: ${ingredientHeight}`)
                        const randomAngle = Math.floor(Math.random() * 225)- 45
                        const centerX = (doughInner.offsetWidth - ingredientWidth) / 2
                        const centerY = (doughInner.offsetHeight - ingredientHeight) / 2
                        ingredientImageElement.style.left = `${centerX}px`;
                        ingredientImageElement.style.top = `${centerY}px`;
                        ingredientImageElement.style.transform = `rotate(${randomAngle}deg)`
                        ingredientImageElement.style.visibility = 'visible'
                        soundManager.playSound('ingredient')
                        console.log('Картинка видна на пицце')
                        ingredientImageElement.removeEventListener('load', onLoadHandler)
                    }
                    ingredientImageElement.onerror = () => {
                        console.error(`Не удалось загрузить изображение :${selectedIngredientData.imageSrc}`)
                        ingredientImageElement.remove()
                    }
                    ingredientImageElement.addEventListener('load', onLoadHandler)
                }
            }
        }
    item.addEventListener('touchstart', clickItem)
    item.addEventListener('click', clickItem)
})
}
const pressDuration = 1500
let longPressTimer = null
let initialTouchPosition = null
let isLongPressActive = false
    const startDrag = (e) => {
        e.preventDefault()
        if (pizza.isBaked === true) return
        ingredientImageElement = e.target
        ingredientImageElement.parentElement.appendChild(ingredientImageElement)
        const rect = ingredientImageElement.getBoundingClientRect()
        if (e.type === 'touchstart') {
            dragIngredientX = e.touches[0].clientX - rect.left
            dragIngredientY = e.touches[0].clientY - rect.top
            console.log('touch')
            longPressTimer = null;
            if (!isLongPressActive && !longPressTimer) { 
                initialTouchPosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
                longPressTimer = setTimeout(() => {
                    isLongPressActive = true; 
                        
                    console.log(`Долгое нажатие на ${ingredientImageElement.tagName} detected.`);
                        
                        
                    pizza.removeIngredient(ingredientImageElement); 
                    console.log(`Ингредиент удален (долгое нажатие): ${JSON.stringify(pizza.pizzaIngredients, null, 2)}`);
                    soundManager.playSound('delete', 0.3); 
                    initialTouchPosition = null
                    isLongPressActive = false
            }, pressDuration);
        }
        } else {
            dragIngredientX = e.clientX - rect.left
            dragIngredientY = e.clientY - rect.top
        }
        const offset = {x: dragIngredientX, y: dragIngredientY}
        console.log(`e.client:(${e.clientX}, ${e.clientY}) rect: (${rect.left}, ${rect.top}), dragIngredient: ${dragIngredientX},${dragIngredientY}`)
        ingredientImageElement.style.cursor = 'grabbing'
        ingredientImageElement.style.zIndex = '100'
        draggableElementInfo = {element: ingredientImageElement, offset: offset,  ingredientName: ingredientName}
        document.addEventListener('touchend', dragIngredientEnd)
        document.addEventListener('mouseup', dragIngredientEnd)
        
    }

document.addEventListener('keydown', (event) => {
    if (!draggableElementInfo) return
    const {element} = draggableElementInfo
    if (event.key === 'Delete' && element) {
        event.preventDefault()
        soundManager.playSound('delete', 0.3)
        pizza.removeIngredient(element)
        console.log(`Ингредиент удален ${JSON.stringify(pizza.pizzaIngredients, null, 2)}`)
    }
})
document.addEventListener('mousemove', dragIngredient)
document.addEventListener('touchmove', dragIngredient)

function dragIngredient(e) {
    if (!draggableElementInfo) return
    console.log('touchmove')
    const {element} = draggableElementInfo
    const doughInnerRect = doughInner.getBoundingClientRect()
    const ingredientWidth = element.offsetWidth
    const ingredientHeight = element.offsetHeight
    const centerPizza = doughInner.offsetWidth/2
    const radius = centerPizza
    const edgeOffset = 10
    const ingredientMaxOffsetRadius = Math.sqrt((ingredientWidth / 2)**2 + (ingredientHeight / 2)**2)
    const effectiveRadiusForCenter = radius + edgeOffset - ingredientMaxOffsetRadius
    let mouseX_relativeToDoughInner, mouseY_relativeToDoughInner 
    if (e.type === 'touchmove') {
        mouseX_relativeToDoughInner = e.touches[0].clientX - doughInnerRect.left
        mouseY_relativeToDoughInner = e.touches[0].clientY - doughInnerRect.top
    } else {
        mouseX_relativeToDoughInner = e.clientX - doughInnerRect.left
        mouseY_relativeToDoughInner = e.clientY - doughInnerRect.top
    }
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
    if (finalNewX + ingredientWidth > doughInner.offsetWidth) finalNewX = doughInner.offsetWidth - ingredientWidth
    if (finalNewY + ingredientHeight > doughInner.offsetHeight) finalNewY = doughInner.offsetHeight - ingredientHeight
    console.log(finalNewX, finalNewY)
    element.style.left = finalNewX + 'px'; 
    element.style.top = finalNewY + 'px';
}

function dragIngredientEnd(e) {
    e.preventDefault()
    if (draggableElementInfo) {
        if (longPressTimer) {clearTimeout(longPressTimer)}
        soundManager.playSound('ingredient')
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
    let text
    if (screenWidth <= 932) {
        text = "Ваша кухня ждет! 🍕 Добавить: Кликните на ингредиент в меню. Удалить: Удерживайте, чтобы убрать. Испечь: Жмите на огонек, когда готовы!"
    } else {
        text = "Ваша кухня ждет! 🍕 Добавить: Кликните на ингредиент в меню. Удалить: Удерживайте его левой кнопкой мыши и нажмите Delete. Испечь: Жмите на огонек, когда готовы!"
    }
    paperInfo.appendChild(textContainer)
    let i = 0;
    soundManager.playSound('text', 0.2, true)
        const interval = setInterval(() => {
            textContainer.textContent += text[i]
            i++
             if (i >= text.length) {
                soundManager.stopMusic('text')
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
 
 const clickCnavasButton = () => {
    soundManager.stopMusic('text')
    soundManager.playSound('bake', 0.7, true)
    ingredientsMenu.style.display = 'none'
    const paperInfo = document.getElementById('paper-info')
    paperInfo.style.display = 'none'
    canvasButton.style.display = 'none'
    document.removeEventListener('mousemove', dragIngredient)
    document.removeEventListener('mouseup', dragIngredientEnd)
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
}
canvasButton.addEventListener('click', clickCnavasButton)
canvasButton.addEventListener('touchstart', clickCnavasButton) 
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
const saveButton = document.getElementById('save-button')
const updateButton = document.getElementById('update-button')
const soundButton = document.getElementById('sound-button')
function pizzaBaked() {
    pizza.bake()
    dough.style.animation = 'comeBackPizza 3s ease-in-out forwards'
    setTimeout(() => {
        canvasBake.style.animation = 'away 3s ease-out forwards'
        board.style.animation = 'toCenter 2s ease-out forwards'
        soundManager.stopMusic('bake')
    }, 3000)
    setTimeout(() => {
        canvasBake.style.display = 'none'
        saveButton.style.display = 'block'
        updateButton.style.display = 'block'
    }, 6000) 
}

function captureScreenshot(elementToCapture, filename = 'screenshot'){
    return new Promise((resolve, reject) => {
        html2canvas(elementToCapture, {
            allowTaint: true, 
            useCORS: true     
        }).then(canvas => {
            resolve(canvas); 
        }).catch(error => {
            console.error("Ошибка при создании скриншота:", error);
            reject(error);
        });
    });
}
function exportCanvasAsFile(canvas, filename = 'screenshot', fileType = 'image/png') {
    return new Promise((resolve, reject) => {
        try {
            const dataURL = canvas.toDataURL(fileType);
            const link = document.createElement('a');
            link.download = `${filename}.${fileType.split('/')[1]}`;
            link.href = dataURL;
            link.click();
            resolve(); 
        } catch (error) {
            reject(error)
        }
    });
}
async function screenShot() {
    try {
        if (!board || !saveButton) {
            throw new Error("Не найдены необходимые DOM-элементы (pizza-container, board, save-button).");
        }
        const canvas = await html2canvas(dough, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: true,
            ignoreElements: (element) => element.id === 'save-button' || element.tagName === 'BUTTON'
        })
        console.log(`dough.offset:${dough.offsetWidth}`)
        const croppedCanvas = document.createElement('canvas');
        croppedCanvas.width = dough.offsetWidth*1.99
        croppedCanvas.height = dough.offsetWidth*1.99
        const context = croppedCanvas.getContext('2d')    
        context.drawImage(canvas, 0, 0, croppedCanvas.width, croppedCanvas.height, 0, 0, croppedCanvas.width, croppedCanvas.height)           
        console.log("Экспортируем скриншот...");
        await exportCanvasAsFile(croppedCanvas, `pizza-${Date.now()}`, 'image/png');
        console.log("Пицца успешно сохранена!");
        alert("Ваша пицца сохранена! 🍕");
    } catch {
        console.error("Не удалось сохранить пиццу:", error);
        alert("Произошла ошибка при сохранении пиццы. Попробуйте еще раз.")
    }
}
const soundButtonclick = () => {
    soundManager.toggleMasterMute()
    if (soundManager.isMuted) {
        console.log('звук выключен'); 
        soundButton.title = 'Включить звук'
        soundButton.textContent = '🔊'
    } else {
        console.log('звук включен')
        soundButton.title = 'Выключить звук'
        soundButton.textContent = '🔇'
    }
}
const updateButtonclick = () => {
    location.reload()
}
soundButton.addEventListener('touchend', (e) =>{e.preventDefault(); soundButtonclick()})
soundButton.addEventListener('click', soundButtonclick)
saveButton.addEventListener('touchstart', screenShot)
saveButton.addEventListener('click', screenShot)
updateButton.addEventListener('click', updateButtonclick)
updateButton.addEventListener('touchstart', updateButtonclick)
window.addEventListener('resize', () => {
    const orientation = document.getElementById('check-orientation')
    if (window.innerHeight > window.innerWidth) {
        orientation.style.display = 'block'
    } else {
        orientation.style.display = 'none'
    }
})