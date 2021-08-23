import { init as initRoomBuilder } from './views/index'

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

initRoomBuilder().catch(logErrors)