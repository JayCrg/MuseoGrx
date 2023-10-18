<script setup>
import { onMounted } from 'vue';
import { RouterLink, RouterView } from 'vue-router'


</script>

<template>
    <footer>
        <iframe id=mapa
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3178.9802565167042!2d-3.592558088427479!3d37.176940172025965!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd71fcb7a5419363%3A0xc16fafd9a41efead!2sMuseo%20de%20Bellas%20Artes%20de%20Granada!5e0!3m2!1ses!2ses!4v1683545264670!5m2!1ses!2ses"
            style="border:1;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        <section id="info">
            <a href="/" class="logo-inicio">Museo<span class="grx">GRX</span></a>
        </section>
        <section id="horario-apertura">
            <h4>Abierto</h4>
            <p>De lunes a sábado de 10.00 a 20.00 h</p>
            <p>Domingos y festivos de 10.00 a 19.00 h</p>
            <h4>Cerrado</h4>
            <p>1 de enero</p>
            <p>1 de mayo</p>
            <p>25 de diciembre</p>
            <h4>Horario reducido</h4>
            <p>6 de enero</p>
            <p>24 y 31 de diciembre</p>
            <p>De 10.00 a 14.00 h</p>
            <h4>Horario gratuito</h4>
            <p>De lunes a sábado de 18.00 a 20.00 h</p>
            <p>Domingos y festivos de 17.00 a 19.00 h</p>
        </section>
        <section id="expo">

        </section>
        <section id="publi">
            <article class="log">
                <RouterLink to="/login">Login</RouterLink>
            </article>
            <article class="entrada">
                <RouterLink to="/entradas">Entradas</RouterLink>
            </article>
        </section>
        <section id="contacto">
            <nav>
                <ul>
                    <li>
                        <RouterLink to="/aviso-legal">Aviso legal</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/privacidad">Pol&iacute;tica de privacidad</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/cookies">Pol&iacute;tica de cookies</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/finalidad">Finalidad de la p&aacute;gina</RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/contacto">Contacto </RouterLink>
                    </li>
                </ul>
            </nav>
            <p>Copyright &#169; 2023. Juan Carlos Ramírez Guerrero como Proyecto Integrado para Desarrollo de Aplicaciones
                Web. Todos los derechos reservados</p>
        </section>
    </footer>
</template>
