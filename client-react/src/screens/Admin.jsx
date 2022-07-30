import React, { useState, useEffect } from "react";
import authSvg from "../assests/update.svg";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { updateUser, isAuth, getCookie, signout } from "../helpers/auth";
import { Link, Redirect } from "react-router-dom";

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

    console.log(datas);
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

  const handleSubmit = (_id) => {
    const token = getCookie("token");
    console.log(token);
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/admin/update`,
        {
          role: "subscriber",
          _id
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
                  return (<tr key={user._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <th
                      scope="row"
                      className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {user.name}
                    </th>
                    <td className="py-4 px-6">{user.email}</td>
                    <td className="py-4 px-6">{user.role.role}</td>
                    <td className="py-4 px-6 text-right">
                      <button onClick={() => handleSubmit(user._id)}
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>)
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      ;
    </div>
  );
};

export default Admin;
