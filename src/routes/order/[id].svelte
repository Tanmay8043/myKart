<svelte:head>
  <title>Your Orders - myKart</title>
</svelte:head>

<script>
    import { page } from '$app/stores';
    import {auth, db} from "../../firebase"
    import Navbar from "../../components/Navbar.svelte"
    import Footer from "../../components/Footer.svelte"
    import { onAuthStateChanged } from "firebase/auth";
    import { doc, getDoc } from "firebase/firestore";
    import { onMount } from 'svelte';

    var summary={},d
    var items=[]
    let oid= $page.params.id
    onMount(async () => {
		onAuthStateChanged(auth, (user) => {
        if (user) {
            const ref=doc(db, "users",user.email, "orders", oid);
            const docSnap = getDoc(ref);
            docSnap.then(function(result){
                summary=result.data();
                console.log(summary);
                var options = {year: 'numeric', month: 'long', day: 'numeric' };
                d =new Date(summary.orderedAt.seconds*1000).toLocaleString("en-US", options );
                items= summary.orderItems;
                console.log(items);
            });
        }});
	});

  </script>

  <Navbar/>

  <!-- This example requires Tailwind CSS v2.0+ -->
<div class="bg-white">
    <div class="py-16 sm:pt-10 sm:pb-24">
      <div class="max-w-7xl mx-auto sm:px-2 lg:px-8">
        <div class="max-w-2xl mx-auto px-4 lg:max-w-4xl lg:px-0">
          <h1 class="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">Order history</h1>
          <p class="mt-2 text-sm text-gray-500">Check the status of your order.</p>
        </div>
      </div>
  
      <div class="mt-16">
        <div class="max-w-7xl mx-auto sm:px-2 lg:px-8">
          <div class="max-w-2xl mx-auto space-y-8 sm:px-4 lg:max-w-4xl lg:px-0">
            <div class="bg-white border-t border-b border-gray-200 shadow-sm sm:rounded-lg sm:border">
  
              <div class="flex items-center p-4 border-b border-gray-200 sm:p-6 ">
                <dl class="flex-1 grid grid-cols-2 gap-x-6 text-sm sm:col-span-3 sm:grid-cols-3 lg:col-span-2">
                  <div>
                    <dt class="font-medium text-gray-900">Order ID</dt>
                    <dd class="mt-1 text-gray-500">{summary.order_id}</dd>
                  </div>
                  <div class="hidden sm:block">
                    <dt class="font-medium text-gray-900">Date placed</dt>
                    <dd class="mt-1 text-gray-500">
                      <time datetime="2021-07-06">{d}</time>
                    </dd>
                  </div>
                  <div>
                    <dt class="font-medium text-gray-900">Total amount</dt>
                    <dd class="mt-1 font-medium text-gray-500">₹{summary.totalPrice}/-</dd>
                  </div>
                </dl>
            </div>
  
              <!-- Products -->
              <h4 class="sr-only">Items</h4>
              <ul class="divide-y divide-gray-200">
                 {#each items as item}
                <li class="p-4 sm:p-6">
                  <div class="flex items-center sm:items-start">
                    <div class="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg overflow-hidden sm:w-40 sm:h-40">
                      <img src={item.url} alt="order" class="w-full h-full object-center object-cover" />
                    </div>
                    <div class="flex-1 ml-6 text-sm">
                      <div class="font-medium text-gray-900 sm:flex sm:justify-between">
                        <h5 class="mr-8">{item.name}</h5>
                        <p class="mt-2 sm:mt-0">₹{item.deal * item.quantity}/-</p>
                      </div>
                      <p class="block text-gray-500 sm:block sm:mt-2">Quantity: {item.quantity}</p>
                    </div>
                  </div>
  
                  <div class="mt-6 sm:flex sm:justify-between">
                    <div class="flex items-center">
                        <img src="https://img.icons8.com/material-sharp/24/26e07f/clock.png" alt="delivery-clock"/>
                      <p class="ml-2 text-sm font-medium text-gray-500">Delivery in 3-4 days!</p>
                    </div>
                  </div>
                </li>
                {/each}
                <!-- More products... -->
              </ul>
            </div>
  
            <!-- More orders... -->
          </div>
        </div>
      </div>
    </div>
  </div>
  

  <Footer/>