// services/sheetService.js
// Format URL Google Sheet publish:
// https://docs.google.com/spreadsheets/d/{SHEET_ID}/export?format=csv&gid={SHEET_GID}

const SHEET_ID = 'e/2PACX-1vT9O9scRpbL0149ycxuoy-I_d1kTN2WAoKYHE2WxCBopWBpjJxA3v6XjEHDSqGGU66DHvpXmIrpXpJ7/pub'
const SHEET_GIDS = {
  products: 0,  // First sheet (products)
  cart: 1,      // Second sheet (cart)
  toast: 2      // Third sheet (toast)
}

/**
 * Build CSV URL for a specific sheet
 */
const buildSheetUrl = (gid) => {
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}?gid=${gid}&single=true&output=csv`
}

/**
 * Parse CSV string to array of objects
 */
const parseCSV = (csv) => {
  const lines = csv.trim().split('\n')
  if (lines.length === 0) return []

  // Fungsi helper untuk membaca baris CSV yang memiliki tanda kutip (")
  const parseLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"' && line[i + 1] === '"') {
        current += '"';
        i++; // skip escaped quote
      } else if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  }

  const headers = parseLine(lines[0])

  return lines.slice(1)
    .filter(line => line.trim().length > 0) // Filter empty lines
    .map(line => {
      const values = parseLine(line)
      const obj = {}

      headers.forEach((header, index) => {
        let value = values[index] || ''

        // Convert types
        if (value === 'TRUE' || value === 'true') value = true
        else if (value === 'FALSE' || value === 'false') value = false
        else if (!isNaN(value) && value !== '') value = Number(value)

        obj[header] = value
      })

      return obj
    })
}

/**
 * Fetch products from Google Sheet
 */
export const fetchProducts = async () => {
  try {
    const url = buildSheetUrl(SHEET_GIDS.products)
    console.log('Fetching products from:', url)

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const csv = await response.text()
    console.log('Raw CSV data:', csv.substring(0, 200))

    const products = parseCSV(csv)
    console.log('Parsed products:', products)

    return products
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

/**
 * Fetch cart items from Google Sheet
 */
export const fetchCart = async () => {
  try {
    const url = buildSheetUrl(SHEET_GIDS.cart)
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const csv = await response.text()
    return parseCSV(csv)
  } catch (error) {
    console.error('Error fetching cart:', error)
    return []
  }
}

/**
 * Add a new product to Google Sheet via Google Apps Script (Web App)
 * NOTE: Replace the URL below with your deployed Google Apps Script Web App URL
 */
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbx08wi5LcoRMQSuF0h-X_1koJUcxorG3uHaE1yTpblsc0pp9ZfzsKNKFyq4XQw0SaUq/exec'

export const addProductToSheet = async (productData) => {
  try {
    const response = await fetch(WEB_APP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        action: 'addProduct',
        data: productData
      })
    })

    const result = await response.json()
    if (result.status === 'success') {
      return true
    } else {
      throw new Error(result.message || 'Gagal menyimpan ke Google Sheet')
    }
  } catch (error) {
    console.error('Error saving product to sheet:', error)
    throw error
  }
}

export const updateProductToSheet = async (productData) => {
  try {
    const response = await fetch(WEB_APP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        action: 'updateProduct',
        data: productData
      })
    })

    const result = await response.json()
    if (result.status === 'success') {
      return true
    } else {
      throw new Error(result.message || 'Gagal mengupdate ke Google Sheet')
    }
  } catch (error) {
    console.error('Error updating product to sheet:', error)
    throw error
  }
}

export const deleteProductFromSheet = async (productId) => {
  try {
    const response = await fetch(WEB_APP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        action: 'deleteProduct',
        data: { id: productId }
      })
    })

    const result = await response.json()
    if (result.status === 'success') {
      return true
    } else {
      throw new Error(result.message || 'Gagal menghapus dari Google Sheet')
    }
  } catch (error) {
    console.error('Error deleting product from sheet:', error)
    throw error
  }
}
