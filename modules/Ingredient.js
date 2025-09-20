class Ingredient {
    constructor(name, imageSrc, menuImageSrc) {
        this.name = name
        this.imageSrc = imageSrc
        this.menuImageSrc = menuImageSrc

    }

   /* addToPizza(pizzaElement) {
        if (this.quantity > 0) {
            const ingredientElement = document.createElement('img')
            ingredientElement.src = this.imageSrc
            ingredientElement.alt = this.name
            ingredientElement.classList.add('ingredient')
            pizzaElement.appendChild(ingredientElement)
            this.quantity--
        } else {
            console.log(`${this.name} закончился!`)
        }
    }*/

    isAvailable() {
        return this.quantity >0
    }
}
export default Ingredient