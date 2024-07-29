import dotenv from "dotenv";
export const apiService = (function () {
  "use strict";
  const module = {};
  dotenv.config();
  module.enqueue = function (userId, accessToken, socketId) {
    return fetch( "/api/queues/enqueue", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + accessToken,
      },
      body: JSON.stringify({ userId, socketId }),
    }).then((res) => res.json());
  };

  module.leetcodeEnqueue = function (userId, accessToken, socketId) {
    return fetch("/api/leetcodeQueues/enqueue", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + accessToken,
      },
      body: JSON.stringify({ userId, socketId }),
    }).then((res) => res.json());
  };

  module.dequeue = function (socketId, accessToken) {
    return fetch("/api/queues/dequeue", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + accessToken,
      },
      body: JSON.stringify({ socketId }),
    }).then((res) => res.json());
  };

  module.leetcodeDequeue = function (socketId, accessToken) {
    return fetch("/api/leetcodeQueues/dequeue", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + accessToken,
      },
      body: JSON.stringify({ socketId }),
    }).then((res) => res.json());
  }

  module.deleteQueue = function (id, token) {
    return fetch(`/api/queues/${id}` , {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
      },
    }).then((res) => res.json());
  };

  module.deleteLeetcodeQueue = function (id, token) {
    return fetch( `/api/leetcodeQueues/${id}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
      },
    }).then((res) => res.json());
  };

  module.getQueue = function () {
    return fetch( "/api/queues").then((res) => res.json());
  };

  module.getLeetcodeQueue = function () {
    return fetch("/api/leetcodeQueues").then((res) => res.json());
  };

  module.signup = function (username, password) {
    return fetch("/api/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    }).then((res) => res.json());
  };

  module.connect = function (username, password) {
    return fetch( "/api/users/connect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    }).then((res) => res.json());
  };

  module.setPlayerStatus = function (id, status, token) {
    return fetch(`/api/rooms/${id}/playerStatus`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    }).then((res) => res.json());
  };

  module.createRoom = function (status, userId1, userId2, token, isPve, questionTitleSlug, gameType) {
    return fetch( "/api/rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status, isPve, userId1, userId2, questionTitleSlug, gameType }),
    }).then((res) => res.json());
  };

  module.getRoom = function (id, token) {
    return fetch( `/api/rooms/${id}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }).then((res) => res.json());
  };

  module.deleteRoom = function (id) {
    return fetch(`/api/rooms/${id}`, {
      method: "DELETE",
    }).then((res) => res.json());
  };

  module.clearUserSocket = function (socketId, token) {
    return fetch(`/api/users/clearSocket`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ socketId: socketId }),
    }).then((res) => res.json());
  };

  module.getFriendsById = function (id) {
    return fetch(`/api/friends/list/${id}`, {
      method: "GET",
    }).then((res) => res.json());
  };

  module.createProblem = function (
    title,
    titleSlug,
    input1,
    output1,
    input2,
    output2,
    input3,
    output3,
  ) {
    return fetch( "/api/problems", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        titleSlug,
        input1,
        output1,
        input2,
        output2,
        input3,
        output3,
      }),
    }).then((res) => res.json());
  };

  module.getUserSocketId = function (nickname) {
    return fetch(`/api/users/${nickname}/socket`).then(
      (res) => res.json(),
    );
  };

  module.getRandomProblem = function () {
    return fetch( "/api/leetcode/random-problem").then((res) =>
      res.json(),
    );
  };
  
  return module;
})();
