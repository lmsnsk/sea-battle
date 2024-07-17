export const postRequest = async (pathname, sendData) => {
  const response = await fetch(pathname, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sendData),
    credentials: "include",
  });
  return response;
};

export const getData = async (pathname) => {
  try {
    const response = await fetch(pathname, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const data = await response.json();
    return data;
  } catch (er) {
    console.error(er);
  }
};

export const logoutRequest = async (pathname) => {
  try {
    await fetch(pathname, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
  } catch (er) {
    console.error(er);
  }
};

export const cleanField = (field) => {
  return field.map((row) => row.map(() => "0"));
};

export const removeLastShootsForView = (field) => {
  return field.map((row) =>
    row.map((el) => {
      if (el === "4") {
        return "2";
      } else if (el === "5") {
        return "3";
      } else {
        return el;
      }
    })
  );
};
