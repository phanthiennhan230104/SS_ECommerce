import React, { useMemo, useState } from 'react'
import { Edit, Trash2 } from 'lucide-react'

export function UserTable({ users, searchQuery, roleFilter, statusFilter, onEdit, onDelete }) {
  const [sortField, setSortField] = useState('id')
  const [sortDirection, setSortDirection] = useState('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesRole = roleFilter === 'all' || user.role === roleFilter
      const matchesStatus =
        statusFilter === 'all' || user.status === statusFilter
      return matchesSearch && matchesRole && matchesStatus
    })

    filtered.sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      const modifier = sortDirection === 'asc' ? 1 : -1
      if (aValue > bValue) return modifier
      if (aValue < bValue) return -modifier
      return 0
    })

    return filtered
  }, [users, searchQuery, roleFilter, statusFilter, sortField, sortDirection])

  const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage)
  const paginatedUsers = filteredAndSortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const getRoleClass = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'role-badge role-admin'
      case 'SELLER':
        return 'role-badge role-seller'
      default:
        return 'role-badge role-user'
    }
  }

  const getStatusClass = (status) => {
    return status === 'Active'
      ? 'status-badge status-active'
      : 'status-badge status-blocked'
  }

  const SortHeader = ({ field, label }) => (
    <th onClick={() => handleSort(field)}>
      {label}{' '}
      {sortField === field ? (sortDirection === 'asc' ? '▲' : '▼') : null}
    </th>
  )

  return (
    <div className="table-card">
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <SortHeader field="id" label="ID" />
              <SortHeader field="name" label="Họ tên" />
              <SortHeader field="email" label="Email" />
              <SortHeader field="role" label="Vai trò" />
              <SortHeader field="status" label="Trạng thái" />
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={getRoleClass(user.role)}>{user.role}</span>
                </td>
                <td>
                  <span className={getStatusClass(user.status)}>
                    {user.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      type="button"
                      className="icon-button edit"
                      onClick={() => onEdit(user)}
                      title="Sửa user"
                    >
                      <Edit />
                    </button>
                    <button
                      type="button"
                      className="icon-button delete"
                      onClick={() => onDelete(user.id)}
                      title="Xóa user"
                    >
                      <Trash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <span>
          Hiển thị {(currentPage - 1) * itemsPerPage + 1} -{' '}
          {Math.min(
            currentPage * itemsPerPage,
            filteredAndSortedUsers.length,
          )}{' '}
          trong tổng số {filteredAndSortedUsers.length} user
        </span>

        <div>
          <button
            type="button"
            className="pagination-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            ← Trước
          </button>
          <button
            type="button"
            className="pagination-btn"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() =>
              setCurrentPage((p) => Math.min(totalPages, p + 1))
            }
          >
            Sau →
          </button>
        </div>
      </div>
    </div>
  )
}
