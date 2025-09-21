import Ingredient from "./Ingredient.js"

class Pizza {
    constructor(element) {
        this.pizzaIngredients = []
        this.isBaked = false
        this.element = element
        this.element.classList.add('pizza')
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
        console.log('Пицца готова!')
        this.isBaked = true  
    }

}
export default Pizza