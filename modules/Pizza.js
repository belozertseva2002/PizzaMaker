import Ingredient from "./Ingredient.js"

class Pizza {
    constructor(element) {
        this.pizzaIngredients = []
        this.isBaked = false
        this.element = element
        this.element.classList.add('pizza')
        this.newCheeseImg = 'images/расплавленныйсыр.png'
    }

    addIngredient(ingredient) {
        if (!ingredient) {
            console.log('Ингредиент недоступен!')
            return false
        }
        const ingredientImageElement = document.createElement('img')
        ingredientImageElement.src = ingredient.imageSrc
        ingredientImageElement.alt = ingredient.name
        ingredientImageElement.classList.add('ingredient')
        ingredientImageElement.setAttribute('data-ingredient-name', ingredient.name)
        const uniqueId = `ingredient-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
        ingredientImageElement.id = uniqueId
        ingredientImageElement.style.position = 'absolute'
        ingredientImageElement.style.zIndex = '2'
        ingredientImageElement.style.visibility = 'hidden'
        this.element.appendChild(ingredientImageElement)
        this.pizzaIngredients.push({
            name: ingredient.name,
            element: ingredientImageElement,
            id: uniqueId
        })
        console.log(`Ингредиент "${ingredient.name}" добавлен на пиццу.`)
        return ingredientImageElement
    }
    removeIngredient(elementToRemove) {
        if (elementToRemove) {
            elementToRemove.parentNode.removeChild(elementToRemove)
            const index = this.pizzaIngredients.findIndex(item => item.element === elementToRemove)
            if (index > -1) {
            this.pizzaIngredients.splice(index, 1); 
            console.log(`Ингредиент ${elementToRemove.id} удален из массива pizzaIngredients.`);
        } else {
            console.warn(`Ингредиент ${elementToRemove.id} не найден в массиве pizzaIngredients.`);
        }
        }
    }

    bake() { 
        dough.style.backgroundColor = '#ffc65d'
        const doughInner = document.getElementById('dough-inner')
        doughInner.style.background = 'radial-gradient(circle, #fbc677ff, #ffc65d)'
        this.pizzaIngredients.forEach(item => {
            if (item.name === 'сыр' && item.element) {
                const cheeseElement = item.element
                const rect = item.element.getBoundingClientRect()
                console.log(`${rect.left}, ${rect.top}`)
                console.log(cheeseElement)
                cheeseElement.src = this.newCheeseImg
                cheeseElement.style.left = rect.left + 'px'
                cheeseElement.style.top = rect.top + 'px'
                
            }
        })
        console.log('Пицца готова!')
        console.log(doughInner)
        this.isBaked = true  
    }

}
export default Pizza