import { writable } from 'svelte/store';
import { browser } from '$app/env';

export const productStore = writable(browser && JSON.parse(localStorage.getItem("productStore") || null));
productStore.subscribe((val)=> browser && (localStorage.productStore=JSON.stringify(val)));

export const cartStore = writable(browser ? JSON.parse(localStorage.getItem("cartStore")) || [] : []);
cartStore.subscribe((val)=> browser && (localStorage.cartStore=JSON.stringify(val)));

export const reviewStore= writable([])