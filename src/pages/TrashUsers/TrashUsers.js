import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import className from 'classnames/bind';
import ReactPaginate from 'react-paginate';
import styles from './TrashUsers.module.scss';
import { useNavigate } from 'react-router-dom';
import * as request from '../../utils/request';

const cx = className.bind(styles);

function TrashUsers() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [checkedItems, setCheckedItems] = useState([]);
    const [pageCount, setPageCount] = useState();
    const [currenPageProduct, setCurrenPageProduct] = useState();

    const postsPerPage = 10;

    const handleRestoreMultipleUser = async () => {
        try {
            let dataIds = checkedItems;
            await request.put(`/restore-multiple-users`, { data: dataIds });
            getUsers(currenPageProduct || 1);
        } catch (error) {
            if (error.response.data.message === 'Invalid access token') navigate('/login');
        }
    };

    const handleRestoreUser = async (event) => {
        try {
            const id = event.target.dataset.id;
            await request.put(`/restore-user/${id}`);
            getUsers(currenPageProduct || 1);
        } catch (error) {
            if (error.response.data.message === 'Invalid access token') navigate('/login');
        }
    };

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const res = await request.get(`/trash-users?_page=1&_limit=${postsPerPage}`);
                setUsers(res.data);
                setPageCount(res.count);
            } catch (error) {
                if (error.response.data.message === 'Invalid access token') navigate('/login');
            }
        };
        fetchApi();
    }, [navigate]);

    const handleChange = (event) => {
        const item = event.target.value;
        const isChecked = event.target.checked;
        // const targetElement = document.querySelector(`[data-product_id="${item}"]`);
        isChecked
            ? setCheckedItems([...checkedItems, Number(item)])
            : setCheckedItems(checkedItems.filter((i) => i !== Number(item)));
    };

    const handleCheckAll = (event) => {
        const arrItemChecked = document.querySelectorAll(`[name="checkProductItem"]`);
        if (event.target.checked) {
            const newListCart = [];
            users.forEach((item) => {
                newListCart.push(Number(item.UserId));
            });
            arrItemChecked.forEach((item) => (item.checked = true));
            setCheckedItems(newListCart);
        } else {
            arrItemChecked.forEach((item) => (item.checked = false));
            setCheckedItems([]);
        }
    };

    const getUsers = async (currenPage) => {
        try {
            const res = await request.get(`/trash-users?_page=${currenPage}&_limit=${postsPerPage}`);
            setUsers(res.data);
            setPageCount(res.count);
        } catch (error) {
            if (error.response.data.message === 'Invalid access token') navigate('/login');
        }
    };

    const handlePageClick = (event) => {
        let currenPage = event.selected + 1;
        getUsers(currenPage);
        setCurrenPageProduct(currenPage);
    };

    return (
        <div className={cx('container_m')}>
            <div className={cx('mt-4', 'mb-4', 'pd-top-40px')}>
                <div className={cx('action')}>
                    <div className={cx('action-container')}>
                        <div className={cx('actions-wrap')}>
                            <div className={cx('action-list')}>
                                <button
                                    className={cx('btn', 'btn--primary', 'mr-10')}
                                    onClick={handleRestoreMultipleUser}
                                >
                                    Khôi phục
                                </button>
                            </div>
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
                                                        name="checkProductItem"
                                                        onChange={handleChange}
                                                        checked={checkedItems.includes(item.UserID)}
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
                                                        onClick={handleRestoreUser}
                                                    >
                                                        Khôi phục
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className={cx('text-center')}>
                                            Danh sách người dùng bị xóa rỗng.
                                            <Link to={'/users'}> Quay lại</Link>
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
        </div>
    );
}

export default TrashUsers;
