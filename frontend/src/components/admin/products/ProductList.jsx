import React from 'react'
import { motion } from 'framer-motion'
import { Edit, Trash2, Package } from 'lucide-react'

export function ProductList({
  products,
  selectedIds,
  onSelect,
  onEdit,
  onDelete,
}) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'in-stock':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
      case 'low-stock':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
      case 'out-of-stock':
        return 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400'
      default:
        return ''
    }
  }

  const getStatusText = (status) => {
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
    <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-100 dark:border-gray-800 overflow-hidden shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800/50 border-b-2 border-gray-100 dark:border-gray-800">
            <tr>
              <th className="px-6 py-4 text-left">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 cursor-pointer accent-indigo-600"
                />
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Sản phẩm
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Danh mục
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Giá
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Tồn kho
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {products.map((product, index) => (
              <motion.tr
                key={product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(product.id)}
                    onChange={() => onSelect(product.id)}
                    className="w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 cursor-pointer accent-indigo-600"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {product.name}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {product.category}
                </td>
                <td className="px-6 py-4">
                  <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                    ₫{product.price.toLocaleString()}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <Package className="w-4 h-4" />
                    {product.stock}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusBadge(
                      product.status,
                    )}`}
                  >
                    {getStatusText(product.status)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onEdit(product.id)}
                      className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onDelete(product.id)}
                      className="p-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
