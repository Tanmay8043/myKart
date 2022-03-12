<svelte:head>
  <title>Your Account - myKart</title>
</svelte:head>

<script>
    import {auth, db} from "../firebase"
    import Navbar from "../components/Navbar.svelte";
    import DeleteModal from "../components/DeleteModal.svelte";
    import Footer from "../components/Footer.svelte";
    import { onAuthStateChanged } from "firebase/auth";
    import { query, orderBy, doc, collection, updateDoc, getDoc, getDocs } from "firebase/firestore";
    import { onMount } from 'svelte';
    import { getAuth, updatePassword, updateEmail, deleteUser } from "firebase/auth";
    import { goto } from "$app/navigation";

    let email;
    let name, emailchange, pwd, cnfmpwd,ref, ref2;
    var showOrders=[]
    onMount(async () => {
		onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log(user);
            const uid = user.uid;
            email=user.email;            
            ref=doc(db, "users",email );
            ref2=collection(db, "users");
            getDocs(ref2).then(function(result){
               console.log(result); 
            });
            const docSnap = getDoc(ref);
            docSnap.then(function(result){
                name=result._document.data.value.mapValue.fields.name.stringValue;
                document.getElementById("myEmail").value=email
                document.getElementById("myName").value=name;
            });
            const q=query(collection(db, "users", email, "orders"), orderBy("orderedAt", "desc"))
            const querySnapshot = getDocs(q);
            querySnapshot.then(function (result){
                showOrders= result.docs.map(snap=>snap.data());
                console.log(showOrders);
            });
        }
        });
         
	});

    const handleUpdate=async()=>{
        await updateDoc(ref, {
            name: name
        });

        if(pwd == cnfmpwd){
            updatePassword(auth.currentUser, pwd).then(() => {
            }).catch((error) => {
                alert(error);
            });
        }else if(pwd == null || cnfmpwd == null || pwd != cnfmpwd){
            alert("Please check your password!")
        }

    };
    
    const handleDelete=()=>{
        var el =document.getElementById("showModal");
        el.classList.toggle("hidden")
    };

    const del=()=>{
        deleteUser(auth.currentUser).then(() => {
            window.location="http://localhost:3000/"
        }).catch((error) => {
            alert(error)
        });
    };

    const changeDate=(d)=>{
        var options = {year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(d.seconds*1000).toLocaleString("en-US", options );
    }

</script>

<Navbar/>
<DeleteModal deleteAcc={del} show={handleDelete}/>
<div class="lg:grid grid-cols-5 gap-6 mt-16 px-2 md:px-10">
    <div class="col-span-2 mb-8">
        <div class="flex justify-center">
            <h1 class="text-3xl text-gray-700">USER PROFILE</h1>
        </div>
                    <!-- svelte-ignore a11y-label-has-associated-control -->
        <form class="px-2">
            <div class= "mt-4 flex flex-col justify-center">                
                <label class="text-lg text-gray-500">Name</label>
                <input id="myName" type="text" class="bg-gray-200 p-2" bind:value={name} />
            </div>
            <div class= "mt-4 flex flex-col justify-center">
                <label class="text-lg text-gray-500">Email</label>
                <input id="myEmail" type="email" class="bg-gray-200 p-2 text-gray-500 cursor-not-allowed " disabled />
            </div>
            <div class= "mt-4 flex flex-col justify-center">
                <label class="text-lg text-gray-500">New Password</label>
                <input type="password" class="bg-gray-200 p-2" bind:value={pwd} />
            </div>
            <div class= "mt-4 flex flex-col justify-center">
                <label class="text-lg text-gray-500">Confirm your new password</label>
                <input type="password" class="bg-gray-200 p-2" bind:value={cnfmpwd} />
            </div>
            <div class="flex justify-evenly gap-4 mt-6">
                <button class="bg-white text-gray-600 font-semibold outline hover:bg-gray-900 hover:text-white px-4 py-2 rounded shadow-lg w-full  " on:click|preventDefault={handleUpdate}>UPDATE</button>
                <button class="bg-white text-gray-600 font-semibold outline hover:bg-red-900 hover:text-white px-4 py-2 rounded shadow-lg  w-full " on:click|preventDefault={handleDelete}>DELETE MY ACCOUNT</button>
            </div>
        </form>
    </div>
    <div class="col-span-3  h-full mb-8">
        <div class="flex justify-center">
            <h1 class="text-3xl text-gray-700">MY ORDERS</h1>
        </div>
        <div class="flex flex-col mt-8 bg-gray-100">
          <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-100">
                    <tr>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order-ID</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Placed</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivered</th>
                    </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        {#each showOrders as order}
                        <tr class="hover:bg-gray-50">
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600"><a href='/order/{order.order_id}'>{order.order_id}</a></td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{changeDate(order.orderedAt)}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{order.totalPrice}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><img src="src\images\accept.png" alt="" /></td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><img class="w-4 h-4" src="src\images\remove.png" alt="" /></td>
                        </tr>
                        {/each}
                    </tbody>
                </table>
                </div>
            </div>
            </div>
        </div>
  
    </div>
</div>
<div class="absolute lg:bottom-0 w-full">
  <Footer/>
</div>