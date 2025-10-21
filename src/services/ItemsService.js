import { API_BASE_URL } from '@/helpers/baseUrl'

class ItemsService {
  async getUserItems() {
    try {
      const response = await fetch(`${API_BASE_URL}/items/index.php`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.status === 'success') {
        return {
          success: true,
          items: data.items
        }
      } else {
        return {
          success: false,
          message: data.message || 'Unknown error'
        }
      }
    } catch (error) {
      console.error('Get items error:', error)
      return {
        success: false,
        message: 'Ошибка при загрузке товаров: ' + error.message
      }
    }
  }

  async deleteItem(itemId) {
    try {
      const response = await fetch(`${API_BASE_URL}/items/delete.php`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ item_id: itemId })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.status === 'success') {
        return {
          success: true,
          message: data.message
        }
      } else {
        return {
          success: false,
          message: data.message
        }
      }
    } catch (error) {
      console.error('Delete item error:', error)
      return {
        success: false,
        message: 'Ошибка при удалении товара: ' + error.message
      }
    }
  }

  async updateItem(itemData) {
    try {
      const response = await fetch(`${API_BASE_URL}/items/handle.php`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          item: {
            value: itemData
          },
          action: 'update'
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.status === 'success') {
        return {
          success: true,
          message: data.message,
          item: data.item
        }
      } else {
        return {
          success: false,
          message: data.message
        }
      }
    } catch (error) {
      console.error('Update item error:', error)
      return {
        success: false,
        message: 'Ошибка при обновлении товара: ' + error.message
      }
    }
  }

  async createItem(itemData) {
    try {
      const response = await fetch(`${API_BASE_URL}/items/handle.php`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'create',
          item: {
            value: itemData
          }
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.status === 'success') {
        return {
          success: true,
          message: data.message,
          item: data.item
        }
      } else {
        return {
          success: false,
          message: data.message,
          errors: data.errors || []
        }
      }
    } catch (error) {
      console.error('Create item error:', error)
      return {
        success: false,
        message: 'Ошибка при создании товара: ' + error.message
      }
    }
  }
}

export default new ItemsService()
