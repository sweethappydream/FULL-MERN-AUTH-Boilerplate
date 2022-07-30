import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { updateUser, getCookie, signout } from "../helpers/auth";

const Admin = ({ history }) => {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const token = getCookie("token");
    const datas = await axios.get(`${process.env.REACT_APP_API_URL}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (datas && datas.data && datas.data.length > 0) {
      setUserData(datas.data);
    } else {
      toast.error(`Error To Your Information`);
      if (datas.response.status === 401) {
        signout(() => {
          history.push("/login");
        });
      }
    }
  };

  const handleSubmit = (_id, role) => {
    const token = getCookie("token");
    const data = role == "subscriber" ? "admin" : "subscriber";
    console.log(token, role);
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/admin/update`,
        {
          role: data,
          _id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        updateUser(res, () => {
          toast.success("Profile Updated Successfully");
          loadProfile();
        });
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <ToastContainer />
      <div className="max-w-screen-xl m-0 sm:m-20 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="mt-12 flex flex-col items-center">
          <h1 className="text-2xl xl:text-3xl font-extrabold">Admin Update</h1>

          <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="py-3 px-6">
                    User name
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Email
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Role
                  </th>
                </tr>
              </thead>
              <tbody>
                {userData.map((user) => {
                  return (
                    <tr
                      key={user._id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <th
                        scope="row"
                        className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {user.name}
                      </th>
                      <td className="py-4 px-6">{user.email}</td>
                      <td className="py-4 px-6">{user.role.role}</td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleSubmit(user._id, user.role.role)}
                          type="button"
                          className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                        >
                          ChangeRole
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="my-12 border-b text-center">
            <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
              Go To Home
            </div>
          </div>
          <div className="flex flex-col items-center">
            <a
              className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3
           bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline mt-5"
              href="/"
              target="_self"
            >
              <i className="fas fa-sign-in-alt fa 1x w-6  -ml-2 text-indigo-500" />
              <span className="ml-4">Home</span>
            </a>
          </div>
        </div>
      </div>
      ;
    </div>
  );
};

export default Admin;
