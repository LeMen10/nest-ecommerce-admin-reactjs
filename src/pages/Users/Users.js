import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrashIcon } from '~/components/Icons';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';
import className from 'classnames/bind';
import styles from './Users.module.scss';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as request from '../../utils/request';

const cx = className.bind(styles);

function Users() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [checkedItems, setCheckedItems] = useState([]);
    const [checkedDelete, setCheckedDelete] = useState(false);
    const [productIdDelete, setProductIdDelete] = useState();
    const [countDelete, setCountDelete] = useState();
    const [pageCount, setPageCount] = useState();
    const [currenPageProduct, setCurrenPageProduct] = useState();

    const [checkedBtnEdit, setCheckedBtnEdit] = useState(false);
    const [checkedBtnAdd, setCheckedBtnAdd] = useState(false);
    const [userIdEdit, setUserIdEdit] = useState();

    const [fullName, setfullName] = useState('');
    const [username, setUsername] = useState();
    const [phone, setPhone] = useState();
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [city, setCity] = useState('');
    const [district, setDistrict] = useState('');
    const [ward, setWard] = useState('');
    const [specificAddress, setSpecificAddress] = useState('');

    const postsPerPage = 8;

    const handleCheckDelete = (event) => {
        const targetId = event.target.dataset.id;
        setCheckedDelete(!checkedDelete);
        setProductIdDelete(targetId);
    };

    const getUsers = async (currenPage) => {
        try {
            const res = await request.get(`/get-users?_page=${currenPage}&_limit=${postsPerPage}`);
            setUsers(res.data);
            setPageCount(res.count);
        } catch (error) {
            if (error.response.data.message === 'Invalid access token') navigate('/login');
        }
    };

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const res = await request.get(`/get-users?_page=1&_limit=${postsPerPage}`);
                setUsers(res.data);
                setPageCount(res.count);
            } catch (error) {
                if (error.response.data.message === 'Invalid access token') navigate('/login');
            }
        };
        fetchApi();
    }, [navigate]);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const res = await request.get(`/count-user-deleted`);
                setCountDelete(res.data);
            } catch (error) {
                if (error.response.data.message === 'Invalid access token') navigate('/login');
            }
        };
        fetchApi();
    }, [users, navigate]);

    const handleChange = (event) => {
        const item = event.target.value;
        const isChecked = event.target.checked;
        // const targetElement = document.querySelector(`[data-product_id="${item}"]`);
        isChecked
            ? setCheckedItems([...checkedItems, Number(item)])
            : setCheckedItems(checkedItems.filter((i) => i !== Number(item)));
    };

    const handleCheckAll = (event) => {
        const arrItemChecked = document.querySelectorAll(`[name="checkUsertItem"]`);
        if (event.target.checked) {
            const newListCart = [];
            users.forEach((item) => {
                newListCart.push(Number(item.UserID));
            });
            arrItemChecked.forEach((item) => (item.checked = true));
            setCheckedItems(newListCart);
        } else {
            arrItemChecked.forEach((item) => (item.checked = false));
            setCheckedItems([]);
        }
    };

    const handleDeleteUsers = async () => {
        try {
            await request.put(`/delete-user/${productIdDelete}`);
            setCheckedDelete(!checkedDelete);
            getUsers(currenPageProduct || 1);
        } catch (error) {
            if (error.response.data.message === 'Invalid access token') navigate('/login');
        }
    };

    const handleEditUser = async () => {
        try {
            await request.put(`/edit-user/${userIdEdit}`, {
                fullName,
                username,
                phone,
                email,
                role,
                city,
                district,
                ward,
                specificAddress,
            });
            setCheckedBtnEdit(!checkedBtnEdit);
            getUsers(currenPageProduct || 1);
            setUsername(undefined);
            setfullName(undefined);
            setEmail(undefined);
            setPhone(undefined);
            setRole(undefined);
            setCity(undefined);
            setDistrict(undefined);
            setWard(undefined);
            setSpecificAddress(undefined);
            setUserIdEdit(undefined);
        } catch (error) {
            if (error.response.data.message === 'Invalid access token') navigate('/login');
        }
    };

    const handleDeleteMultipleUser = async () => {
        var dataIds = checkedItems;
        try {
            await request.put(`/delete-multiple-users`, { data: dataIds });
            setCheckedDelete(!checkedDelete);
            getUsers(currenPageProduct || 1);
            setCheckedItems([]);
        } catch (error) {
            if (error.response.data.message === 'Invalid access token') navigate('/login');
        }
    };

    const handlecheckedBtnEdit = (event) => {
        const targetId = event.target.dataset.id;
        setCheckedBtnEdit(!checkedBtnEdit);
        setUserIdEdit(targetId);
    };

    useEffect(() => {
        if (userIdEdit) {
            const fetchApi = async () => {
                try {
                    const res = await request.get(`/find-user/${userIdEdit}`);
                    var user = res.data;
                    setUsername(user[0].Username);
                    setfullName(user[0].FullName);
                    setEmail(user[0].Email);
                    setPhone(user[0].Phone);
                    setRole(user[0].Role);
                    setCity(user[0].City);
                    setDistrict(user[0].District);
                    setWard(user[0].Ward);
                    setSpecificAddress(user[0].SpecificAddress);
                } catch (error) {
                    const err = error.response.data.message;
                    if (err === 'Invalid access token') navigate('/login');
                }
            };
            fetchApi();
        }
    }, [userIdEdit, navigate]);

    const handlePageClick = (event) => {
        let currenPage = event.selected + 1;
        getUsers(currenPage);
        setCurrenPageProduct(currenPage);
    };

    return (
        <div className={cx('container_m')}>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            <div className={cx('mt-4', 'mb-4', 'pd-top-20px')}>
                <div className={cx('action')}>
                    <div className={cx('action-container')}>
                        <div className={cx('actions-wrap')}>
                            <div className={cx('action-list')}>
                                <button className={cx('btn', 'btn--primary', 'mr-10')} onClick={() => {}}>
                                    Lọc
                                </button>
                                <button
                                    className={cx('btn', 'btn--delete')}
                                    disabled={checkedItems.length < 2}
                                    onClick={handleCheckDelete}
                                >
                                    Xóa
                                </button>
                            </div>
                            <Link to={'/trash-users'} className={cx('trash-product')}>
                                <TrashIcon fill={'#6c757d'} />
                                <p className={cx('count-trash-product')}>{countDelete || 0}</p>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className={cx('table-wrap', 'mt-4')}>
                    <div className={cx('table-container')}>
                        <table className={cx('table')}>
                            <thead>
                                <tr>
                                    <td>
                                        <div className={cx('form-check')}>
                                            <input
                                                style={{ marginBottom: '4px' }}
                                                type="checkbox"
                                                onChange={handleCheckAll}
                                                className={cx('form-check-input')}
                                                id="checkbox-all"
                                                checked={users.length && checkedItems.length === users.length}
                                            />
                                        </div>
                                    </td>
                                    <th scope="col">Họ và tên</th>
                                    <th scope="col" style={{ textAlign: 'center' }}>
                                        Liên lạc
                                    </th>
                                    <th scope="col" style={{ textAlign: 'center' }}>
                                        Email
                                    </th>
                                    <th scope="col" style={{ textAlign: 'center' }}>
                                        Quyền
                                    </th>
                                    <th scope="col" style={{ textAlign: 'center' }} colSpan="2">
                                        Chỉnh sửa
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? (
                                    users.map((item) => (
                                        <tr key={item.UserID}>
                                            <td>
                                                <div className={cx('form-check')}>
                                                    <input
                                                        type="checkbox"
                                                        className={cx('form-check-input', 'check-input-product')}
                                                        value={item.UserID}
                                                        name="checkUsertItem"
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </td>
                                            <td>
                                                <p>{item.FullName}</p>
                                            </td>

                                            <td style={{ textAlign: 'center' }}>
                                                <p>{item.Phone}</p>
                                            </td>

                                            <td style={{ textAlign: 'center' }}>{item.Email}</td>
                                            <td
                                                style={{ textAlign: 'center' }}
                                                className={cx('product-total')}
                                                data-total={item.UserID}
                                            >
                                                {item.Role}
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                    <span
                                                        className={cx('btn-delete')}
                                                        data-id={item.UserID}
                                                        onClick={handleCheckDelete}
                                                    >
                                                        Xóa
                                                    </span>
                                                    <div
                                                        className={cx('btn-edit')}
                                                        data-id={item.UserID}
                                                        onClick={handlecheckedBtnEdit}
                                                    >
                                                        Sửa
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className={cx('text-center')}>
                                            Chưa có người dùng.
                                            <Link to={'/products'}> Quay lại</Link>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {pageCount > 0 && (
                    <div className={styles['pagination-container']}>
                        <ReactPaginate
                            onPageChange={handlePageClick}
                            previousLabel={'<'}
                            breakLabel={'...'}
                            nextLabel={'>'}
                            pageCount={pageCount}
                            marginPagesDisplayed={3}
                            pageRangeDisplayed={3}
                            containerClassName={'paginationn'}
                            pageClassName={'page-itemm'}
                            pageLinkClassName={'page-linkk'}
                            previousClassName={'page-itemm'}
                            previousLinkClassName={'page-linkk'}
                            nextClassName={'page-itemm'}
                            nextLinkClassName={'page-linkk'}
                        />
                    </div>
                )}
            </div>

            {checkedDelete && (
                <div className={cx('modal')}>
                    <div className={cx('modal__overlay')}></div>
                    <div className={cx('modal__body')}>
                        <div className={cx('auth-form')}>
                            <div className={cx('auth-form__container', 'js-modal-container-login')}>
                                <div className={cx('auth-form__header')}>
                                    <TrashIcon fill={'#ff5556'} />
                                </div>

                                <div>
                                    <h3>Bạn chắc chắn chưa!</h3>
                                    <p>
                                        Bạn có thực sự muốn xóa vĩnh viễn sản phẩm này? Bạn không thể khôi phục sản phẩm
                                        này nữa nếu bạn xóa vĩnh viễn!
                                    </p>
                                </div>

                                <div className={cx('auth-form__control')}>
                                    <Link
                                        to={'/users'}
                                        onClick={handleCheckDelete}
                                        className={cx('btn auth-form__control-back', 'btn--normal')}
                                    >
                                        Trở lại
                                    </Link>
                                    <button
                                        onClick={() => {
                                            if (productIdDelete) {
                                                handleDeleteUsers();
                                            } else {
                                                handleDeleteMultipleUser();
                                            }
                                        }}
                                        value="login"
                                        className={cx('btn', 'btn--primary', 'view-cart')}
                                    >
                                        Tiếp tục
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {checkedBtnEdit && (
                <div className={cx('modal')}>
                    <div className={cx('modal__overlay')}></div>
                    <div className={cx('modal__body')}>
                        <div className={cx('auth-form')}>
                            <div className={cx('auth-form__container', 'js-modal-container-login')}>
                                <div className={cx('auth-form__header')}></div>

                                <form>
                                    <div className={cx('form-group')}>
                                        <label htmlFor="fullname">Họ và tên</label>
                                        <input
                                            type="text"
                                            className={cx('form-control-input')}
                                            name="fullname"
                                            id="fullname"
                                            value={fullName}
                                            onChange={(e) => setfullName(e.target.value)}
                                        />
                                    </div>

                                    <div className={cx('form-group', 'mb-8')}>
                                        <label htmlFor="price">Email</label>
                                        <input
                                            type="text"
                                            className={cx('form-control-input')}
                                            id="price"
                                            name="price"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>

                                    <div className={cx('cate-detail', 'mb-8')}>
                                        <div className={cx('form-group', 'mb-8')}>
                                            <label htmlFor="username">Tên đăng nhập</label>
                                            <input
                                                type="text"
                                                className={cx('form-control-input')}
                                                name="username"
                                                id="username"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                            />
                                        </div>

                                        <div className={cx('form-group', 'mb-8')}>
                                            <label htmlFor="role">Quyền</label>
                                            <input
                                                type="text"
                                                className={cx('form-control-input')}
                                                id="role"
                                                name="role"
                                                value={role}
                                                onChange={(e) => setRole(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className={cx('cate-detail', 'mb-8')}>
                                        <div className={cx('form-group')}>
                                            <label htmlFor="phone">Liên lạc</label>
                                            <input
                                                type="text"
                                                className={cx('form-control-input')}
                                                id="phone"
                                                name="phone"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                            />
                                        </div>
                                        <div className={cx('form-group', 'mb-8')}>
                                            <label htmlFor="city">Thành phố/ Tỉnh</label>
                                            <input
                                                type="text"
                                                className={cx('form-control-input')}
                                                id="city"
                                                name="city"
                                                value={city}
                                                onChange={(e) => setCity(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className={cx('cate-detail', 'mb-8')}>
                                        <div className={cx('form-group', 'mb-8')}>
                                            <label htmlFor="district">Quận/ Huyện</label>
                                            <input
                                                type="text"
                                                className={cx('form-control-input')}
                                                id="district"
                                                name="district"
                                                value={district}
                                                onChange={(e) => setDistrict(e.target.value)}
                                            />
                                        </div>
                                        <div className={cx('form-group', 'mb-8')}>
                                            <label htmlFor="ward">Phường/ Xã</label>
                                            <input
                                                type="text"
                                                className={cx('form-control-input')}
                                                id="ward"
                                                name="ward"
                                                value={ward}
                                                onChange={(e) => setWard(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className={cx('form-group', 'mb-8')}>
                                        <label htmlFor="SpecificAddress">Địa chỉ cụ thể</label>
                                        <input
                                            style={{ paddingLeft: '10px' }}
                                            type="text"
                                            className={cx('form-control-input')}
                                            placeholder="VD: 20 Đường 50 Khu phố 5"
                                            id="SpecificAddress"
                                            name="SpecificAddress"
                                            value={specificAddress}
                                            onChange={(e) => setSpecificAddress(e.target.value)}
                                        />
                                    </div>
                                </form>

                                <div className={cx('auth-form__control')}>
                                    <Link
                                        to={'/users'}
                                        onClick={() => {
                                            if (checkedBtnEdit) {
                                                setCheckedBtnEdit(!checkedBtnEdit);
                                                setUsername(undefined);
                                                setfullName(undefined);
                                                setEmail(undefined);
                                                setPhone(undefined);
                                                setRole(undefined);
                                                setCity(undefined);
                                                setDistrict(undefined);
                                                setWard(undefined);
                                                setSpecificAddress(undefined);
                                            } else {
                                                setCheckedBtnAdd(!checkedBtnAdd);
                                                setUsername(undefined);
                                                setfullName(undefined);
                                                setEmail(undefined);
                                                setPhone(undefined);
                                                setRole(undefined);
                                                setCity(undefined);
                                                setDistrict(undefined);
                                                setWard(undefined);
                                                setSpecificAddress(undefined);
                                            }
                                        }}
                                        className={cx('btn', 'auth-form__control-back', 'btn--normal js-modal-close')}
                                    >
                                        Hủy
                                    </Link>
                                    <button
                                        onClick={() => {
                                            if (checkedBtnEdit) {
                                                handleEditUser();
                                            }
                                        }}
                                        className={cx('btn', 'btn--primary', 'view-cart')}
                                    >
                                        Tiếp tục
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Users;
