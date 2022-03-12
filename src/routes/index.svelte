<svelte:head>
  <title>Welcome to myKart🙏</title>
</svelte:head>

<script>
    import Navbar from "../components/Navbar.svelte";
    import Footer from "../components/Footer.svelte";
    import {auth,db} from "../firebase";
    import { query, collection, getDocs, orderBy } from "firebase/firestore";
    import { onMount } from 'svelte';
    import ItemPost from "../components/ItemPost.svelte";
    import { goto } from "$app/navigation";
    import Carousel from "../components/Carousel.svelte";

  const offers=[]
  const showProducts=[];
  onMount(async () => {
		const ref = collection(db,"products/","hot offers/","offers/");
    const querySnapshot = getDocs(query(collection(db, "products"), orderBy("time", "desc")));
        querySnapshot.then(function (result){
            for (let index = 0, count=0; index < 4; index++) {
                if( result.docs[index]._document.data.value.mapValue.fields != undefined){
                    showProducts[index]=result.docs[index]._document.data.value.mapValue.fields;
                }
                
            }
        });
        const querySnapshot1 = getDocs(ref);
        querySnapshot1.then(function (result){
            for (let index = 0, count=0; index < 4; index++) {
                if( result.docs[index]._document.data.value.mapValue.fields != undefined){
                    offers[index]=result.docs[index]._document.data.value.mapValue.fields;
                }
                
            }
        });
	});

 

</script>
<body>
<!-- navbar Part  -->

<Navbar/>

<div class="relative bg-gray-900">
	<div aria-hidden="true" class="absolute inset-0 overflow-hidden">
		<img src="https://tailwindui.com/img/ecommerce-images/home-page-01-feature-section-01.jpg" alt="" class="w-full opacity-600 h-full object-center object-cover">
	</div>
	<div aria-hidden="true" class="absolute inset-0 bg-gray-900 opacity-50"></div>
	<div class="relative max-w-3xl mx-auto py-32 px-6 flex flex-col items-center text-center sm:py-64 lg:px-0">
		<h1 class="text-4xl font-extrabold tracking-tight text-white lg:text-6xl">New trendy arrivals are here!!!</h1>
		<p class="mt-4 text-xl text-white">The new arrivals have, well, newly arrived. Check out the latest options from our summer small-batch release while they're still in stock.</p>
		<a href="/browse" class="mt-8 inline-block bg-white border border-transparent rounded-md py-3 px-8 text-base font-medium text-gray-900 hover:bg-gray-100">Shop Now</a>
	</div>
</div>

<!-- Carousel Part  -->
<div class="mt-4 ml-10 bg-red-200 flex w-80 py-2 text-3xl font-semibold pl-2">Trending Products </div> 
<Carousel/>

<!-- Latest Arrivals  -->

<div>
  <div class="flex justify-between">
    <div class="mt-4 ml-10 bg-red-200 flex w-80 py-2 text-3xl font-semibold pl-2">Latest Arrivals </div> 
    <div class="mt-4 mr-10 bg-blue-400 flex justify-center w-40 py-2 text-2xl font-semibold pl-2 cursor-pointer" on:click={()=>{goto("/browse")}}>view more</div>
  </div>
  <div class="mx-10 md:grid md:grid-cols-2 lg:grid-cols-4 mt-4 gap-4">
    {#each showProducts as prod}
      <ItemPost src={prod.url.stringValue} name={prod.name.stringValue} deal= {prod.deal.integerValue} mrp={prod.mrp.integerValue} />
    {/each}
    </div> 
</div>

<!-- Hot Offers  -->

<div>
  <div class="flex justify-between">
    <div class="mt-4 ml-10 bg-red-200 flex w-80 py-2 text-3xl font-semibold pl-2">Hot Offers </div> 
    <div class="mt-4 mr-10 bg-blue-400 flex justify-center w-40 py-2 text-2xl font-semibold pl-2 cursor-pointer" on:click={()=>{goto("/offers")}}>view more</div>
  </div>
  <div class="mx-10 md:grid md:grid-cols-2 lg:grid-cols-4 mt-4 gap-4 mb-4">
    {#each offers as prod}
      <ItemPost src={prod.url.stringValue} name={prod.name.stringValue} deal= {prod.deal.integerValue} mrp={prod.mrp.integerValue} />
    {/each}
    </div> 
</div>

<div class="max-w-7xl mx-auto py-24 px-4  sm:px-6 sm:py-32 lg:px-8">
  <div class="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-0">
    <div class="text-center md:flex md:items-start md:text-left lg:block lg:text-center">
      <div class="md:flex-shrink-0">
        <div class="flow-root">
          <img class="-my-1 h-24 w-auto mx-auto" src="https://tailwindui.com/img/ecommerce/icons/icon-returns-light.svg" alt="">
        </div>
      </div>
      <div class="mt-6 md:mt-0 md:ml-4 lg:mt-6 lg:ml-0">
        <h3 class="text-sm font-semibold tracking-wide uppercase text-gray-900">Free returns</h3>
        <p class="mt-3 text-sm text-gray-500">Not what you expected? Place it back in the parcel and attach the pre-paid postage stamp.</p>
      </div>
    </div>

    <div class="text-center md:flex md:items-start md:text-left lg:block lg:text-center">
      <div class="md:flex-shrink-0">
        <div class="flow-root">
          <img class="-my-1 h-24 w-auto mx-auto" src="https://tailwindui.com/img/ecommerce/icons/icon-calendar-light.svg" alt="">
        </div>
      </div>
      <div class="mt-6 md:mt-0 md:ml-4 lg:mt-6 lg:ml-0">
        <h3 class="text-sm font-semibold tracking-wide uppercase text-gray-900">Same day delivery</h3>
        <p class="mt-3 text-sm text-gray-500">We offer a delivery service that has never been done before. Checkout today and receive your products within hours.</p>
      </div>
    </div>

    <div class="text-center md:flex md:items-start md:text-left lg:block lg:text-center">
      <div class="md:flex-shrink-0">
        <div class="flow-root">
          <img class="-my-1 h-24 w-auto mx-auto" src="https://tailwindui.com/img/ecommerce/icons/icon-gift-card-light.svg" alt="">
        </div>
      </div>
      <div class="mt-6 md:mt-0 md:ml-4 lg:mt-6 lg:ml-0">
        <h3 class="text-sm font-semibold tracking-wide uppercase text-gray-900">2-year warranty</h3>
        <p class="mt-3 text-sm text-gray-500">We have a 2 year warranty with every product that you purchase, you can be sure we'll stand behind it.</p>
      </div>
    </div>

    <div class="text-center md:flex md:items-start md:text-left lg:block lg:text-center">
      <div class="md:flex-shrink-0">
        <div class="flow-root">
          <img class="-my-1 h-24 w-auto mx-auto" src="https://tailwindui.com/img/ecommerce/icons/icon-planet-light.svg" alt="">
        </div>
      </div>
      <div class="mt-6 md:mt-0 md:ml-4 lg:mt-6 lg:ml-0">
        <h3 class="text-sm font-semibold tracking-wide uppercase text-gray-900">For the planet</h3>
        <p class="mt-3 text-sm text-gray-500">We’ve pledged 1% of sales to the preservation and restoration of the natural environment.</p>
      </div>
    </div>
  </div>
</div>

<Footer />

</body>