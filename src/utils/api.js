// const API_BASE_URL = "http://localhost:5000/api";
const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
console.log("API_BASE_URL:", API_BASE_URL);


// Get current monthly budget
export const getMonthlyBudget = async (token) => {
  const response = await fetch(`${API_BASE_URL}/expenses/budget`, {
    headers: getAuthHeaders(token),
  });
  return handleResponse(response);
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Something went wrong.");
  }
  return response.json();
};

const getAuthHeaders = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

// Authentication
export const loginUser = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return handleResponse(response);
};

export const signupUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

// Expenses
export const getExpenses = async (
  token,
  page = 1,
  filters = {},
  searchQuery = ""
) => {
  const params = new URLSearchParams({ page, ...filters });
  if (searchQuery) params.append("q", searchQuery);
  const response = await fetch(
    `${API_BASE_URL}/expenses?${params.toString()}`,
    {
      headers: getAuthHeaders(token),
    }
  );
  return handleResponse(response);
};

export const addExpense = async (token, expenseData) => {
  const response = await fetch(`${API_BASE_URL}/expenses`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(expenseData),
  });
  return handleResponse(response);
};

export const updateExpense = async (token, expenseId, updatedExpenseData) => {
  const response = await fetch(`${API_BASE_URL}/expenses/${expenseId}`, {
    method: "PUT",
    headers: getAuthHeaders(token),
    body: JSON.stringify(updatedExpenseData),
  });
  return handleResponse(response);
};

export const deleteExpense = async (token, expenseId) => {
  const response = await fetch(`${API_BASE_URL}/expenses/${expenseId}`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });
  return handleResponse(response);
};

export const updateMonthlyBudget = async (token, totalMonthlyBudget) => {
  const response = await fetch(`${API_BASE_URL}/expenses/budget`, {
    method: "PATCH",
    headers: getAuthHeaders(token),
    body: JSON.stringify({ totalMonthlyBudget }),
  });
  return handleResponse(response);
};

// Categories
export const getCategories = async (token) => {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    headers: getAuthHeaders(token),
  });
  return handleResponse(response);
};

export const createCategory = async (token, categoryData) => {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(categoryData),
  });
  return handleResponse(response);
};

export const deleteCategory = async (token, categoryId) => {
  const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });
  return handleResponse(response);
};

// Payment Methods
export const getPaymentMethods = async (token) => {
  const response = await fetch(`${API_BASE_URL}/payment-methods`, {
    headers: getAuthHeaders(token),
  });
  return handleResponse(response);
};

export const createPaymentMethod = async (token, paymentMethodData) => {
  const response = await fetch(`${API_BASE_URL}/payment-methods`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(paymentMethodData),
  });
  return handleResponse(response);
};

export const deletePaymentMethod = async (token, paymentMethodId) => {
  const response = await fetch(
    `${API_BASE_URL}/payment-methods/${paymentMethodId}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(token),
    }
  );
  return handleResponse(response);
};

// Dashboard Analysis
export const getAnalysisData = async (token, startDate, endDate) => {
  let url = `${API_BASE_URL}/dashboard/expenses-by-day`;
  if (startDate || endDate) {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    url += `?${params.toString()}`;
  }
  const response = await fetch(url, {
    headers: getAuthHeaders(token),
  });
  return handleResponse(response);
};

// Search & Filter
export const searchExpenses = async (token, q, page = 1, limit = 10) => {
  const params = new URLSearchParams({ q, page, limit });
  const response = await fetch(
    `${API_BASE_URL}/search/search?${params.toString()}`,
    {
      headers: getAuthHeaders(token),
    }
  );
  return handleResponse(response);
};

export const filterExpenses = async (token, filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await fetch(
    `${API_BASE_URL}/search/filter?${params.toString()}`,
    {
      headers: getAuthHeaders(token),
    }
  );
  return handleResponse(response);
};
