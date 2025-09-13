import Ingredient from "./Ingredient.js"

class Pizza {
    constructor() {
        this.ingredients = []
        this.isBaked = false
        this.element = document.createElement('div')
        this.element.classList.add('pizza')
    }

    addIngredient(ingredient) {
        if (ingredient instanceof Ingredient && ingredient.isAvailable()) {
            this.ingredients.push(ingredient)
            ingredient.addToPizza(this.element)
        } else {
            console.log('недоступный ингредиент!')
        }
    }

    bake() {
        if (this.ingredients.lenght > 0) {
            this.isBaked = true
            console.log('Пицца готова!')
        } else {
            console.log('Пицца еще не готова. Добавьте ингредиенты!')
        }
    }

    getElement() {
        return this.element
    }
}
export default Pizza