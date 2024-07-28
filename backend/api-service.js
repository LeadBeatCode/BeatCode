export const apiService = (function () {
  "use strict";
  const module = {};

  module.enqueue = function (userId, accessToken, socketId) {
    console.log("userId in enqueue", userId);
    console.log("accessToken", accessToken);
    console.log("socketId", socketId);
    return fetch("http://localhost:3000/api/queues/enqueue", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + accessToken,
      },
      body: JSON.stringify({ userId, socketId }),
    }).then((res) => res.json());
  };

  module.dequeue = function (socketId, accessToken) {
    return fetch("http://localhost:3000/api/queues/dequeue", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + accessToken,
      },
      body: JSON.stringify({ socketId }),
    }).then((res) => res.json());
  };

  module.deleteQueue = function (socketId, token) {
    return fetch("http://localhost:3000/api/queues", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ socketId }),
    }).then((res) => res.json());
  };

  module.getQueue = function () {
    return fetch("http://localhost:3000/api/queues").then((res) => res.json());
  };

  module.signup = function (username, password) {
    return fetch("http://localhost:3000/api/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    }).then((res) => res.json());
  };

  module.connect = function (username, password) {
    return fetch("http://localhost:3000/api/users/connect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    }).then((res) => res.json());
  };

  module.setPlayerStatus = function (id, status, token) {
    return fetch(`http://localhost:3000/api/rooms/${id}/playerStatus`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    }).then((res) => res.json());
  };

  module.createRoom = function (status, userId1, userId2, token, isPve) {
    return fetch("http://localhost:3000/api/rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status, isPve, userId1, userId2 }),
    }).then((res) => res.json());
  };

  module.getRoom = function (id, token) {
    return fetch(`http://localhost:3000/api/rooms/${id}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }).then((res) => res.json());
  };

  module.deleteRoom = function (id) {
    return fetch(`http://localhost:3000/api/rooms/${id}`, {
      method: "DELETE",
    }).then((res) => res.json());
  };

  module.clearUserSocket = function (socketId, token) {
    return fetch(`http://localhost:3000/api/users/clearSocket`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ socketId: socketId }),
    }).then((res) => res.json());
  };

  module.getFriendsById = function (id) {
    return fetch(`http://localhost:3000/api/friends/list/${id}`, {
      method: "GET",
    }).then((res) => res.json());
  };

  module.createProblem = function (
    title,
    description,
    input1,
    output1,
    input2,
    output2,
    input3,
    output3,
  ) {
    return fetch("http://localhost:3000/api/problems", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        input1,
        output1,
        input2,
        output2,
        input3,
        output3,
      }),
    }).then((res) => res.json());
  };

  return module;
})();
