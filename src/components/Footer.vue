      
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
    <section class="
          d-flex
          justify-content-center justify-content-center
          p-4
          border-bottom
        ">
      <div>
        <h5 class="fw-bold">Encu&eacute;ntranos aqu&iacute;</h5>
      </div>

    </section>
    <!-- Section: Social media -->
    <!-- Section: Links  -->

    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3178.9802565118234!2d-3.5925527243580144!3d37.17694017214213!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd71fcb7a5419363%3A0xc16fafd9a41efead!2sMuseo%20de%20Bellas%20Artes%20de%20Granada!5e0!3m2!1ses!2ses!4v1685098311683!5m2!1ses!2ses"
      height="200" style="border:1;width:100%;" allowfullscreen=""  loading="lazy"
      referrerpolicy="no-referrer-when-downgrade" ></iframe>
    <!-- Section: Social media -->
    <section class="
          d-flex
          justify-content-center justify-content-lg-between
          p-4
          border-bottom
        ">
      <!-- Left -->
      <!-- <div class="me-5 d-none d-lg-block">
        <span>B&uacute;scanos en nuestras redes sociales:</span>
      </div> -->
      <!-- Left -->
      <!-- Right -->
      <div>
        <!-- <a href=""  class="me-4 text-reset">
          <MDBIcon iconStyle="fab" icon="facebook-f">Twitter</MDBIcon>
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
        </a> -->
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
              <i class="fas fa-gem me-3"></i>MuseoGRX
            </h6>
            <p>
              Museo de Bellas Artes de Granada.
            </p>
            <p>Porque el arte es la bonita costumbre de echar a perder todas las costumbres</p>
          </MDBCol>
          <!-- Grid column -->
          <!-- Grid column -->
          <MDBCol md="2" lg="2" xl="2" class="mx-auto mb-4">
            <!-- Links -->
            <h6 class="text-uppercase fw-bold mb-4">Horario</h6>
            <h6 class="fw-bold">Abierto</h6>
        <p>De lunes a sábado de 10:00 h a 20:00 h</p>
        <p>Domingo y festivos de 10:00 h a 19:00 h</p>
        <h6 class="fw-bold">Horario reducido</h6>
        <p>1 y 6 de enero de 10:00 h a 14:00 h</p>
        <p>24, 25 y 31 de diciembre de 10:00 h a 14:00 h</p>

          </MDBCol>
          <!-- Grid column -->
          <!-- Grid column -->
          <MDBCol md="3" lg="2" xl="2" class="mx-auto mb-4">
            <!-- Links -->
            <h6 class="text-uppercase fw-bold mb-4">Informaci&oacute;n</h6>
            <p>
              <RouterLink :to="{name: 'privacidad'}" class="text-reset">Privacidad</RouterLink>
            </p>
            <p>
              <RouterLink :to="{name: 'privacidad'}" class="text-reset">Cookies</RouterLink>
            </p>
            <p>
              <RouterLink :to="{name: 'privacidad'}" class="text-reset">Gesti&oacute;n de datos</RouterLink>
            </p>
          </MDBCol>
          <!-- Grid column -->
          <!-- Grid column -->
          <MDBCol md="4" lg="3" xl="3" class="mx-auto mb-md-0 mb-4">
            <!-- Links -->
            <h6 class="text-uppercase fw-bold mb-4">Contacto</h6>
            <p>
             Granada, España
            </p>
            <p>
              museogrx@gmail.com
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