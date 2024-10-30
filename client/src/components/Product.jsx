import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { addCart, delCart } from "../redux/action";
import { useParams } from "react-router";
import { NavLink } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Product = () => {
  // Set state parameters
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  // redux actions to add or delete item from cart
  const dispatch = useDispatch();
  const addProduct = (product) => {
    dispatch(addCart(product));
  };
  const delProduct = (product) => {
    dispatch(delCart(product));
  };

  // Fetch product from backend server
  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${backendUrl}/products/${id}`
        );
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err.message);
        setLoading(false);
      }
    };
    getProduct();
  }, [id]);

  // JSX component for using loading skeleton while data is fetched from backend for display
  const Loading = () => (
    <>
      <div className="col-md-6">
        <Skeleton height={400} />
      </div>
      <div className="col-md-6">
        <Skeleton height={50} width={300} />
        <Skeleton height={85} />
        <Skeleton height={35} width={150} />
        <Skeleton height={50} />
        <Skeleton height={150} />
        <Skeleton height={50} width={100} />
        <Skeleton height={50} width={100} style={{ marginLeft: 6 }} />
      </div>
    </>
  );

  // JSX component for displaying fetched product
  const ShowProduct = () => (
    <>
      {product ? (
        <>
          <div className="col-md-6">
            <img
              src={product.image}
              alt={product.title}
              height="400px"
              width="400px"
            />
          </div>
          <div className="col-md-6">
            <h4 className="text-uppercase text-black-50">{product.category}</h4>
            <h1 className="display-5">{product.title}</h1>
            <p className="lead">
              Rating {product.rating?.rate}
              <i className="fa fa-star ms-2"></i>
            </p>
            <h3 className="display-6 fw-bold my-4">${product.price}</h3>
            <p className="lead">{product.description}</p>
            <button
              className="btn btn-outline-dark px-4 py-2 me-2"
              onClick={() => addProduct(product)}
            >
              Add to Cart
            </button>
            <button
              className="btn btn-outline-dark px-4 py-2 me-2"
              onClick={() => delProduct(product)}
            >
              Remove from Cart
            </button>
            <NavLink to="/cart">
              <button className="btn btn-dark me-2 px-3 py-2">
                Go to Cart
              </button>
            </NavLink>
          </div>
        </>
      ) : (
        <p>Product not found</p>
      )}
    </>
  );

  return (
    <div>
      <div className="container py-5">
        <div className="row py-4">
          {loading ? <Loading /> : <ShowProduct />}
        </div>
      </div>
    </div>
  );
};

Product.propTypes = {
  product: PropTypes.shape({
    category: PropTypes.string,
    title: PropTypes.string,
    rating: PropTypes.shape({
      rate: PropTypes.number,
    }),
    price: PropTypes.number,
    description: PropTypes.string,
    image: PropTypes.string,
  }),
};

export default Product;
