// @ts-ignore
import { mount } from 'svelte'
import App from './App.svelte'

const app = mount(App, {
  target: document.getElementById('root')!,
})

export default app
