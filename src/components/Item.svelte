<script>
    import { cartStore } from "./stores";
    import {auth, db} from "../firebase"
    import { session } from "$app/stores";
    import {productStore} from "./stores";
    import {doc, query, collection, setDoc, addDoc,  getDocs,getDoc, orderBy } from "firebase/firestore";
    import { onMount } from 'svelte';
    import {reviewStore} from "./stores";
    import { goto } from "$app/navigation";

    var reviews=[], user
    onMount(async()=>{
        if($productStore.status != "in-stock"){
            var el =document.getElementById("addBtn")
            el.disabled= true;
            el.classList.add("cursor-not-allowed")
        }
        const q1 = collection(db, "/products/",$productStore.id, "/reviews");
        const q = query(q1, orderBy("sentAt", "asc"));
        const docSnap = await getDoc(doc(db, "users", $session.user.email));
        user=docSnap.data().name;
        console.log(user);     
        const querySnapshot = getDocs(q);
        querySnapshot.then(function (result){
            reviews = result.docs.map(snap=>snap.data());
            reviewStore.set(reviews)
        });
    });

    let rating, comment
    console.log($productStore);
    let r= parseInt($productStore.rating)
    let opts={
        1:"1 Star - Poor",
        2:"2 Star - Fair",
        3:"3 Star - Good",
        4:"4 Star - Very Good",
        5:"5 Star - Excellent"
    }
    
    const handlePost=async ()=>{        
        let post={
            user,
            rating, 
            comment, 
            sentAt: +new Date()
        }
        if($session.user.email){
            $reviewStore = [...$reviewStore,post];
        try {
            await addDoc(collection(db, "/products/",$productStore.id, "/reviews"), post);
        } catch (error) {
            console.error("Error adding document: ", error);
        };
        comment=""
        }else{
            alert("Please Login!")
        }
        
    }

    let count = 1;
	$: if(count<1){
		count=1
	}
 let save =parseFloat($productStore.mrp)-parseFloat($productStore.deal);
    let offer= Math.round(save*100/parseFloat($productStore.mrp));
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    }
     
    let color= ($productStore.status == "in-stock") ? "bg-green-600 w-20" : "bg-red-600 w-28"

    const handleCart=(prod)=>{
        for(let item of $cartStore){            
            if(prod.name=== item.name){
                prod.quantity=parseInt(count)+parseInt(prod.quantity);
                count= parseInt(prod.quantity);
                $cartStore=$cartStore
                return;
            }
        }
        $productStore.quantity=count
        $cartStore = [...$cartStore,$productStore];
    }
</script>

<div>
    <div class="grid grid-cols-1 md:grid-cols-2 mx-8">
        <div class="flex mt-16 justify-center items-start">
            <img src={$productStore.url} class="h-80" alt="product" />
        </div> 
        <div class="pt-10">
            <p class="text-4xl my-4">{$productStore.name}</p>
            <div class="flex" id="rating">
            {#each {length: r} as _,i}
                    <img src="https://img.icons8.com/fluency/24/000000/star.png" alt="" />
                {/each}
            </div>
        <div class="{color} mt-2 flex justify-center rounded text-white font-semibold">{$productStore.status}</div>
            <div class="ml-4 mt-8">
                <p class="text-gray-500">M.R.P: <span class=" line-through">₹{($productStore.mrp)}/-</span></p>
                <p class="text-lg">Deal: <span class="text-3xl font-semibold"> ₹{($productStore.deal)}/-</span></p>
                <p class="text-lg">You save ₹{(save)}/- ({offer}%) Inclusive of all taxes</p>
            </div>
            <div class="mt-6 ml-4">
                <p class="text-xl font-semibold">About the product</p>
                <p class="">{$productStore.desc}</p>
            </div>
        </div> 
    </div>
    <div class="flex flex-col items-center pt-10">
        <div class="pb-4">
            <p class="inline-block">No. of pieces: </p>
            <button class="bg-gray-100 px-4" on:click={() => count -= 1}>-</button>
            <span>{ count }</span>
            <button class="bg-gray-100 px-4" on:click={() => count += 1}>+</button>    
        </div>
        <div>
            <button id="addBtn" on:click={()=>{handleCart($productStore)}} class="bg-yellow-300 px-4 py-2 mx-2 rounded-md hover:bg-yellow-400 hover:shadow-md font-bold">Add to cart</button>
            <button on:click={()=>{goto("/cart")}} class="bg-yellow-300 px-4 py-2 mx-2 rounded-md hover:bg-yellow-400 hover:shadow-md font-bold">Go to Cart</button>
        </div>
        
    </div>

   <!--  Reviews Section -->

    <div class="bg-white">
    <div class="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:py-32 lg:px-8 lg:grid lg:grid-cols-12 lg:gap-x-8">
      <div class="lg:col-span-4">
        <h2 class="text-2xl font-extrabold tracking-tight text-gray-900">Customer Reviews</h2>
  
        <div class="mt-3 flex items-center">
          <div>
            <div class="flex items-center">
                {#each {length: r} as _,i}
                    <svg class="flex-shrink-0 h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                {/each}
                {#each {length: 5-r} as _,i}
                    <svg class="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                {/each}
              </div>
          </div>
          <p class="ml-2 text-sm text-gray-900">Based on {$productStore.numrev} reviews</p>
        </div>
        <div class="mt-10">
          <h3 class="text-lg font-medium text-gray-900">Share your thoughts</h3>
          <p class="mt-1 text-sm text-gray-600">If you've used this product, share your thoughts with other customers.</p>
          <form class="px-2 py-3 shadow w-full rounded-lg">
            <label for="rating" class="text-gray-700">Rating:</label>
            <select id="rating" bind:value={rating} class="w-full mt-1 rounded-md border border-gray-300 py-1.5 text-base leading-5 font-medium text-gray-700 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 sm:text-sm">
                {#each Object.entries(opts) as [id, value]}
                    <option class="py-2" value={id}>
                        {value}
                    </option>
                {/each}
            </select>
            <div class="mt-4">
                <label for="comment" class=" text-gray-700">Add your comment:</label>
                <div class="mt-1">
                    <textarea rows="4" name="comment" id="comment" bind:value={comment} class="shadow-sm focus:ring-gray-500 focus:border-gray-500 block w-full sm:text-sm border-gray-300 rounded-md"></textarea>
                </div>
            </div>
            <div class="flex justify-center">
                <button on:click|preventDefault={handlePost} class="bg-blue-600 px-4 py-1.5 mt-4 rounded text-white hover:bg-blue-500">Post</button>    
            </div>
          </form>
          </div>
      </div>
  
      <div class="mt-16 lg:mt-0 lg:col-start-6 lg:col-span-7">
        <h3 class="text-2xl font-bold tracking-tight text-gray-900">Recent Reviews</h3>
        <div class="mt-10 flow-root">
          <div class="divide-y max-h-96 overflow-auto divide-gray-200">
            {#each $reviewStore as review }
            <div class="py-4 pl-4 bg-gray-50 shadow">
              <div class="flex items-center">
                <div class="">
                  <h4 class="text-sm font-bold text-gray-900">{review.user}</h4>
                  <div class="mt-1 flex items-center">
                    {#each {length: parseInt(review.rating)} as _,i}
                        <svg class="flex-shrink-0 h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    {/each}
                    {#each {length: 5-parseInt(review.rating)} as _,i}
                        <svg class="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    {/each}
                  </div>
                </div>
              </div>
              <div class="mt-4 space-y-6 text-base italic text-gray-600">
                <p>{review.comment}</p>
              </div>
            </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
</div>

</div>