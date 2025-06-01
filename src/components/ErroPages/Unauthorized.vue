<template>
  <section class="page_401 d-flex justify-content-center">
    <div class="container mt-5">
      <div class="row">
        <div class="col-sm-12">
          <div class="col-sm-10 col-sm-offset-1 text-center">
            <div class="unauthorized_bg">
              <h1 class="text-center">401</h1>
            </div>
            <div class="contant_box_401">
              <h3 class="h2">Unauthorized Access</h3>
              <h2>You do not have permission to view this page.</h2>
              <button class="btn btn-warning" @click="$router.push('/')">
                Go to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import "../../assets/main.css";
import axios from "../../Axios-auth";
</script>

<style scoped>
.container {
  height: 100vh;
  margin-right: 10%;
}

.page_401 {
  padding: 40px 0;
  background: #fff;
  font-family: "Arvo", serif;
}

.unauthorized_bg {
  background-image: url(https://cdn.dribbble.com/users/285475/screenshots/2083086/media/5d2dfca2ef3b1d7f6631a29e947da75c.gif);
  height: 400px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}

.unauthorized_bg h1 {
  font-size: 80px;
}

.contant_box_401 {
  margin-top: -50px;
}
</style>
