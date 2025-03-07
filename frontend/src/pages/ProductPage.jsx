import {useParams, useNavigate} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

const ProductPage = () => {
  const navigate = useNavigate();
  const {id} = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user ? user.token : null;
  
  const deleteProduct = async (id) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log('id: ', id);
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);
  
  const onDeleteClick = (productId) => {
    const confirm = window.confirm(
      'Are you sure you want to delete this listing?' + productId,
    );
    if (!confirm) return;
    
    deleteProduct(productId);
    navigate('/');
  };
  
  return (
    <div className="product-preview">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <h2>{product.title}</h2>
          <p>Category: {product.category}</p>
          <p>Description: {product.description}</p>
          <p>Price: {product.price}</p>
          <p>Stock Quantity: {product.stockQuantity}</p>
          <p>Company: {product.supplier.name}</p>
          <p>Email: {product.supplier.contactEmail}</p>
          <p>Phone: {product.supplier.contactPhone}</p>
          <p>Rating: {product.supplier.rating}</p>
          <div className="align-row">
            <Link to={`/edit-product/${product.id}`} className={"btn"}>Edit</Link>
            <Link to='/' className="btn"
                  onClick={() => onDeleteClick(product._id)}>Delete</Link>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductPage;
