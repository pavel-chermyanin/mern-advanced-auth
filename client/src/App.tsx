import { observer } from "mobx-react-lite";
import React, { FC, useContext, useEffect, useState } from "react";
import { Context } from ".";
import LoginForm from "./components/LoginForm";
import { IUser } from "./models/IUser";
import UserService from "./services/UserService";

const App: FC = () => {
  const { store } = useContext(Context);
  const [users, setUsers] = useState<IUser[]>([]);
  useEffect(() => {
    if (localStorage.getItem("token")) {
      store.checkAuth();
    }
  }, []);

  async function getUsers() {
    try {
      const response = await UserService.fetchUsers();
      setUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  if (store.isLoading) {
    return <div className="">Загрузка...</div>;
  }

  if (!store.isAuth) {
    return (
      <div>
        <LoginForm />

        <button onClick={getUsers}>Получить пользователей</button>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>
        {store.isAuth
          ? `Пользователь авторизован ${store.user.email}`
          : "АВТОРИЗУЙТЕСЬ!"}
      </h1>
      <h2>
        {
          store.user.isActivated
          ? 'Аккаунт потвержден по почте'
          : 'ПОТВЕРДИТЕ АККАУНТ'
        }
      </h2>
      <button onClick={() => store.logout()}>Выйти</button>
      <div>
        <button onClick={getUsers}>Получить пользователей</button>
      </div>
      {users.map((user) => {
        return <div key={user.id}>{user.email}</div>;
      })}
    </div>
  );
};

export default observer(App);
