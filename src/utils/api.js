// This file will contain functions to interact with your backend API

const API_BASE_URL = "http://localhost:5000/api"; // Replace with your backend URL

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Something went wrong.");
  }
  return response.json();
};

const getAuthHeaders = (token) => {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// Authentication API calls
export const loginUser = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return handleResponse(response);
};

export const signupUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

// Expense API calls
export const getExpenses = async (
  token,
  page = 1,
  filters = {},
  searchQuery = ""
) => {
  const queryParams = new URLSearchParams({
    page: page,
    ...filters,
    search: searchQuery,
  }).toString();
  const response = await fetch(`${API_BASE_URL}/expenses?${queryParams}`, {
    headers: getAuthHeaders(token),
  });
  return handleResponse(response);
};

export const getAnalysisData = async (token) => {
  const response = await fetch(`${API_BASE_URL}/dashboard/analysis`, {
    // Assuming this is your analysis endpoint
    headers: getAuthHeaders(token),
  });
  return handleResponse(response);
};

export const getCategories = async (token) => {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    headers: getAuthHeaders(token),
  });
  return handleResponse(response);
};

export const getPaymentMethods = async (token) => {
  const response = await fetch(`${API_BASE_URL}/payment-methods`, {
    headers: getAuthHeaders(token),
  });
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

// Add functions for creating categories and payment methods if needed
export const createCategory = async (token, categoryData) => {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(categoryData),
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
