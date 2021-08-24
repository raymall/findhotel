import { init as initGuestPicker } from './views/index'

/*===============
  VENDORS
===============*/
// import $ from 'jquery';

/*===============
  VIEWS
===============*/
// import './views/index.js';
const logErrors = (err) => {
  console.error(err)
}

initGuestPicker().catch(logErrors)