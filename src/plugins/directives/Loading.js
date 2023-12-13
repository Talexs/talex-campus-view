import LoadingIcon from '~/components/common/icon/LoadingIcon.vue'
import { createApp } from 'vue'

const loadingDirective = {
    mounted(el) {
        const wrapper = document.createElement('div')

        wrapper.className = 'LoadingWrapper transition-cubic'

        const app = createApp(LoadingIcon)

        el.appendChild(wrapper);

        el._t_loading = {
            app, wrapper
        }

        wrapper.style.opacity = '0'
        wrapper.style.pointerEvents = "none";
        app.mount(wrapper)
    },
    beforeUpdate(el, binding) {

        const { wrapper, timer } = el._t_loading

        clearTimeout(timer)

        if( binding.value ) {

            el._t_loading.timer = setTimeout(() => {

                wrapper.style.opacity = '.75'
                wrapper.style.pointerEvents = ''

            }, 200)

        } else {

            wrapper.style.opacity = "0";
            wrapper.style.pointerEvents = "none";

        }

    }
}

export default loadingDirective
