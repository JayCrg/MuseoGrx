      
<script setup>
import {
  MDBFooter,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon
} from 'mdb-vue-ui-kit';
</script>
<template>
  <!-- Footer -->
  <MDBFooter :text="['center', 'lg-start', 'muted']">
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3178.9802565118234!2d-3.5925527243580144!3d37.17694017214213!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd71fcb7a5419363%3A0xc16fafd9a41efead!2sMuseo%20de%20Bellas%20Artes%20de%20Granada!5e0!3m2!1ses!2ses!4v1685098311683!5m2!1ses!2ses"
      height="200" style="border:1;width:100%;" allowfullscreen=""  loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"></iframe>
    <!-- Section: Social media -->
    <section class="
          d-flex
          justify-content-center justify-content-lg-between
          p-4
          border-bottom
        ">
      <!-- Left -->
      <div class="me-5 d-none d-lg-block">
        <span>Get connected with us on social networks:</span>
      </div>
      <!-- Left -->
      <!-- Right -->
      <div>
        <a href="" class="me-4 text-reset">
          <MDBIcon iconStyle="fab" icon="facebook-f"></MDBIcon>
        </a>
        <a href="" class="me-4 text-reset">
          <MDBIcon iconStyle="fab" icon="twitter"></MDBIcon>
        </a>
        <a href="" class="me-4 text-reset">
          <MDBIcon iconStyle="fab" icon="google"></MDBIcon>
        </a>
        <a href="" class="me-4 text-reset">
          <MDBIcon iconStyle="fab" icon="instagram"></MDBIcon>
        </a>
        <a href="" class="me-4 text-reset">
          <MDBIcon iconStyle="fab" icon="linkedin"></MDBIcon>
        </a>
        <a href="" class="me-4 text-reset">
          <MDBIcon iconStyle="fab" icon="github"></MDBIcon>
        </a>
      </div>
      <!-- Right -->
    </section>
    <!-- Section: Social media -->
    <!-- Section: Links  -->
    <section class="">
      <MDBContainer class="text-center text-md-start mt-5">
        <!-- Grid row -->
        <MDBRow class="mt-3">
          <!-- Grid column -->
          <MDBCol md="3" lg="4" xl="3" class="mx-auto mb-4">
            <!-- Content -->
            <h6 class="text-uppercase fw-bold mb-4">
              <i class="fas fa-gem me-3"></i>Company name
            </h6>
            <p>
              Here you can use rows and columns to organize your footer
              content. Lorem ipsum dolor sit amet, consectetur
              adipisicing elit.
            </p>
          </MDBCol>
          <!-- Grid column -->
          <!-- Grid column -->
          <MDBCol md="2" lg="2" xl="2" class="mx-auto mb-4">
            <!-- Links -->
            <h6 class="text-uppercase fw-bold mb-4">Products</h6>
            <p>
              <a href="#!" class="text-reset">Angular</a>
            </p>
            <p>
              <a href="#!" class="text-reset">React</a>
            </p>
            <p>
              <a href="#!" class="text-reset">Vue</a>
            </p>
            <p>
              <a href="#!" class="text-reset">Laravel</a>
            </p>
          </MDBCol>
          <!-- Grid column -->
          <!-- Grid column -->
          <MDBCol md="3" lg="2" xl="2" class="mx-auto mb-4">
            <!-- Links -->
            <h6 class="text-uppercase fw-bold mb-4">Useful links</h6>
            <p>
              <a href="#!" class="text-reset">Pricing</a>
            </p>
            <p>
              <a href="#!" class="text-reset">Settings</a>
            </p>
            <p>
              <a href="#!" class="text-reset">Orders</a>
            </p>
            <p>
              <a href="#!" class="text-reset">Help</a>
            </p>
          </MDBCol>
          <!-- Grid column -->
          <!-- Grid column -->
          <MDBCol md="4" lg="3" xl="3" class="mx-auto mb-md-0 mb-4">
            <!-- Links -->
            <h6 class="text-uppercase fw-bold mb-4">Contact</h6>
            <p>
              <i class="fas fa-home me-3"></i> New York, NY 10012, US
            </p>
            <p>
              <i class="fas fa-envelope me-3"></i>
              info@example.com
            </p>
            <p>
              <MDBIcon icon="phone" class="me-3" /> + 01 234 567 88
            </p>
            <p>
              <MDBIcon icon="print" class="me-3" /> + 01 234 567 89
            </p>
          </MDBCol>
          <!-- Grid column -->
        </MDBRow>
        <!-- Grid row -->
      </MDBContainer>
    </section>
    <!-- Section: Links  -->
    <!-- Copyright -->
    <div class="text-center p-4" style="background-color: rgba(0, 0, 0, 0.05)">
     Proyecto Integrado © 2023 Copyright:
      <a class="text-reset fw-bold" href="https://github.com/JayCrg/" target="_blank">Juan Carlos Ramirez Guerrero</a>
    </div>
    <!-- Copyright -->
  </MDBFooter>
  <!-- Footer -->
</template>

<style>
#mapa {
  width: 100%;
}</style>