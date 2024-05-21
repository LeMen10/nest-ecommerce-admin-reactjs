import { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { TrashIcon } from '~/components/Icons';
import className from 'classnames/bind';
import styles from './Products.module.scss';
import Image from '~/components/Image';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as request from '../../utils/request';

const cx = className.bind(styles);

function Products() {
    const [products, setProducts] = useState([]);
    const [checkedItems, setCheckedItems] = useState([]);
    const [checkedDelete, setCheckedDelete] = useState(false);
    const [checkedBtnEdit, setCheckedBtnEdit] = useState(false);
    const [checkedBtnAdd, setCheckedBtnAdd] = useState(false);
    const [productIdDelete, setProductIdDelete] = useState();
    const [productIdEdit, setProductIdEdit] = useState();
    const [countDelete, setCountDelete] = useState();
    const [imgPrevirew, setImgPreview] = useState();
    const [pageCount, setPageCount] = useState();

    const [titleProduct, setTitleProduct] = useState('');
    const [priceProduct, setPriceProduct] = useState();
    const [cateProduct, setCateProduct] = useState();
    const [detailProduct, setDetailProduct] = useState('');
    const [imgProduct, setImgProduct] = useState('');
    const [categories, setCategories] = useState();
    const [currenPageProduct, setCurrenPageProduct] = useState();
    const navigate = useNavigate();

    const postsPerPage = 8;

    const handleCheckDelete = (event) => {
        const targetId = event.target.dataset.id;
        setCheckedDelete(!checkedDelete);
        setProductIdDelete(targetId);
    };

    const handleCheckedBtnEdit = (event) => {
        const targetId = event.target.dataset.id;
        setCheckedBtnEdit(!checkedBtnEdit);
        setProductIdEdit(targetId);
    };

    useEffect(() => {
        if (productIdEdit) {
            const fetchApi = async () => {
                try {
                    const res = await request.get(`/find-product/${productIdEdit}`);
                    var product = res.data;
                    setTitleProduct(product[0].Title);
                    setPriceProduct(product[0].Price);
                    setCateProduct(product[0].CategoryID);
                    setDetailProduct(product[0].Detail);
                    setImgPreview(product[0].Image);
                } catch (error) {
                    const err = error.response.data.message;
                    if (err === 'Invalid access token') navigate('/login');
                }
            };
            fetchApi();
        }
    }, [productIdEdit, navigate]);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const res = await request.get(`/get-products?_page=1&_limit=${postsPerPage}`);
                setProducts(res.data);
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
                const res = await request.get(`/get-category`);
                setCategories(res.data);
            } catch (error) {
                if (error.response.data.message === 'Invalid access token') navigate('/login');
            }
        };
        fetchApi();
    }, [navigate]);

    const getProducts = async (currenPage) => {
        try {
            const res = await request.get(`/get-products?_page=${currenPage}&_limit=${postsPerPage}`);
            setProducts(res.data);
            setPageCount(res.count);
        } catch (error) {
            if (error.response.data.message === 'Invalid access token') navigate('/login');
        }
    };

    const handlePageClick = (event) => {
        let currenPage = event.selected + 1;
        getProducts(currenPage);
        setCurrenPageProduct(currenPage);
    };

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const res = await request.get(`/count-product-deleted`);
                setCountDelete(res.count);
            } catch (error) {
                if (error.response.data.message === 'Invalid access token') navigate('/login');
            }
        };
        fetchApi();
    }, [products, navigate]);
    console.log(checkedItems)
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
            products.forEach((item) => {
                newListCart.push(Number(item.ProductID));
            });
            arrItemChecked.forEach((item) => (item.checked = true));
            setCheckedItems(newListCart);
        } else {
            arrItemChecked.forEach((item) => (item.checked = false));
            setCheckedItems([]);
        }
    };

    const handleDeleteProduct = async () => {
        try {
            await request.put(`/delete-product/${productIdDelete}`);
            setCheckedDelete(!checkedDelete);
            getProducts(currenPageProduct || 1);
        } catch (error) {
            if (error.response.data.message === 'Invalid access token') navigate('/login');
        }
    };

    const handleDeleteMultipleProduct = async () => {
        var dataIds = checkedItems;
        try {
            await request.put(`/delete-multiple-products`, { data: dataIds });
            setCheckedDelete(!checkedDelete);
            getProducts(currenPageProduct || 1);
            setCheckedItems([]);
        } catch (error) {
            if (error.response.data.message === 'Invalid access token') navigate('/login');
        }
    };

    const handleAddProduct = async () => {
        try {
            await request.post(`/add-product`, {
                title: titleProduct,
                price: priceProduct,
                detail: detailProduct,
                categoryId: 1 || cateProduct,
                image: imgProduct.split('\\').pop(),
            });
            setCheckedBtnAdd(!checkedBtnAdd);
            getProducts(currenPageProduct || 1);
            setTitleProduct(undefined);
            setPriceProduct(undefined);
            setCateProduct(undefined);
            setDetailProduct(undefined);
            setImgProduct(undefined);
            setImgPreview(undefined);
        } catch (error) {
            if (error.response.data.message === 'Invalid access token') navigate('/login');
        }
    };

    const handleEditProduct = async () => {
        try {
            var image = '';
            if (imgProduct) image = imgProduct.split('\\').pop();
            else image = imgPrevirew.split('/')[4];
            await request.put(`/edit-product/${productIdEdit}`, {
                title: titleProduct,
                price: priceProduct,
                categoryId: cateProduct,
                detail: detailProduct,
                image,
            });
            setCheckedBtnEdit(!checkedBtnEdit);
            getProducts(currenPageProduct || 1);
            setTitleProduct(undefined);
            setPriceProduct(undefined);
            setCateProduct(undefined);
            setDetailProduct(undefined);
            setImgProduct(undefined);
            setImgPreview(undefined);
            setProductIdEdit(undefined);
        } catch (error) {
            if (error.response.data.message === 'Invalid access token') navigate('/login');
        }
    };

    useEffect(() => {
        return () => {
            imgPrevirew && URL.revokeObjectURL(imgPrevirew.preview || imgPrevirew);
        };
    }, [imgPrevirew]);

    const handlePreviewImg = (event) => {
        const file = event.target.files[0];
        file.preview = URL.createObjectURL(file);
        setImgPreview(file);
        setImgProduct(event.target.value);
    };

    return (
        <div className={cx('container_m')}>
            <div className={cx('mt-4', 'mb-4', 'pd-top-20px')}>
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
                <div className={cx('action')}>
                    <div className={cx('action-container')}>
                        <div className={cx('actions-wrap')}>
                            <div className={cx('action-list')}>
                                <button
                                    className={cx('btn', 'btn--primary', 'mr-10')}
                                    onClick={() => {
                                        setCheckedBtnAdd(!checkedBtnAdd);
                                    }}
                                >
                                    Thêm sản phẩm
                                </button>
                                <button
                                    className={cx('btn', 'btn--delete')}
                                    disabled={checkedItems.length < 2}
                                    onClick={handleCheckDelete}
                                >
                                    Xóa
                                </button>
                            </div>
                            <Link to={'/trash-products'} className={cx('trash-product')}>
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
                                                checked={products.length && checkedItems.length === products.length}
                                            />
                                        </div>
                                    </td>
                                    <th scope="col">Sản phẩm</th>
                                    <th scope="col" style={{ textAlign: 'center' }}>
                                        Giá
                                    </th>
                                    <th scope="col" style={{ textAlign: 'center' }}>
                                        Danh mục
                                    </th>

                                    <th scope="col" style={{ textAlign: 'center' }} colSpan="2">
                                        Hành động
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.length > 0 ? (
                                    products.map((item) => (
                                        <tr key={item.ProductID}>
                                            <td>
                                                <div className={cx('form-check')}>
                                                    <input
                                                        type="checkbox"
                                                        className={cx('form-check-input', 'check-input-product')}
                                                        value={item.ProductID}
                                                        name="checkProductItem"
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </td>
                                            <td>
                                                <Image style={{ width: '120px' }} src={item.Image} alt="" />
                                                <p>{item.Title}</p>
                                            </td>
                                            <td
                                                style={{ textAlign: 'center' }}
                                                data-price={item.ProductID}
                                                className={cx('unit-price')}
                                            >
                                                {item.Price}$
                                            </td>
                                            <td style={{ textAlign: 'center' }}>{item.Title_Cate}</td>

                                            <td style={{ textAlign: 'center' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                                                    <span
                                                        className={cx('btn-delete')}
                                                        data-id={item.ProductID}
                                                        onClick={handleCheckDelete}
                                                    >
                                                        Xóa
                                                    </span>
                                                    <div
                                                        className={cx('btn-edit')}
                                                        data-id={item.ProductID}
                                                        onClick={handleCheckedBtnEdit}
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
                                            Chưa có sản phẩm. Vui lòng nhấn vào nút Thêm sản phẩm để thêm.
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
                                        Bạn có thực sự muốn xóa không? Bạn không thể xem mục đã chọn trong danh sách của
                                        mình nữa nếu bạn xóa!
                                    </p>
                                </div>

                                <div className={cx('auth-form__control')}>
                                    <Link
                                        to={'/products'}
                                        onClick={handleCheckDelete}
                                        className={cx('btn auth-form__control-back', 'btn--normal')}
                                    >
                                        Quay lại
                                    </Link>
                                    <button
                                        onClick={() => {
                                            if (productIdDelete) handleDeleteProduct();
                                            else handleDeleteMultipleProduct();
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

            {(checkedBtnEdit || checkedBtnAdd) && (
                <div className={cx('modal')}>
                    <div className={cx('modal__overlay')}></div>
                    <div className={cx('modal__body')}>
                        <div className={cx('auth-form')}>
                            <div className={cx('auth-form__container', 'js-modal-container-login')}>
                                <div className={cx('auth-form__header')}></div>

                                <form>
                                    <div className={cx('form-group', 'mb-8')}>
                                        <label htmlFor="title">Tên sản phẩm</label>
                                        <input
                                            type="text"
                                            className={cx('form-control-input')}
                                            id="title"
                                            name="title"
                                            value={titleProduct}
                                            onChange={(e) => setTitleProduct(e.target.value)}
                                        />
                                    </div>

                                    <div className={cx('cate-detail', 'mb-8')}>
                                        <div className={cx('form-group')}>
                                            <label htmlFor="price">Giá</label>
                                            <input
                                                type="text"
                                                className={cx('form-control-input')}
                                                id="price"
                                                name="price"
                                                value={priceProduct}
                                                onChange={(e) => setPriceProduct(e.target.value)}
                                            />
                                        </div>
                                        <div className={cx('form-group', 'mb-8', 'select-cate')}>
                                            <label htmlFor="category">Category</label>
                                            <select
                                                className={cx('form-control-input')}
                                                value={cateProduct}
                                                onChange={(e) => setCateProduct(e.target.value)}
                                                name="selectedFruit"
                                            >
                                                {categories.length > 0 ? (
                                                    categories.map((item) => (
                                                        <option key={item.CategoryID} value={item.CategoryID}>
                                                            {item.Title}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <></>
                                                )}
                                            </select>
                                        </div>
                                    </div>

                                    <div styles={{ display: 'flex' }} className={cx('form-group', 'mb-8', 'input-img')}>
                                        <div className={cx('input-img-container')}>
                                            <label htmlFor="img">Ảnh sản phẩm</label>
                                            <input
                                                type="file"
                                                className={cx('form-group-img')}
                                                id="img"
                                                name="img"
                                                value={imgProduct}
                                                onChange={handlePreviewImg}
                                            />
                                            <label htmlFor="img">Choose a file</label>
                                        </div>
                                        {imgPrevirew && (
                                            <Image
                                                style={{ width: '120px' }}
                                                src={imgPrevirew.preview || imgPrevirew}
                                                alt=""
                                            />
                                        )}
                                    </div>

                                    <div className={cx('form-group')}>
                                        <label htmlFor="detail">Mô tả sản phẩm</label>
                                        <textarea
                                            type="text"
                                            className={cx('form-control-input')}
                                            id="detail"
                                            name="detail"
                                            value={detailProduct}
                                            onChange={(e) => setDetailProduct(e.target.value)}
                                        />
                                    </div>
                                </form>

                                <div className={cx('auth-form__control')}>
                                    <Link
                                        to={'/products'}
                                        onClick={() => {
                                            if (checkedBtnEdit) {
                                                setCheckedBtnEdit(!checkedBtnEdit);
                                                setTitleProduct(undefined);
                                                setPriceProduct(undefined);
                                                setCateProduct(undefined);
                                                setDetailProduct(undefined);
                                                setImgProduct(undefined);
                                                setImgPreview(undefined);
                                                setProductIdEdit(undefined);
                                            } else {
                                                setCheckedBtnAdd(!checkedBtnAdd);
                                                setTitleProduct(undefined);
                                                setPriceProduct(undefined);
                                                setCateProduct(undefined);
                                                setDetailProduct(undefined);
                                                setImgProduct(undefined);
                                                setImgPreview(undefined);
                                                setProductIdEdit(undefined);
                                            }
                                        }}
                                        className={cx('btn', 'auth-form__control-back', 'btn--normal js-modal-close')}
                                    >
                                        Hủy
                                    </Link>
                                    <button
                                        onClick={() => {
                                            if (checkedBtnEdit) handleEditProduct();
                                            else handleAddProduct();
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

export default Products;
