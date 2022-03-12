<svelte:head>
  <title>SignUp - myKart</title>
</svelte:head>

<script>
    import { auth, db, googleProvider } from "../firebase";
    import { createUserWithEmailAndPassword, updateProfile, getIdToken, } from "firebase/auth";
    import {doc, collection, setDoc, addDoc } from "firebase/firestore";
    import Footer from "../components/Footer.svelte";
    import { goto } from '$app/navigation';
    import { request } from "../fetch.js"

    let name, username, password, cnfmpassword;
    let show_password = false;
    $: type = show_password ? 'text' : 'password'
    let value = '', cvalue="";
        
    function onInput (event) {
        value = event.target.value;
        password=value;
    }
    function onCInput (event) {
        cvalue=event.target.value;
        cnfmpassword=cvalue;
    }   

    const handleClick =async ()=>{
    if(password==cnfmpassword){
        const userRecord = await createUserWithEmailAndPassword(auth, username, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
             updateProfile(userCredential.user, { displayName: username });
            const idToken = getIdToken(userCredential.user, true);
             request("/auth", "POST", { idToken });
           
            console.log("user created");
            
            try {
                setDoc(doc(db, "users", user.email), {
                    uid: user.uid,
                    email: user.email,
                    name:name
                });
                goto("http://localhost:3000/login");
            } 
            catch (e) {
                console.error("Error adding document: ", e);
            }
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage);
        });
    }else if(password == null || cnfmpassword ==null || password != cnfmpassword){
        alert("Please Check: Either Password fields are empty or passwords do not match.")
    }
        
    }
</script>

<div class="h-screen bg-gradient-to-tl from-white to-indigo-900 w-full pt-2 px-4">
    <div class="flex flex-col items-center justify-center">
        <div class="bg-white shadow rounded lg:w-1/3  md:w-1/2 w-full p-10 mt-8 mb-4">
            <p class="focus:outline-none text-2xl font-extrabold leading-6 text-gray-800">Create your account</p>
            <p class="focus:outline-none text-sm mt-4 font-medium leading-none text-gray-500">Already have a account? <a href="http://localhost:3000/login"   class="hover:text-gray-500 focus:text-gray-500 focus:outline-none focus:underline hover:underline text-sm font-medium leading-none  text-gray-800 cursor-pointer"> Sign in here</a></p>
            <div class="mt-8 border p-4 rounded">
                <div>
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="text-sm font-medium leading-none text-gray-800">
                        Your Name
                    </label>
                    <input type="text" bind:value={name} class="bg-gray-200 border rounded  text-xs font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2"/>
                </div>
                <div>
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label id="email" class="text-sm font-medium leading-none text-gray-800">
                        Email
                    </label>
                    <input type="email" bind:value={username} class="bg-gray-200 border rounded  text-xs font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2"/>
                </div>
                <div class=" w-full">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="text-sm font-medium leading-none text-gray-800">
                        Password
                    </label>
                   <div class="relative flex items-center justify-center">
                    <input { type } { value } on:input={ onInput }  class="bg-gray-200 border rounded  text-xs font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2"/>
                    </div>
                </div>
                <div class=" w-full">
                    <!-- svelte-ignore a11y-label-has-associated-control -->

                    <label class="text-sm font-medium leading-none text-gray-800">
                        Confirm Password
                    </label>
                    <div class="relative flex items-center justify-center">
                    <input { type } { cvalue } on:input={ onCInput } class="bg-gray-200 border rounded  text-xs font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2"/>
                    <div class="absolute right-0 mt-2 mr-3 cursor-pointer" on:click={ () => show_password = !show_password }>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.99978 2C11.5944 2 14.5851 4.58667 15.2124 8C14.5858 11.4133 11.5944 14 7.99978 14C4.40511 14 1.41444 11.4133 0.787109 8C1.41378 4.58667 4.40511 2 7.99978 2ZM7.99978 12.6667C9.35942 12.6664 10.6787 12.2045 11.7417 11.3568C12.8047 10.509 13.5484 9.32552 13.8511 8C13.5473 6.67554 12.8031 5.49334 11.7402 4.64668C10.6773 3.80003 9.35864 3.33902 7.99978 3.33902C6.64091 3.33902 5.32224 3.80003 4.25936 4.64668C3.19648 5.49334 2.45229 6.67554 2.14844 8C2.45117 9.32552 3.19489 10.509 4.25787 11.3568C5.32085 12.2045 6.64013 12.6664 7.99978 12.6667ZM7.99978 11C7.20413 11 6.44106 10.6839 5.87846 10.1213C5.31585 9.55871 4.99978 8.79565 4.99978 8C4.99978 7.20435 5.31585 6.44129 5.87846 5.87868C6.44106 5.31607 7.20413 5 7.99978 5C8.79543 5 9.55849 5.31607 10.1211 5.87868C10.6837 6.44129 10.9998 7.20435 10.9998 8C10.9998 8.79565 10.6837 9.55871 10.1211 10.1213C9.55849 10.6839 8.79543 11 7.99978 11ZM7.99978 9.66667C8.4418 9.66667 8.86573 9.49107 9.17829 9.17851C9.49085 8.86595 9.66644 8.44203 9.66644 8C9.66644 7.55797 9.49085 7.13405 9.17829 6.82149C8.86573 6.50893 8.4418 6.33333 7.99978 6.33333C7.55775 6.33333 7.13383 6.50893 6.82126 6.82149C6.5087 7.13405 6.33311 7.55797 6.33311 8C6.33311 8.44203 6.5087 8.86595 6.82126 9.17851C7.13383 9.49107 7.55775 9.66667 7.99978 9.66667Z" fill="#71717A"/>
                        </svg>
                    </div>
                   </div>
                </div>  
                <div class="mt-8">
                    <button on:click={handleClick} class="focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 text-sm font-semibold leading-none text-white focus:outline-none bg-indigo-700 border rounded hover:bg-indigo-600 py-4 w-full">Create my account</button>
                </div>
        </div>
    </div>
    </div>
</div>
<div class="absolute bottom-0 w-full">
    <Footer/>
</div>

<style>
</style>