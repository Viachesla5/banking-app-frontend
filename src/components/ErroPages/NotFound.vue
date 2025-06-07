<template>
  <section class="page_404 d-flex justify-content-center">
    <div class="container mt-3">
      <div class="row">
        <div class="col-sm-12">
          <div class="col-sm-10 col-sm-offset-1 text-center">
            <div class="four_zero_four_bg">
              <h1 class="text-center">404</h1>
            </div>
            <br /><br /><br />
            <div class="contant_box_404">
              <h3 class="h2">Look like you're lost</h3>
              <h2>The page you are looking for is not available!</h2>
              <button class="btn btn-primary" @click="$router.push('/')">
                Go to Home
              </button>
              <button class="btn btn-success" @click="$router.push('/login')">
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "../../Axios-auth";
import "../../assets/main.css";
</script>

<style scoped>
.container {
  height: 100vh;
  margin-right: 10%;
}

.page_404 {
  padding: 10px 0;
  background: #fff;
  font-family: "Arvo", serif;
}

.four_zero_four_bg {
  background-image: url(https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWpxY25hYmtuZzRkOG56Yjc3d2FvZ2VwM3RnaWNibXo1cnQ1dXV4eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xTiN0L7EW5trfOvEk0/giphy.gif);
  height: 400px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}

.four_zero_four_bg h1 {
  font-size: 80px;
}

.four_zero_four_bg h3 {
  font-size: 80px;
}

.link_404 {
  color: #fff !important;
  padding: 10px 20px;
  background: #39ac31;
  margin: 20px 0;
  display: inline-block;
}

.contant_box_404 {
  margin-top: -50px;
}
</style>
