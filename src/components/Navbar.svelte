<script>
    import { session } from "$app/stores";
    import { clickOutside } from './clickOutside';
    import { onAuthStateChanged } from "firebase/auth";
    import { auth } from "../firebase";
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { cartStore } from "./stores";
    import {request} from "../fetch"
    let email="user";
    
    onMount(async () => {
		onAuthStateChanged(auth, (user) => {
        console.log($session.user.email);
        if (user) {
            email=user.email;            
        } 
        });         
	});
    function handleClickOutside(event) {
		var el =document.getElementById("dropUl");
        
        if(!el.classList.contains("hidden")){
          el.classList.toggle("hidden")
        }
	};
  
    const handlesignout=async ()=>{
      await request("/auth", "DELETE");
      $cartStore=[]
        window.location.replace("/")
    }

    let dropdown=false

  const handleDrop=()=>{
        var el =document.getElementById("dropUl");
        el.classList.toggle("hidden")
        dropdown=!dropdown
    };

    const handleProfile=()=>{
      goto("http://localhost:3000/account")
    }
    const cart=()=>{
        var el= document.getElementById("test");
        el.classList.toggle("hidden")
    }
    function removeFromList(index) {        
        $cartStore.splice(index, 1)
        $cartStore=$cartStore;
    }
</script>


