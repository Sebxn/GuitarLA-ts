export type Guitar = {
    id: number,
    name: string,
    image: string,
    description: string,
    price: number,
}
// CartItem es un tipo que extiende o hereda de Guitar, pero con una propiedad adicional llamada quantity
export type CartItem = Guitar &{
    quantity: number
}


