<script setup>

</script>

<template>
    <div class="container-fluid row mx-0 ps-3">
        <div id="carouselExampleControls" class="carousel slide col-10 offset-1 my-5 border border-1 px-0 border-dark" data-bs-ride="carousel">
            <div class="carousel-inner">
                <div class="carousel-item active">
                    <img src="../../public/image/banner/banner1.jpg" class="d-block w-100" alt="image1">
                </div>
                <div class="carousel-item">
                    <img src="../../public/image/banner/banner2.jpg" class="d-block w-100" alt="image2">
                </div>
                <div class="carousel-item">
                    <img src="../../public/image/banner/banner3.jpg" class="d-block w-100" alt="image3">
                </div>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>  
    </div>
</template>

<style scoped>
img{
    height: 60vh;
}

@media only screen and (max-width: 992px) {
    img{
        height: 50vh;
    }
}
</style>