<header class="relative bg-white">
    <nav aria-label="Top" class="max-w-7xl mx-auto sm:px-6 lg:px-8">
      <div class="relative border-b border-gray-200 px-4 pb-14 sm:static sm:px-0 sm:pb-0">
        <div class="h-16 flex items-center justify-between">
          <!-- Logo -->
          <div class="transition duration-500 ease-in-out transform hover:-translate-y-0.5 flex-1 flex">
            <a href="/">myKart</a>
          </div>
  
          <div class="absolute bottom-0 inset-x-0 border-t overflow-x-auto sm:static sm:border-t-0">
            <div class="h-14 flex justify-evenly items-center px-4 space-x-8 sm:h-auto">
              <a href="/" class="hover:font-semibold transition duration-500 ease-in-out transform hover:-translate-y-0.5 text-sm font-medium text-gray-700 hover:text-gray-800">Home</a>
  
              <a href="/browse" class="hover:font-semibold transition duration-500 ease-in-out transform hover:-translate-y-0.5 text-sm font-medium text-gray-700 hover:text-gray-800">Browse</a>
  
              <a href="/offers" class="hover:font-semibold transition duration-500 ease-in-out transform hover:-translate-y-0.5 text-sm font-medium text-gray-700 hover:text-gray-800">Offers</a>
            </div>
          </div>
  
          <div class="flex-1 flex items-center justify-end">
            <!-- Cart -->
            <div class=" mr-4 flow-root text-sm lg:relative lg:ml-8">
              <button on:click|preventDefault={()=>{goto("/cart")}} on:mouseenter={cart} on:mouseleave={cart} type="button" class=" group -m-2 p-2 flex items-center" aria-expanded="false">
                <!-- Heroicon name: outline/shopping-bag -->
                <svg class="flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span class="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">{$cartStore.length}</span>
                <span class="sr-only">items in cart, view bag</span>
              </button>
  
              <!--
                Entering: "transition ease-out duration-200"
                  From: "opacity-0"
                  To: "opacity-100"
                Leaving: "transition ease-in duration-150"
                  From: "opacity-100"
                  To: "opacity-0"
              -->
              <div id="test" class="hidden z-10 hover:block absolute top-16 inset-x-0 mt-px pb-6 bg-white shadow-lg sm:px-2 lg:top-full lg:left-auto lg:right-0 lg:mt-3 lg:-mr-1.5 lg:w-80 lg:rounded-lg lg:ring-1 lg:ring-black lg:ring-opacity-5">
                <h2 class="sr-only">Shopping Cart</h2>
  
                <form class="max-w-2xl mx-auto px-4">
                  <ul class="divide-y divide-gray-200">
                    {#if $cartStore.length==0}
                        <li class="py-6 flex items-center">
                        <div class="ml-4 flex-auto">
                            <h3 class="font-medium text-gray-900">
                            <p>Cart is empty!</p>
                            </h3>
                            <p class="text-gray-500">Please add the items to your bag.</p>
                        </div>
                        </li>
                    {:else}
                        {#each $cartStore as product, i}
                            <li class="py-6 flex items-center">
                                <img src={product.url} alt="Product in the cart." class="flex-none w-16 h-16 rounded-md border border-gray-200" />
                                <div class="ml-4 flex-auto">
                                    <h3 class="font-medium text-gray-900">
                                    <p>{product.name.substr(0,30)+"..."}</p>
                                    </h3>
                                </div>
                                <!-- svelte-ignore a11y-missing-attribute -->
                                <span class="float-right cursor-pointer" on:click={() => removeFromList(i)}><img src="https://img.icons8.com/material-outlined/24/000000/trash--v1.png"/></span>
                            </li>
                        {/each}
                    {/if}
                  </ul>   
                  <button type="submit" on:click|preventDefault={()=>{goto("/cart")}} class="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500">Checkout</button>
                </form>
              </div>
            </div>
            <div use:clickOutside on:click_outside={handleClickOutside} class="ml-3 relative">
              <div>
                <button on:click={handleDrop} type="button" class="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                  <span class="sr-only">Open user menu</span>
                  <img class="h-8 w-8 rounded-full" src="https://img.icons8.com/ios-glyphs/30/000000/user-male--v2.png" alt="user"/>
                </button>
              </div>
    
              <!--
                Dropdown menu, show/hide based on menu state.
    
                Entering: "transition ease-out duration-200"
                  From: "transform opacity-0 scale-95"
                  To: "transform opacity-100 scale-100"
                Leaving: "transition ease-in duration-75"
                  From: "transform opacity-100 scale-100"
                  To: "transform opacity-0 scale-95"
              -->
              <div id="dropUl" class="hidden z-10 origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabindex="-1">
                <!-- Active: "bg-gray-100", Not Active: "" -->
                {#if $session.user.exists}
                  <p on:click={handleProfile} class="block px-4 py-2 hover:bg-gray-100 text-sm text-gray-700 cursor-pointer" role="menuitem" tabindex="-1" id="user-menu-item-0">Your Profile</p>
                  <p on:click={handlesignout} class="block px-4 py-2 hover:bg-gray-100 text-sm text-gray-700 cursor-pointer" role="menuitem" tabindex="-1" id="user-menu-item-2">Sign out</p>
                {:else}
                  <p on:click={()=>{goto("/login")}} class="block px-4 py-2 hover:bg-gray-100 text-sm text-gray-700 cursor-pointer" role="menuitem" tabindex="-1" id="user-menu-item-2">Sign in</p>
                {/if}
            </div>
            <!-- <div use:clickOutside on:click_outside={handleClickOutside} class=" ml-4 dropdown relative">
                <button on:click={handleDrop} class="transition duration-500 ease-in-out transform hover:-translate-y-0.5 bg-gray-300 rounded-full text-gray-700 font-semibold p-2 inline-flex items-center">
                    <i class="fas fa-user"></i>
                </button>

                <ul id="dropUl" class="z-10 dropdown-menu absolute hidden text-gray-700 pt-1">
                    
                  {#if $session.user.exists}
                        <h1 class="rounded-t bg-gray-100 text-gray-500 px-2">{email}</h1>
                        <li on:click={handleProfile}><div class=" cursor-pointer bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap">Account</div></li>
                        <li on:click={handlesignout}><div class=" cursor-pointer bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap">Logout</div></li>
                    {:else}
                        <li><a class="bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap" href="/login">Login</a></li>
                    {/if}
                </ul>      
            </div> -->
          </div>
        </div>
      </div>
    </nav>
  </header>
  