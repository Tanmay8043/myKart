<svelte:head>
  <title>Offers - myKart</title>
</svelte:head>

<script>
    import { auth, db } from "../firebase";
    import { query, collection, getDocs, orderBy } from "firebase/firestore";
    import ItemPost from "../components/itemPost.svelte";
    import Navbar from "../components/Navbar.svelte";
    import Footer from "../components/Footer.svelte"; 
    import { onAuthStateChanged } from "firebase/auth";
  import { onMount } from 'svelte';

  let email=undefined;
  const showProducts=[]
  onMount(async () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
          console.log(user);
          const uid = user.uid;
          email=user.email;
          // ...
        } else {
          // User is signed out
          // ...
        }
      });
      const ref = collection(db,"products/","hot offers/","offers/");
      const querySnapshot = getDocs(ref);
        querySnapshot.then(function (result){
            for (let index = 0, count=0; index < result.docs.length; index++) {
                if( result.docs[index]._document.data.value.mapValue.fields != undefined){
                    showProducts[count]=result.docs[index]._document.data.value.mapValue.fields;
                    count++;
                }
                
            }
        });
  });
</script>
<Navbar />
<div class="mb-4">
  <div class="mx-10 md:grid md:grid-cols-2 lg:grid-cols-4 mt-4 gap-4">
    {#each showProducts as prod}
      <ItemPost src={prod.url.stringValue} name={prod.name.stringValue} deal= {prod.deal.integerValue} mrp={prod.mrp.integerValue} />
    {/each}
    </div> 
</div>

<Footer />