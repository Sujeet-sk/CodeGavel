const API_URL = "http://localhost:8080/api";

export async function login(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: "sujeet",
      email,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error("Invalid credentials");
  }

  const data = await response.json();
  localStorage.setItem("token", data.token);
  localStorage.setItem("userId", data.userId);
  localStorage.setItem("username", data.username);

  return data;
}

export async function getProblems() {
  const response = await fetch(`${API_URL}/problems`);

  if (!response.ok) {
    throw new Error("Failed to load problems");
  }

  return response.json();
}

export async function getProblem(id) {
  const response = await fetch(`${API_URL}/problems/${id}`);

  if (!response.ok) {
    throw new Error("Problem not found");
  }

  return response.json();
}

export async function submitCode(problemId, sourceCode) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/submissions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      problemId,
      sourceCode,
    }),
  });

  if (!response.ok) {
    throw new Error("Submission failed");
  }

  return response.json();
}

export async function getSubmission(id) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/submissions/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
}

export async function getUserSubmissions(userId) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/submissions/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to load submissions");
  }

  return response.json();
}
