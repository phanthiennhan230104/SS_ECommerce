import React from 'react'
import { motion } from 'framer-motion'


export function StatsCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  chartData,
  gradient = 'from-blue-400 to-blue-600',
}) {
  const maxValue = chartData ? Math.max(...chartData) : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -4,
        transition: { duration: 0.2 },
      }}
      className="bg-white dark:bg-gray-900 rounded-3xl border-2 border-gray-100 dark:border-gray-800 p-6 shadow-lg hover:shadow-2xl transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            {title}
          </p>
          <motion.p
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
          >
            {value}
          </motion.p>
          {change && (
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className={`text-sm font-semibold mt-2 ${
                changeType === 'positive'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {changeType === 'positive' ? '📈' : '📉'} {change}
            </motion.p>
          )}
        </div>
        <motion.div
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className={`p-4 bg-gradient-to-br ${gradient} rounded-2xl shadow-lg`}
        >
          <Icon className="w-7 h-7 text-white" />
        </motion.div>
      </div>
      {chartData && (
        <div className="flex items-end gap-1.5 h-16 mt-4">
          {chartData.map((value, index) => (
            <motion.div
              key={index}
              initial={{ height: 0 }}
              animate={{
                height: `${(value / maxValue) * 100}%`,
              }}
              transition={{
                delay: index * 0.05,
                type: 'spring',
                stiffness: 200,
              }}
              className={`flex-1 bg-gradient-to-t ${gradient} rounded-t-lg opacity-70`}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}
