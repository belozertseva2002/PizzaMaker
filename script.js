const dough = document.getElementById('dough');
const rollingPin = document.getElementById('rolling-pin');
const doughInner = document.getElementById('dough-inner')
const clickMe = document.getElementById('clickMe')
const board = document.getElementById('board')

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
   
