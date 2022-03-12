<svelte:head>
  <title>{$productStore.name} - myKart</title>
</svelte:head>

<script>
    import Navbar from "../components/Navbar.svelte";
    import Footer from "../components/Footer.svelte";
    import Item from "../components/Item.svelte";
    import {productStore} from "../components/stores"
</script>

<div>
    <Navbar/>
</div>
<div>
   <Item/>
</div>

<Footer />