import React from 'react'

export const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-bottom">
                <div className="footer__subcribe-container">
                    <h5 className="footer__title">Подписка на новости</h5>
                    <p className="footer__text">Будьте в курсе наших акций, скидкок и спец.предложений</p>
                    <div className="footer__subcribe">
                        <div className="footer__input-container">
                            <input type="email" className="footer__input" placeholder="Введите свой email" />
                            <p className="footer__input-btn">Подписаться</p>
                        </div>
                        <p className="footer__hidden">
                            На ваш email было отправлено письмо со ссылкой подтверждения подписки
                        </p>
                    </div>
                </div>
                {/* <div className="footer__buy">
                    <p className="footer__buy-text">Принимаем к оплате</p>
                    <div className="footer__img-container">
                        <div className="footer__img">
                            <img className="footer__img-icon" src="./img/visa.svg" alt="visa" />
                        </div>
                        <div className="footer__img">
                            <img className="footer__img-icon" src="./img/mastercard.svg" alt="mastercard" />
                        </div>
                        <div className="footer__img">
                            <img className="footer__img-icon" src="./img/mir.svg" alt="mir" />
                        </div>
                        <div className="footer__img">
                            <img className="footer__img-icon" src="./img/qiwi.svg" alt="qiwi" />
                        </div>
                        <div className="footer__img">
                            <img className="footer__img-icon" src="./img/webmoney.svg" alt="webmoney" />
                        </div>
                        <div className="footer__img">
                            <img className="footer__img-icon" src="./img/yandex-money.svg" alt="yandex-money" />
                        </div>
                    </div>
                </div> */}
            </div>
            <p className="footer__copy">2020 &copy; Интернет-магазин книг.</p>
        </footer>
    )
}
