const ProductListing = ({product}) => {
  return (
    <div className="product-preview">
      <h2>{product.title}</h2>
      <p>Type: {product.category}</p>
      <p>Description: {product.description}</p>
      <p>Price: {product.price}</p>
    </div>
  );
};

export default ProductListing;
