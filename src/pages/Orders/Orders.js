import { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import className from 'classnames/bind';
import styles from './Orders.module.scss';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import * as request from '../../utils/request';

const cx = className.bind(styles);

function Orders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [pageCount, setPageCount] = useState('');
    const [currenPageProduct, setCurrenPageProduct] = useState();

    const postsPerPage = 12;

    const getOrder = async (currenPage) => {
        try {
            const res = await request.get(`/get-orders?_page=${currenPage}&_limit=${postsPerPage}`);
            setOrders(res.data);
            setPageCount(res.count);
        } catch (error) {
            if (error.response.data.message === 'Invalid access token') navigate('/login');
        }
    };

    const updateStatusOrder = async (event, dataId) => {
        try {
            const status = event.target.value;
            const orderDetailId = dataId;
            await request.put(`/update-status-order/${orderDetailId}`, { status });
            getOrder(currenPageProduct || 1);
        } catch (error) {
            if (error.response.data.message === 'Invalid access token') navigate('/login');
        }
    };

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const res = await request.get(`/get-orders?_page=1&_limit=${postsPerPage}`);
                setOrders(res.data);
                setPageCount(res.count);
            } catch (error) {
                if (error.response.data.message === 'Invalid access token') navigate('/login');
            }
        };
        fetchApi();
    }, [navigate]);

    const handlePageClick = (event) => {
        let currenPage = event.selected + 1;
        getOrder(currenPage);
        setCurrenPageProduct(currenPage);
    };

    return (
        <div className={cx('container_m')}>
            <div className={cx('mt-4', 'mb-4', 'pd-top-10px')}>
                <div className={cx('table-wrap', 'mt-4')}>
                    <div className={cx('table-container')}>
                        <table className={cx('table')}>
                            <thead>
                                <tr>
                                    <th scope="col" style={{ textAlign: 'center' }}>
                                        Mã
                                    </th>
                                    <th scope="col" style={{ textAlign: 'center' }}>
                                        Khách hàng
                                    </th>
                                    <th scope="col" style={{ textAlign: 'center' }}>
                                        Thanh toán
                                    </th>
                                    <th scope="col" style={{ textAlign: 'center' }}>
                                        Trạng thái
                                    </th>
                                    <th scope="col" style={{ textAlign: 'center' }}>
                                        Hành động
                                    </th>
                                    <th scope="col" style={{ textAlign: 'center' }}>
                                        Ngày tạo
                                    </th>
                                    <th scope="col" style={{ textAlign: 'center' }}>
                                        Tổng tiền
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.length > 0 ? (
                                    orders.map((item) => (
                                        <tr key={item.OrderDetailID}>
                                            <td>
                                                <p style={{ textAlign: 'center' }}>#{item.OrderDetailID}</p>
                                            </td>
                                            <td>
                                                <p style={{ textAlign: 'center' }}>{item.FullName}</p>
                                            </td>
                                            <td style={{ textAlign: 'center' }}>{item.PaymentStatus}</td>
                                            <td style={{ textAlign: 'center' }}>{item.Status}</td>
                                            <td style={{ textAlign: 'center' }} data-id={item.OrderDetailID}>
                                                <select
                                                    disabled={
                                                        item.status === 'Đã hủy' || item.status === 'Hoàn thành'
                                                    }
                                                    onChange={(event) => updateStatusOrder(event, item.OrderDetailID)}
                                                    className={cx('select-status')}
                                                    defaultValue={item.Status}
                                                >
                                                    <option>Đang chờ</option>
                                                    <option>Đang giao</option>
                                                    <option>Hoàn thành</option>
                                                    <option>Đã hủy</option>
                                                </select>
                                            </td>
                                            <td style={{ textAlign: 'center' }}>{item.CreateDate}</td>
                                            <td
                                                style={{ textAlign: 'center' }}
                                                className={cx('')}
                                                data-total={item.OrderDetailID}
                                            >
                                                {item.Quantity * item.Price}$
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className={cx('text-center')}>
                                            Chưa có đơn hàng nào để xử lý. Hãy kiên nhẫn chờ nhá !!!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                {pageCount && (
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

export default Orders;
