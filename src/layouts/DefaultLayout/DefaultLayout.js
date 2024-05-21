import PropTypes from 'prop-types';
import className from 'classnames/bind';
// import className from 'classname';
import Header from '../components/Header/Header';
import Sidebar from '../components/Sidebar/Sidebar';
import styles from './DefaultLayout.module.scss';
import { OnTopIcon } from '~/components/Icons';
import { useEffect, useState } from 'react';

const cx = className.bind(styles);

function DefaultLayout({ children }) {
    const [checkButtonOnTop, setCheckButtonOnTop] = useState(false);

    useEffect(() => {
        window.addEventListener('scroll', () => {
            if (window.scrollY >= 40) setCheckButtonOnTop(true);
            else setCheckButtonOnTop(false);
        });
    }, []);

    const onTop = () => {
        window.scrollTo(0, 0);
    };

    return (
        <div className={cx('wrapper')}>
            <Sidebar />
            <div className={cx('content')}>
                <Header />
                <div className={cx('children')}>{children}</div>
                {checkButtonOnTop && (
                    <div className={cx('on-top-icon-wrap')} onClick={onTop}>
                        <OnTopIcon className={'on-top-icon'} />
                    </div>
                )}
            </div>
        </div>
    );
}

DefaultLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default DefaultLayout;
