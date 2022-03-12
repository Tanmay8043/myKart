<script>
    import { goto } from "$app/navigation";
    import { db } from "../firebase"
    import { collection, query, where, getDocs } from "firebase/firestore";
    import { productStore } from "./stores";

    export let src=undefined;
    export let name= undefined;
    export let deal = undefined;
    export let mrp=undefined;

    let prod

    if(name.length>60 ) name=name.substr(0,60)+"...";

    const handleClick=async ()=>{
        const q = query(collection(db, "products"), where("url", "==", src));
        const querySnapshot = getDocs(q);
        await querySnapshot.then(function(result){
            prod = result.docs.map(snap=>snap.data());
            // prod=result.docs[0]._document.data.value.mapValue.fields
            productStore.set(prod[0])
            console.log($productStore);
        }).then(()=>{
            goto("/product")
        })
        // setTimeout(function(){
        //     goto("/product")
        //  }, 1000);
        
    }
</script>

<div class=" flex flex-col h-full items-center justify-center rounded-lg border shadow transition duration-500 ease-in-out transform hover:-translate-y-1 hover:shadow-xl cursor-pointer" on:click={handleClick}>
    <div class="h-3/5">
        <img src={src} class="h-40" alt="items-post" />
    </div>
    <div class="h-1/5 w-full py-20"><p class="px-2 font-semibold text-base">{name}</p></div>
    <div class="relative flex w-full justify-center h-1/5 text-lg px-3 ">
        <div class="flex absolute bottom-0  flex-col justify-center items-center text-2xl font-semibold mt-2">
            <span class="text-sm text-gray-600">M.R.P: <span class=" line-through">₹{mrp}/-</span> </span>
            Deal: ₹{deal}/-
        </div>
    </div>
  
</div>