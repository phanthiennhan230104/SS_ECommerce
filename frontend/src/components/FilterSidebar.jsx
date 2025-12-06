import React from 'react'
import { motion } from 'framer-motion'
import { X, Filter } from 'lucide-react'

export function FilterSidebar({ isOpen, onClose }) {
  const categories = ['Điện thoại', 'Laptop', 'Phụ kiện', 'Tablet', 'Đồng hồ']
  const stockStatuses = ['Còn hàng', 'Sắp hết', 'Hết hàng']

  return (
    <motion.div
      initial={{ x: -320 }}
      animate={{ x: isOpen ? 0 : -320 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-900 border-r-2 border-gray-100 dark:border-gray-800 shadow-2xl z-30 overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b-2 border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Bộ lọc
          </h3>
        </div>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
        >
          <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </motion.button>
      </div>

      {/* Filters */}
      <div className="p-6 space-y-6">
        {/* Category Filter */}
        <div>
          <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
            Danh mục
          </h4>
          <div className="space-y-2">
            {categories.map((category) => (
              <label
                key={category}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 cursor-pointer accent-indigo-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {category}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
            Khoảng giá
          </h4>
          <div className="space-y-3">
            <div className="flex gap-3">
              <input
                type="number"
                placeholder="Từ"
                className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-900 dark:text-white"
              />
              <input
                type="number"
                placeholder="Đến"
                className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-900 dark:text-white"
              />
            </div>
            <input
              type="range"
              min="0"
              max="50000000"
              className="w-full accent-indigo-600"
            />
          </div>
        </div>

        {/* Stock Status */}
        <div>
          <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
            Trạng thái kho
          </h4>
          <div className="space-y-2">
            {stockStatuses.map((status) => (
              <label
                key={status}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 cursor-pointer accent-indigo-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {status}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t-2 border-gray-100 dark:border-gray-800">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          Xóa bộ lọc
        </motion.button>
      </div>
    </motion.div>
  )
}
