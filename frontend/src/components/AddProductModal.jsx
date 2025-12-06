import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, Plus, Trash2 } from 'lucide-react'

export function AddProductModal({ isOpen, onClose, onSave }) {
  const [variants, setVariants] = useState([
    {
      size: '',
      color: '',
    },
  ])

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        size: '',
        color: '',
      },
    ])
  }

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b-2 border-gray-100 dark:border-gray-800">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Thêm sản phẩm mới
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="space-y-6">
                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Hình ảnh sản phẩm
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-8 text-center hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors cursor-pointer">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Kéo thả ảnh vào đây hoặc{' '}
                        <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                          chọn file
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        PNG, JPG, GIF tối đa 10MB
                      </p>
                    </div>
                  </div>

                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Tên sản phẩm
                    </label>
                    <input
                      type="text"
                      placeholder="Nhập tên sản phẩm..."
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                    />
                  </div>

                  {/* Category and Price */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Danh mục
                      </label>
                      <select className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white">
                        <option>Điện thoại</option>
                        <option>Laptop</option>
                        <option>Phụ kiện</option>
                        <option>Tablet</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Giá (₫)
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Stock */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Số lượng tồn kho
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Mô tả sản phẩm
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Nhập mô tả chi tiết về sản phẩm..."
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white resize-none"
                    />
                  </div>

                  {/* Variants */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Biến thể sản phẩm
                      </label>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={addVariant}
                        className="flex items-center gap-2 px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg text-sm font-medium hover:bg-indigo-200 dark:hover:bg-indigo-900/30 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Thêm biến thể
                      </motion.button>
                    </div>
                    <div className="space-y-3">
                      {variants.map((variant, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex gap-3"
                        >
                          <input
                            type="text"
                            placeholder="Kích thước (S, M, L...)"
                            className="flex-1 px-4 py-2.5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Màu sắc"
                            className="flex-1 px-4 py-2.5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white text-sm"
                          />
                          {variants.length > 1 && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeVariant(index)}
                              className="p-2.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t-2 border-gray-100 dark:border-gray-800">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Hủy
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onSave({})
                    onClose()
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg"
                >
                  Lưu sản phẩm
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
