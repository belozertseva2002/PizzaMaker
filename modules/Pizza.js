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
        if (ingredientImageElement.alt === 'грибы' || ingredientImageElement.alt === 'пепперони' || ingredientImageElement.alt === 'халапеньо' || ingredientImageElement.alt === 'огурец' || ingredientImageElement.alt === 'лук') {
            ingredientImageElement.style.width = '4vw'
            ingredientImageElement.style.height = 'auto'
        } else if (ingredientImageElement.alt === 'оливки') {
            ingredientImageElement.style.width ='1.5vw'
            ingredientImageElement.style.height = 'auto'
        } else if (ingredientImageElement.alt === 'ананас' || ingredientImageElement.alt === 'базилик') {
            ingredientImageElement.style.width ='6vw'
            ingredientImageElement.style.height = 'auto'
        } else {
            ingredientImageElement.style.width ='8vw'
            ingredientImageElement.style.height = 'auto'
        }
        this.element.appendChild(ingredientImageElement)
        this.pizzaIngredients.push({
            name: ingredient.name,
            element: ingredientImageElement,
            id: uniqueId,
        })
        return ingredientImageElement
    }
    removeIngredient(elementToRemove) {
        if (elementToRemove) {
            elementToRemove.parentNode.removeChild(elementToRemove)
            const index = this.pizzaIngredients.findIndex(item => item.element === elementToRemove)
            if (index > -1) {
            this.pizzaIngredients.splice(index, 1); 
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
                cheeseElement.src = this.newCheeseImg
            }
            item.element.style.cursor = 'default'
        })
        this.isBaked = true  
        this.savePizzaProgress()
    }
    savePizzaProgress() {
        try {
            const pizzaData = JSON.stringify(this.pizzaIngredients); 
            localStorage.setItem('pizzaMakerProgress', pizzaData);
            console.log('Прогресс пиццы сохранен локально.');
        } catch (error) {
            console.error('Ошибка при сохранении в localStorage:', error);
        }
    }

}
export default Pizza