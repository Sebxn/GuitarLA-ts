import { useState, useEffect, useMemo } from "react"
import { db } from "../data/db"

import type { Guitar, CartItem } from "../types/types"

export default function useCart() {

    // verificar si hay un carrito en el localStorage
    const initialCart = () : CartItem[]  => {
        const localStorageCart = localStorage.getItem('cart')
        return localStorageCart ? JSON.parse(localStorageCart) : []
    }

    // States
    const [data] = useState(db)
    const [cart, setCart] = useState(initialCart)

    // este useEffect sincroniza el estado(State) del carrito con el localStorage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    function addToCart(item : Guitar) {

        const itemExists = cart.findIndex(guitar => guitar.id === item.id)
        
        if (itemExists >= 0) { // Si el item ya existe en el carrito
        if (cart[itemExists].quantity >= 5) return // Si la cantidad es igual o mayor a 5, no permitir agregar más
        
        const updatedCart = [...cart]
        updatedCart[itemExists].quantity++
        setCart(updatedCart)      
        } else {
            const newItem : CartItem = {...item, quantity: 1}
            
            setCart([...cart, newItem])
        }

    }

    function removeFromCart(id : Guitar['id']) {
        setCart(prevState => prevState.filter(guitar => guitar.id !== id))
    }

    function decreaseQuantity(id : Guitar['id']) {
        const updatedCart = cart.map(item => {
        if (item.id === id && item.quantity > 1) {
            return {
            ...item,
            quantity: item.quantity - 1
            }
        }
        
        return item
        })
        setCart(updatedCart)
    }

    function increaseQuantity(id : Guitar['id']) {
        const updatedCart = cart.map(item => {
        if (item.id === id && item.quantity < 5) {
            return {
            ...item,
            quantity: item.quantity + 1
            }
        }
        
        return item
        })
        setCart(updatedCart)
    }

    function clearCart() {
        setCart([])
    }

    // State Derivado
    const isEmpty = useMemo( () => cart.length === 0, [cart] )
    const cartTotal = useMemo( () => cart.reduce((total, item) => total + (item.quantity * item.price), 0), [cart] )


    return {
        data,
        cart,
        addToCart,
        removeFromCart,
        decreaseQuantity,
        increaseQuantity,
        clearCart,
        isEmpty,
        cartTotal
    }

}