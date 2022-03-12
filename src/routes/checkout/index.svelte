<svelte:head>
  <title>Checkout - myKart</title>
</svelte:head>

<script>
    import {onMount} from "svelte";
    import { auth, db, googleProvider } from "../../firebase";
    import { session } from "$app/stores";
    import {doc, collection, setDoc, addDoc, serverTimestamp } from "firebase/firestore";
    import Navbar from "../../components/Navbar.svelte";
    import Footer from "../../components/Footer.svelte";
    import { goto } from "$app/navigation";
    import { cartStore } from "../../components/stores";


  let order={}
  let email
  let address, city, code, country, payment
    onMount(async()=>{
      if(!$session.user.email){
        goto("/login")
      }
      let tabsContainer = document.querySelector("#tabs");
      let tabTogglers = tabsContainer.querySelectorAll("a");
      tabTogglers.forEach(function(toggler) {
        toggler.addEventListener("click", function(e) {
          e.preventDefault();

          let tabName = this.getAttribute("href");

          let tabContents = document.querySelector("#tab-contents");

          for (let i = 0; i < tabContents.children.length; i++) {

              tabTogglers[i].parentElement.classList.remove("border-blue-400", "border-b",  "-mb-px", "opacity-100");  tabContents.children[i].classList.remove("hidden");
              if ("#" + tabContents.children[i].id === tabName) {
                  continue;
              }
              tabContents.children[i].classList.add("hidden");

          }
        e.target.parentElement.classList.add("border-blue-400", "border-b-4", "-mb-px", "opacity-100");
        });
      });

      document.getElementById("default-tab").click();

      })

    const handleShip=()=>{
      var el =document.getElementById("second");
      el.classList.remove("pointer-events-none")
      el.click();
      order={
        "shippingAddress":{
          address,city, code, country
        }        
      }
    };
    console.log($cartStore);
    $: total = $cartStore.reduce((sum, item) => sum + item.deal * item.quantity, 0)
    $: tax=Math.round(0.07*total * 100) / 100
    
    const handlePay=()=>{
      
      order={...order, 
        payment,
        "orderItems":$cartStore,
        "itemsPrice": total,
        "taxPrice": tax,
        "shippingPrice":0,
        "totalPrice": total+tax 
      }
      console.log(order);
      const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(order)
      };

      fetch('/checkout/checkout', options)
      .then(res => res.json())
      .then(function(data){
        const opts= {...data, 
          "handler": function (response){
            $cartStore=[];
            order={...order,
              "order_id":response.razorpay_order_id,
              "payment_id": response.razorpay_payment_id,
              "signature": response.razorpay_signature,
              "orderedAt": serverTimestamp()
            }
            try {
              setDoc(doc(db, "users", $session.user.email, "orders",response.razorpay_order_id), order);
            } 
            catch (e) {
              console.error("Error adding document: ", e);
            };
            var a="/order/"+ response.razorpay_order_id
            setTimeout(() => {
              goto(a)
            }, 1000);
           }}
        var rzp1 = new Razorpay(opts);
        rzp1.open();
        
        rzp1.on('payment.failed', function (response){
          alert(response.error.code);
          alert(response.error.description);
          alert(response.error.source);
          alert(response.error.step);
          alert(response.error.reason);
          alert(response.error.metadata.order_id);
          alert(response.error.metadata.payment_id);
        });
      })
      .catch(error => console.error(error))
    };
   
</script>
<Navbar/>
<div class="w-full md:w-3/5 mx-auto mt-4  rounded">
    <!-- Tabs -->
    
    <ul id="tabs" class=" rounded-t-lg inline-flex justify-evenly w-full bg-gray-200 px-1 pt-2 ">
      <li class="px-4 py-2 -mb-px font-semibold text-gray-800 border-b-4 border-blue-400 rounded-t opacity-50 "><a id="default-tab" href="#first">Shipping</a></li>
      <li class="px-4 py-2 font-semibold text-gray-800 rounded-t opacity-50 "><a id="second" class="pointer-events-none" href="#second">Payment</a></li>
    </ul>


    <!-- Tab Contents -->
    <div id="tab-contents">
      <div id="first" class="hidden">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <form class="h-4/5 p-4 rounded-b-xl shadow-lg">
          <div class="text-3xl px-4 font-semibold">SHIPPING</div>
            <div class="pt-4 px-4">
              <label class="text-sm font-medium leading-none text-gray-800">Address</label>
              <input type="text" bind:value={address} class="bg-gray-200 border rounded  text-xs font-medium leading-none text-gray-800 px-2 py-3 w-full mt-2 mb-1"/>            
            </div>
            <div class="mt-2 px-4">
              <label class="text-sm font-medium leading-none text-gray-800">City</label>
              <input type="text" bind:value={city} class="bg-gray-200 border rounded  text-xs font-medium leading-none text-gray-800 px-2 py-3 w-full mt-2 mb-1"/>            
            </div>
            <div class="mt-2 px-4">
              <label class="text-sm font-medium leading-none text-gray-800">Postal Code</label>
              <input type="text" bind:value={code} class="bg-gray-200 border rounded  text-xs font-medium leading-none text-gray-800 px-2 py-3 w-full mt-2 mb-1"/>            
            </div>
            <div class="mt-2 px-4">
              <label class="text-sm font-medium leading-none text-gray-800">Country</label>
              <input type="text" bind:value={country} class="bg-gray-200 border rounded  text-xs font-medium leading-none text-gray-800 px-2 py-3 w-full mt-2 mb-1"/>            
            </div>
            <div class="flex justify-center mt-16">
              <button on:click|preventDefault={handleShip} class="px-4 py-2 rounded outline font-semibold text-gray-600 hover:bg-gray-600 hover:text-white">SUBMIT</button>  
            </div>
        </form>
      </div>
      <div id="second" class="hidden">
        <div class="h-4/5 p-4 rounded-b-xl shadow-lg">
          <div>PAYMENT</div>
          <div class="mt-8 border rounded-lg shadow-sm mx-4 px-4">
            <div class="py-3  text-xl text-gray-600">
              Choose payment method:  
            </div>
            <div class=" mr-4 mb-4">
              <input id="radio2" type="radio" bind:group={payment} value="credit-card(Razorpay)" name="radio" class="hidden" />
              <label for="radio2" class="flex items-center cursor-pointer">
              <span class="w-4 h-4 inline-block mr-1 rounded-full border border-grey"></span>
              Credit Card</label>
              <button on:click|preventDefault={handlePay} class="px-4 mt-4 py-2 rounded outline font-semibold text-gray-600 hover:bg-gray-600 hover:text-white">Pay with Razorpay</button>  
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

<div class="absolute bottom-0 w-full">
  <Footer/>
</div>

 <style>
    
input[type="radio"] + label span {
    transition: background .2s,
      transform .2s;
}

input[type="radio"] + label span:hover,
input[type="radio"] + label:hover span{
  transform: scale(1.2);
} 

input[type="radio"]:checked + label span {
  background-color: #3490DC;
  box-shadow: 0px 0px 0px 2px white inset;
}

input[type="radio"]:checked + label{
   color: #3490DC; 
}

  </style>   