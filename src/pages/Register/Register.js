import { Fragment, useState } from 'react';
import className from 'classnames/bind';
import axios from 'axios';
import styles from './Register.module.scss';
import { useNavigate, Link } from 'react-router-dom';
import images from '~/assets/images/images';

const cx = className.bind(styles);

function Register() {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const navigate = useNavigate();

    const handleSubmit = () => {
        axios
            .post('http://localhost:9000/register/', {
                username,
                password,
                email,
            })
            .then(function (response) {
                console.log(response)
                navigate('/');
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    return (
        <Fragment>
            <div className={cx('modal', 'js-modal-register')}>
                <div className={cx('modal__overlay')}>
                    <img src={images.f8Login} alt="" />
                </div>
                <div className={cx('modal__body')}>
                    <div className={cx('auth-form ')}>
                        <div className={cx('auth-form__container', 'js-modal-container')}>
                            <div className={cx('auth-form__header')}>
                                <h3 className={cx('auth-form__heading')}>Đăng ký</h3>
                                <Link to={'/login'} className={cx('auth-form__switch-btn', 'js-login ')}>
                                    Đăng nhập
                                </Link>
                            </div>

                            <div className={cx('auth-form__form')}>
                                <div className={cx('auth-form__group')}>
                                    <input
                                        type="text"
                                        name="username"
                                        placeholder="Tên đăng nhập"
                                        className={cx('auth-form__input')}
                                        id="auth-form__username"
                                        value={username}
                                        onChange={(e) => setUserName(e.target.value)}
                                    />
                                    <div className={cx('error')}></div>
                                </div>
                                <div className={cx('auth-form__group')}>
                                    <input
                                        type="text"
                                        name="email"
                                        placeholder="Email của bạn"
                                        className={cx('auth-form__input')}
                                        id="auth-form__email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <div className={cx('error')}></div>
                                </div>
                                <div className={cx('auth-form__group')}>
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Mật khẩu của bạn"
                                        className={cx('auth-form__input')}
                                        id="auth-form__password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <div className={cx('error')}></div>
                                </div>
                                <div className={cx('auth-form__group')}>
                                    <input
                                        type="password"
                                        name="passwordConfim"
                                        placeholder="Nhập lại mật khẩu"
                                        className={cx('auth-form__input')}
                                        id="auth-form__confirm-password"
                                    />
                                    <div className={cx('error')}></div>
                                </div>
                            </div>

                            <div className={cx('auth-form__aside')}>
                                <p className={cx('auth-form__policy-text')}>
                                    Bằng việc đăng ký, bạn đã đồng ý với Nest - Multipurpose eCommerce về
                                    <Link to={''} className={cx('auth-form__text-link')}>
                                        Điều khoản dịch vụ
                                    </Link>{' '}
                                    &
                                    <Link to={''} className={cx('auth-form__text-link')}>
                                        Chính sách bảo mật
                                    </Link>
                                </p>
                            </div>

                            <div className={cx('auth-form__control')}>
                                <Link
                                    to={'/'}
                                    className={cx('btn auth-form__control-back', 'btn--normal js-modal-close')}
                                >
                                    TRỞ LẠI
                                </Link>
                                <button className={cx('btn btn--primary', 'view-cart')} onClick={handleSubmit}>
                                    ĐĂNG KÝ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}
export default Register;
