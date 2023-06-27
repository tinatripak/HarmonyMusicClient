import React from "react";
import { FaTelegram } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";

import "./footerStyles.css";

const Footer = () => {
  return (
    <div className="container w-11/12">
      <div className="row grid grid-cols-4 ml-24">
        <div className="column mr-40">
          <div className="heading harmony-heading">Harmony</div>
          <div className="text-xs">
            Наша місія – показати вам найгарніші українські пісні та дати
            можливість почути усім, яка неймовірна українська музика.
          </div>
        </div>
        <div className="column">
          <div className="heading">Меню</div>
          <a className="footer-link p-0" href="/home">
            Головна
          </a>
          <a className="footer-link" href="/music">
            Музика
          </a>
          <a className="footer-link" href="/albums">
            Альбоми
          </a>
          <a className="footer-link" href="/singers">
            Виконавці
          </a>
          <a className="footer-link" href="/suggest">
            Запропонувати Пісню
          </a>
        </div>
        <div className="column">
          <div className="heading">Подробиці </div>
          <a className="footer-link" href="#">
            Контакти
          </a>
          <a className="footer-link" href="#">
            Підтримка
          </a>
          <a className="footer-link" href="#">
            Про Сайт
          </a>
        </div>
        <div className="column">
          <div className="heading">Соцальні мережі</div>
          <a
            className="footer-link flex items-center gap-3"
            href="https://instagram.com/kristianna_tr"
          >
            <AiFillInstagram size={28} />
            Instagram
          </a>
          <a
            className="footer-link flex items-center gap-3"
            href="https://t.me/kristianna_tr_bot"
          >
            <FaTelegram size={28} />
            Telegram
          </a>
        </div>
      </div>
      <div className="text-center mt-10 mb-4">
        &copy; 2023. All Rights Reserved
      </div>
    </div>
  );
};

export default Footer;
