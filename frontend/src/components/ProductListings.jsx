import {Link} from 'react-router-dom';

const ProductListings = ({products}) => {
  return (
    <div className="product-list">
      {products.map((product) => (
        
        <div className="product-preview" key={product.id}>
          <h2>{product.title}</h2>
          <p>Type: {product.category}</p>
          <p>Description: {product.description}</p>
          <p>Price: {product.price}</p>
          <div className="align-row">
            <Link to={`/products/${product.id}`} className="btn">
              View Product
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductListings;
