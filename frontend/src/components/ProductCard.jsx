// src/components/ProductCard.jsx
import React from 'react'

export function ProductCard({
  id,
  name,
  price,
  category,
  stock,
  image,
  status,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}) {
  const getStatusText = () => {
    switch (status) {
      case 'in-stock':
        return 'Còn hàng'
      case 'low-stock':
        return 'Sắp hết'
      case 'out-of-stock':
        return 'Hết hàng'
      default:
        return ''
    }
  }

  return (
    <div className="product-card">
      <div className="product-card-media">
        <img src={image} alt={name} className="product-card-img" />

        <span
          className={`product-status-pill ${
            status === 'in-stock'
              ? 'status-in-stock'
              : status === 'low-stock'
              ? 'status-low-stock'
              : 'status-out-of-stock'
          }`}
        >
          {getStatusText()}
        </span>
      </div>

      <div className="product-card-body">
        <p className="product-card-category">{category}</p>
        <p className="product-card-name">{name}</p>
        <p className="product-card-price">₫{price.toLocaleString()}</p>
        <p className="product-card-stock">{stock} trong kho</p>

        <div className="product-card-footer">
          <button
            className="product-card-btn edit"
            onClick={() => onEdit && onEdit(id)}
          >
            Sửa
          </button>
          <button
            className="product-card-btn delete"
            onClick={() => onDelete && onDelete(id)}
          >
            🗑
          </button>
        </div>
      </div>
    </div>
  )
}
    