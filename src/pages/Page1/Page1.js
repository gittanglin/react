import React, {Component} from 'react';


import style from  './Page1.scss';
import image from './images/logo.png';


export default class Page1 extends Component {
  render() {
    return (
      <div className={style.page}>
        this is Page1~


        <img src={image}/>
      </div>
    )
  }
}
